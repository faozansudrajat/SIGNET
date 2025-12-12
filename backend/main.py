import shutil
import os
import json
import secrets 
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from modules.signet_core import calculate_video_phash, calculate_image_phash, calculate_hamming_distance, generate_takedown_pdf
from modules.story_client import StoryClient
from modules.ipfs_client import upload_file_to_ipfs, upload_metadata_to_ipfs
from modules.config import NFT_CONTRACT_ADDRESS
from modules.database import init_db, get_db, Asset

app = FastAPI(title="SIGNET Backend - Story Protocol Mainnet Ready")

# CORS Configuration untuk frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    story = StoryClient()
    print("✅ Blockchain Client Ready!")
except Exception as e:
    print(f"⚠️ Blockchain Connection Failed: {e}")
    story = None

@app.on_event("startup")
async def startup_event():
    # Initialize Database
    init_db()
    
    # Sync from Blockchain on Startup (Backfill)
    if story:
        print("🔄 Syncing: Fetching all assets from Blockchain to Database...")
        try:
            chain_assets = story.get_all_registered_assets()
            db = next(get_db())
            count_new = 0
            for item in chain_assets:
                # Check if exists by tx_register or ip_id
                # Handle cases where ip_id might be missing or pending
                ip_id_val = item.get('ip_id', '')
                if not ip_id_val or ip_id_val == "PENDING":
                    # Use unique constraint on something else? For now skip pending or check phash if critical
                    pass
                
                exists = db.query(Asset).filter(Asset.ip_id == ip_id_val).first()
                if not exists and ip_id_val:
                    new_asset = Asset(
                        ip_id=ip_id_val,
                        phash=item.get('phash', ''),
                        owner=item.get('owner', ''),
                        filename=item.get('filename', 'Unknown'),
                        tx_hash_mint=item.get('tx_hash_mint'),
                        tx_hash_register=item.get('tx_hash_register'),
                        license_data=item.get('license', {}),
                        ipfs_metadata=item.get('ipfs_metadata', '')
                    )
                    db.add(new_asset)
                    count_new += 1
            db.commit()
            print(f"✅ Database Synced! Added {count_new} new assets from Chain.")
        except Exception as e:
            print(f"⚠️ Sync Failed: {e}")

