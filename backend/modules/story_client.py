import time
import requests
from web3 import Web3
from web3.middleware import geth_poa_middleware
from .config import (
    RPC_URL, PRIVATE_KEY, 
    IP_ASSET_REGISTRY_ADDR, IP_ASSET_REGISTRY_ABI, 
    NFT_CONTRACT_ADDRESS, NFT_ABI,
    LICENSING_MODULE_ADDR, LICENSING_MODULE_ABI,
    PIL_TEMPLATE_ADDR, NON_COMMERCIAL_TERMS_ID
)

class StoryClient:
    def __init__(self):
        print("🔌 Initializing Story Protocol Connection...")
        if not RPC_URL: raise ValueError("❌ Error: RPC_URL missing")
        
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)

        if not self.w3.is_connected(): raise ConnectionError("❌ Failed to connect to RPC")
        
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)
        print(f"👤 Operator: {self.account.address}")

        self.registry = self.w3.eth.contract(address=self.w3.to_checksum_address(IP_ASSET_REGISTRY_ADDR), abi=IP_ASSET_REGISTRY_ABI)
        self.nft_contract = self.w3.eth.contract(address=self.w3.to_checksum_address(NFT_CONTRACT_ADDRESS), abi=NFT_ABI)
        self.licensing_module = self.w3.eth.contract(address=self.w3.to_checksum_address(LICENSING_MODULE_ADDR), abi=LICENSING_MODULE_ABI)

    def _extract_filename_from_ipfs(self, ipfs_uri):
        """Fetch IPFS metadata JSON dan extract filename (name field)"""
        try:
            # Convert ipfs://Qm... to Pinata gateway URL
            if not ipfs_uri or not ipfs_uri.startswith("ipfs://"):
                return None
            
            cid = ipfs_uri.replace("ipfs://", "")
            gateway_url = f"https://gateway.pinata.cloud/ipfs/{cid}"
            
            response = requests.get(gateway_url, timeout=5)
            
            if response.status_code == 200:
                metadata = response.json()
                return metadata.get("name", None)  # Extract "name" field (filename)
            else:
                return None
        except Exception as e:
            print(f"⚠️ Failed to fetch IPFS metadata: {e}")
            return None

    # FUNGSI BARU: TARIK SEMUA DATA DARI BLOCKCHAIN (NO LOCAL DB)
    def get_all_registered_assets(self):
        print("🔄 Syncing Assets from Blockchain History...")
        try:
            # Ambil semua event 'EvidenceCreated' dari Block 0 sampai Sekarang
            events = self.nft_contract.events.EvidenceCreated.get_logs(fromBlock=0)
            
            assets = []
            for event in events:
                token_uri = event['args'].get('tokenUri', '')  # ← Extract dari event (nama sesuai smart contract)    
                token_id = event['args']['tokenId']
                
                # Jika tokenUri ada, fetch filename dari IPFS
                filename = f"On-Chain Asset #{token_id}"
                if token_uri:
                    # Fetch dari IPFS untuk dapat filename
                    filename = self._extract_filename_from_ipfs(token_uri) or filename
                
                # Query IP ID yang sebenarnya dari IP Asset Registry
                ip_id = None
                try:
                    chain_id = self.w3.eth.chain_id
                    ip_id = self.registry.functions.ipId(
                        self.w3.to_checksum_address(NFT_CONTRACT_ADDRESS),
                        int(token_id)
                    ).call()
                    
                    # Check if IP ID is valid (not zero address)
                    if ip_id == "0x0000000000000000000000000000000000000000":
                        ip_id = None
                except Exception as e:
                    print(f"⚠️ Failed to query IP ID for token {token_id}: {e}")
                    ip_id = None
                
                # Use real IP ID if available, otherwise use placeholder
                ip_id_display = ip_id if ip_id else f"NFT-ONLY-{token_id}"
                
                assets.append({
                    "token_id": token_id,
                    "phash": event['args']['pHash'],
                    "owner": event['args']['owner'],
                    "tx_hash": event['transactionHash'].hex(),
                    "filename": filename,
                    "ip_id": ip_id_display,
                    "ipfs_metadata": token_uri  # ← Dari event (tokenUri)
                })
            
            print(f"✅ Synced {len(assets)} assets from Story Protocol.")
            return assets
        except Exception as e:
            print(f"❌ Sync Error: {e}")
            return []

    def register_ip_asset(self, nft_contract, token_id):
        try:
            print(f"⏳ Registering NFT {nft_contract} #{token_id} as IP Asset...")
            chain_id = self.w3.eth.chain_id
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.registry.functions.register(chain_id, self.w3.to_checksum_address(nft_contract), int(token_id)).build_transaction({'from': self.account.address, 'nonce': nonce, 'gas': 2000000, 'gasPrice': self.w3.eth.gas_price})
            signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"🚀 Registration Sent! Hash: {self.w3.to_hex(tx_hash)}")
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if receipt.status == 1:
                target_nft_clean = nft_contract.lower().replace("0x", "")
                for log in receipt['logs']:
                    topics_hex = [t.hex().lower() for t in log['topics']]
                    if any(target_nft_clean in t for t in topics_hex):
                        for t in topics_hex:
                            if target_nft_clean not in t:
                                potential_ip = "0x" + t[-40:]
                                if self.w3.is_address(potential_ip) and potential_ip != "0x0000000000000000000000000000000000000000":
                                    ip_id_checksum = self.w3.to_checksum_address(potential_ip)
                                    print(f"✅ Found IP ID in Logs: {ip_id_checksum}")
                                    return True, self.w3.to_hex(tx_hash), ip_id_checksum
                return True, self.w3.to_hex(tx_hash), None
            else: return False, "Reverted", None
        except Exception as e: return False, str(e), None

    def attach_license(self, ip_id_address):
        try:
            print(f"📜 Attaching License to {ip_id_address}...")
            custom_klausul = "No AI training, deepfake generation, or unauthorized editing allowed. Violations trigger DMCA takedown with perceptual hash (pHash) evidence from SIGNET."
            context_bytes = custom_klausul.encode('utf-8')
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.licensing_module.functions.attachLicenseTerms(self.w3.to_checksum_address(ip_id_address), self.w3.to_checksum_address(PIL_TEMPLATE_ADDR), int(NON_COMMERCIAL_TERMS_ID), context_bytes).build_transaction({'from': self.account.address, 'nonce': nonce, 'gas': 800000, 'gasPrice': self.w3.eth.gas_price})
            signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"📜 License Attached! Tx: {self.w3.to_hex(tx_hash)}")
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return True, self.w3.to_hex(tx_hash)
        except Exception as e:
            print(f"❌ Failed to attach license: {e}")
            return False, str(e)

    def mint_nft(self, p_hash, token_uri): 
        try:
            print(f"creating NFT transaction for hash: {p_hash[:10]}...")
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.nft_contract.functions.mintEvidence(self.account.address, p_hash, token_uri).build_transaction({'from': self.account.address, 'nonce': nonce, 'gas': 2000000, 'gasPrice': self.w3.eth.gas_price})
            signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"⛏️ Minting NFT... Hash: {self.w3.to_hex(tx_hash)}")
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            if receipt.status == 0: 
                print("❌ Transaction Status 0 (Reverted)")
                return False, None, f"Reverted (Hash: {self.w3.to_hex(tx_hash)})"
            if not receipt['logs']: 
                print("❌ Transaction Success but No Logs found")
                return False, None, "No Logs Found"
            token_id = int(receipt['logs'][0]['topics'][-1].hex(), 16)
            print(f"✅ NFT Minted! ID: {token_id}")
            return True, token_id, self.w3.to_hex(tx_hash)
        except Exception as e: return False, None, str(e)