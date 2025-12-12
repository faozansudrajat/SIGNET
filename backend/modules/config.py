import os
from dotenv import load_dotenv

load_dotenv()

# --- NETWORK CONFIG ---
RPC_URL = os.getenv("RPC_URL") 
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# --- ADDRESSES (AENEID TESTNET) ---
# Gunakan address yang sudah terbukti WORK di testing terakhir kamu
IP_ASSET_REGISTRY_ADDR = "0x77319B4031e6eF1250907aa00018B8B1c67a244b"
LICENSING_MODULE_ADDR = "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f"
PIL_TEMPLATE_ADDR = "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316"
NON_COMMERCIAL_TERMS_ID = 1 

# --- CONTRACT ABI ---
IP_ASSET_REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "chainid", "type": "uint256"},
            {"internalType": "address", "name": "tokenContract", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
        ],
        "name": "register",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "ipId", "type": "address"},
            {"indexed": True, "internalType": "uint256", "name": "chainId", "type": "uint256"},
            {"indexed": True, "internalType": "address", "name": "tokenContract", "type": "address"},
            {"indexed": True, "internalType": "uint256", "name": "tokenId", "type": "uint256"}
        ],
        "name": "IPRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "tokenContract", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
        ],
        "name": "ipId",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

NFT_CONTRACT_ADDRESS = "0x6dAc7fA7b8F2dCa71BF16b6DDCc1dECD76d974f8" # Pastikan ini contract Aeneid kamu

NFT_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "string", "name": "pHash", "type": "string"},
            {"internalType": "string", "name": "uri", "type": "string"}
        ],
        "name": "mintEvidence",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # 🔥 TAMBAHAN EVENT DEFINTION AGAR BISA SYNC DATABASE 🔥
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"indexed": False, "internalType": "string", "name": "pHash", "type": "string"},
            {"indexed": True, "internalType": "address", "name": "owner", "type": "address"},
            {"indexed": False, "internalType": "string", "name": "tokenUri", "type": "string"}  # ← TAMBAHAN
        ],
        "name": "EvidenceCreated",
        "type": "event"
    }
]

LICENSING_MODULE_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "ipId", "type": "address"},
            {"internalType": "address", "name": "licenseTemplate", "type": "address"},
            {"internalType": "uint256", "name": "licenseTermsId", "type": "uint256"},
            {"internalType": "bytes", "name": "licenseTermsData", "type": "bytes"}
        ],
        "name": "attachLicenseTerms",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]