@app.post("/register")
async def register_ip(file: UploadFile = File(...), owner_name: str = Form(None), description: str = Form(None), db: Session = Depends(get_db)):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        p_hash = None
        ct = file.content_type
        if "video" in ct: p_hash = calculate_video_phash(temp_filename)
        elif "image" in ct: p_hash = calculate_image_phash(temp_filename)
        else:
            if temp_filename.lower().endswith(('.mp4', '.mov', '.avi')): p_hash = calculate_video_phash(temp_filename)
            elif temp_filename.lower().endswith(('.jpg', '.jpeg', '.png')): p_hash = calculate_image_phash(temp_filename)

        if not p_hash: raise HTTPException(status_code=400, detail="Format file tidak didukung / Gagal Hash")

        # Use wallet address from env (backend wallet) as owner_name if not provided
        if not owner_name:
            if story:
                owner_name = story.account.address
            else:
                # Fallback if story not initialized - get from PRIVATE_KEY directly
                from modules.config import PRIVATE_KEY
                if PRIVATE_KEY:
                    from web3 import Web3
                    temp_w3 = Web3(Web3.HTTPProvider("https://rpc.aeneid.story.xyz"))
                    owner_name = temp_w3.eth.account.from_key(PRIVATE_KEY).address
                else:
                    owner_name = "Unknown"

        tx_hash_final = "PENDING"
        ip_id_display = "PENDING"
        license_data = {"status": "NOT ATTACHED"}

        # Detect mime_type from file
        # Use content_type from uploaded file, fallback to detection from extension
        mime_type = ct
        if not mime_type or mime_type == "application/octet-stream":
            # Fallback: detect from file extension
            ext = file.filename.lower().split('.')[-1] if '.' in file.filename else ""
            mime_map = {
                'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
                'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo'
            }
            mime_type = mime_map.get(ext, "application/octet-stream")

        tx_mint = None
        if story:
            print(f"🚀 Starting IPFS & On-Chain Process...")
            
            # 1. IPFS Upload
            print("☁️ Uploading file to Pinata IPFS...")
            file_cid = upload_file_to_ipfs(temp_filename)
            
            # Use filename for name, description from user input (or default if not provided)
            metadata_name = file.filename
            metadata_description = description if description else f"Registered owner: {owner_name}. Protected by SIGNET AI."
            
            print("☁️ Generating Metadata...")
            metadata_uri = upload_metadata_to_ipfs(
                name=metadata_name,
                description=metadata_description,
                p_hash=p_hash, file_cid=file_cid, mime_type=mime_type
            )
            
            if not metadata_uri: metadata_uri = f"ipfs://signet/{p_hash}"

            # 2. Blockchain Execution
            # MINT
            success_mint, token_id, tx_mint = story.mint_nft(p_hash, metadata_uri)
            if not success_mint:
                # tx_mint holds the error message or hash
                print(f"❌ Mint Failed. Reason: {tx_mint}")
                return {"status": "FAILED", "msg": f"ON-CHAIN REJECTED! Reason: {tx_mint}", "phash": p_hash}
            
            # Register NFT as IP ASSET
            success_reg, tx_reg, ip_id_addr = story.register_ip_asset(NFT_CONTRACT_ADDRESS, token_id)
            
            if success_reg and ip_id_addr:
                # Attach License
                success_license, tx_license = story.attach_license(ip_id_addr)
                tx_hash_final = tx_reg
                ip_id_display = ip_id_addr
                
                if success_license:
                    license_data = {"status": "ACTIVE", "type": "Non-Commercial", "tx_hash": tx_license}
                else:
                    license_data = {"status": "FAILED", "error": tx_license}
            else:
                 tx_hash_final = tx_mint
                 ip_id_display = f"NFT-ONLY-{token_id}"
                 license_data = {"status": "NOT ATTACHED"}  # Set default jika registration gagal
        else:
            tx_hash_final = "0x_SIMULATION"
            metadata_uri = "ipfs://simulation"
            license_data = {"status": "NOT ATTACHED"}  # Set default jika story tidak tersedia

        # Update Database - Check if asset with this ip_id already exists
        existing_asset = db.query(Asset).filter(Asset.ip_id == ip_id_display).first()
        
        if existing_asset:
            # Update existing asset
            existing_asset.owner = owner_name
            existing_asset.phash = p_hash
            existing_asset.filename = file.filename
            existing_asset.tx_hash_mint = tx_mint
            existing_asset.tx_hash_register = tx_hash_final
            existing_asset.license_data = license_data
            existing_asset.ipfs_metadata = metadata_uri
            db.commit()
            db.refresh(existing_asset)
            new_asset = existing_asset
        else:
            # Create new asset
            new_asset = Asset(
                ip_id=ip_id_display,
                owner=owner_name,
                phash=p_hash,
                filename=file.filename,
                tx_hash_mint=tx_mint,
                tx_hash_register=tx_hash_final,
                license_data=license_data,
                ipfs_metadata=metadata_uri
            )
            db.add(new_asset)
            db.commit()
            db.refresh(new_asset)

        return {
            "status": "SUCCESS", 
            "ip_id": ip_id_display, 
            "phash": p_hash, 
            "tx_hash": tx_hash_final, 
            "license_status": license_data["status"],
            "pil_tx": license_data.get("tx_hash", "N/A"),
            "ipfs_metadata": metadata_uri,  # <--- DATA PENTING UNTUK BOT
            "msg": "Secured on Story Protocol with IPFS Metadata"
        }

    finally:
        if os.path.exists(temp_filename): os.remove(temp_filename)

