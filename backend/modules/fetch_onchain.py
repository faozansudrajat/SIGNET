# fetch_onchain.py
import json
from web3 import Web3
from config import RPC_URL, NFT_CONTRACT_ADDRESS

# --- KONFIGURASI TAMBAHAN ---
# Kita butuh ABI khusus untuk "Membaca" (tokenURI), 
# karena ABI di config.py tadi cuma buat "Menulis" (mint).
READ_ABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

def scan_blockchain():
    print(f"🔌 Connecting to Story Protocol: {RPC_URL}")
    print(f"📜 Scanning Contract: {NFT_CONTRACT_ADDRESS}...\n")

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    
    if not w3.is_connected():
        print("❌ Gagal connect ke RPC.")
        return

    contract = w3.eth.contract(address=NFT_CONTRACT_ADDRESS, abi=READ_ABI)
    
    found_assets = []
    token_id = 0
    max_scan = 50 # Batas aman biar gak infinite loop kalau error

    # Loop Scanning
    while token_id < max_scan:
        try:
            # 1. Coba ambil URI dari Token ID ini
            # Kalau token belum ada, line ini bakal ERROR dan loncat ke 'except'
            uri = contract.functions.tokenURI(token_id).call()
            owner = contract.functions.ownerOf(token_id).call()

            # 2. Parsing Data (Format kita: ipfs://signet/{pHash})
            # Kita bersihkan string-nya biar dapet pHash murni
            phash_extracted = uri.replace("ipfs://signet/", "")

            print(f"✅ Found Token #{token_id}!")

            found_assets.append({
                "Token ID": token_id,
                "Owner": owner,
                "Raw URI": uri,
                "Extracted pHash": phash_extracted
            })
            
            # Lanjut ke ID berikutnya
            token_id += 1

        except Exception as e:
            # Error biasanya berarti "ERC721: invalid token ID" 
            # Artinya kita sudah sampai di ujung data. Stop loop.
            # Uncomment baris bawah kalau mau liat error aslinya:
            # print(f"⏹️ Stop scanning at ID {token_id} (Not found)")
            break

    # --- OUTPUT HASIL ---
    print("\n" + "="*40)
    print(f"📊 HASIL SCANNING ON-CHAIN ({len(found_assets)} Assets)")
    print("="*40)
    
    if found_assets:
        print(json.dumps(found_assets, indent=4))
    else:
        print("📭 Tidak ada aset ditemukan di contract ini.")

if __name__ == "__main__":
    scan_blockchain()