# ipfs_client.py

import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

PINATA_JWT = os.getenv("PINATA_JWT")

def upload_file_to_ipfs(file_path):
    """Uploads binary file (Video/Image) to IPFS via Pinata"""
    if not PINATA_JWT:
        print("⚠️ PINATA_JWT not found. Using dummy hash.")
        return "bafkreibm6jg3yx5..." 

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    
    try:
        filename = os.path.basename(file_path)
        headers = {"Authorization": f"Bearer {PINATA_JWT}"}
        
        with open(file_path, "rb") as f:
            files = {"file": (filename, f)}
            # Added timeout=60s to prevent hanging
            response = requests.post(url, files=files, headers=headers, timeout=60)
            
        if response.status_code == 200:
            cid = response.json()['IpfsHash']
            print(f"✅ File uploaded to IPFS: {cid}")
            return cid
        else:
            print(f"❌ Pinata Upload Error: {response.text}")
            return None
    except requests.exceptions.Timeout:
        print("❌ IPFS Timeout! Sepertinya koneksi ke Pinata diblokir/lambat (IndiHome?). Coba pakai VPN.")
        return None
    except Exception as e:
        print(f"❌ IPFS Error: {e}")
        return None

def upload_metadata_to_ipfs(name, description, p_hash, file_cid, mime_type="video/mp4"):
    """Creates JSON Metadata and uploads it to IPFS"""
    if not PINATA_JWT:
        return f"ipfs://signet/{p_hash}"

    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    
    metadata = {
        "name": name,
        "description": description,
        "image": f"ipfs://{file_cid}",
        "attributes": [
            {"trait_type": "pHash", "value": p_hash},
            {"trait_type": "Content Type", "value": mime_type},
            {"trait_type": "Protection", "value": "SIGNET Protected"}
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {PINATA_JWT}"
    }

    try:
        response = requests.post(url, json=metadata, headers=headers, timeout=60)
        if response.status_code == 200:
            cid = response.json()['IpfsHash']
            final_uri = f"ipfs://{cid}"
            print(f"✅ Metadata uploaded to IPFS: {final_uri}")
            return final_uri
        else:
            print(f"❌ Pinata Metadata Error: {response.text}")
            return None
    except requests.exceptions.Timeout:
        print("❌ IPFS Metadata Timeout! Koneksi lambat/diblokir.")
        return None
    except Exception as e:
        print(f"❌ IPFS Metadata Error: {e}")
        return None