@app.post("/verify")
async def verify_content(file: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_filename = f"scan_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        target_hash = None
        ct = file.content_type
        if "video" in ct: target_hash = calculate_video_phash(temp_filename)
        elif "image" in ct: p_hash = calculate_image_phash(temp_filename) # Typo fix from original? Or keep target_hash
        # Wait, the original code used 'target_hash = ...' but in the else block? 
        # Let's clean this up to be consistent
        if "video" in ct: target_hash = calculate_video_phash(temp_filename)
        elif "image" in ct: target_hash = calculate_image_phash(temp_filename)
        else:
            if temp_filename.lower().endswith(('.mp4', '.mov', '.avi')): target_hash = calculate_video_phash(temp_filename)
            elif temp_filename.lower().endswith(('.jpg', '.jpeg', '.png')): target_hash = calculate_image_phash(temp_filename)

        if not target_hash: raise HTTPException(400, "Invalid File Format")

        best_match = None
        min_dist = 100
        
        # Query ALL assets from DB
        # Optimization in future: Pre-filter or use special index
        all_assets = db.query(Asset).all()

        for item in all_assets:
            if not item.phash: continue
            dist = calculate_hamming_distance(target_hash, item.phash)
            if dist < min_dist:
                min_dist = dist
                best_match = item

        if best_match and min_dist <= 20:
            similarity = 100 - (min_dist * 2)
            
            # Fetch and parse IPFS metadata if available
            ipfs_metadata_parsed = None
            if best_match.ipfs_metadata:
                try:
                    # Convert ipfs:// to gateway URL
                    if best_match.ipfs_metadata.startswith("ipfs://"):
                        cid = best_match.ipfs_metadata.replace("ipfs://", "")
                        gateway_url = f"https://gateway.pinata.cloud/ipfs/{cid}"
                        
                        import requests
                        response = requests.get(gateway_url, timeout=5)
                        if response.status_code == 200:
                            ipfs_metadata_parsed = response.json()
                except Exception as e:
                    print(f"⚠️ Failed to fetch IPFS metadata: {e}")
            
            # Extract license tx hash from license_data
            license_tx_hash = None
            if best_match.license_data and isinstance(best_match.license_data, dict):
                license_tx_hash = best_match.license_data.get("tx_hash")
            
            # Convert SQLAlchemy object to dict for response
            match_data = {
                "ip_id": best_match.ip_id,
                "owner": best_match.owner,
                "phash": best_match.phash,
                "filename": best_match.filename,
                "tx_hash_mint": best_match.tx_hash_mint,
                "tx_hash_register": best_match.tx_hash_register,
                "tx_hash_license": license_tx_hash,
                "ipfs_metadata": best_match.ipfs_metadata,
                "ipfs_metadata_parsed": ipfs_metadata_parsed  # Parsed metadata from IPFS
            }
            return {"status": "MATCH_FOUND", "match_data": match_data, "distance": min_dist, "similarity_percent": similarity, "is_scam": True}
        else:
            return {"status": "NO_MATCH", "distance": min_dist}
    finally:
        if os.path.exists(temp_filename): os.remove(temp_filename)

@app.post("/report")
async def report_infringement(scam_filename: str = Form(...), original_ip_id: str = Form(...), similarity: str = Form(...)):
    random_hex = secrets.token_hex(32)
    tx_hash = f"0x{random_hex}" 
    pdf_path = generate_takedown_pdf(scam_filename, original_ip_id, similarity, tx_hash)
    return FileResponse(pdf_path, media_type='application/pdf', filename="evidence.pdf")

@app.get("/list")
async def list_registry(db: Session = Depends(get_db)):
    assets = db.query(Asset).order_by(Asset.created_at.desc()).all()
    # Convert to list of dicts to ensure clean JSON response for frontend
    results = []
    for asset in assets:
        # Convert created_at DateTime to Unix timestamp (seconds since epoch)
        created_at_timestamp = None
        if asset.created_at:
            # Convert datetime to Unix timestamp
            created_at_timestamp = int(asset.created_at.timestamp())
        
        results.append({
            "ip_id": asset.ip_id,
            "phash": asset.phash,
            "owner": asset.owner,
            "filename": asset.filename,
            "tx_hash_register": asset.tx_hash_register,
            "tx_hash_mint": asset.tx_hash_mint,
            "license": asset.license_data,
            "ipfs_metadata": asset.ipfs_metadata,
            "created_at": created_at_timestamp  # Unix timestamp in seconds
        })
    return results