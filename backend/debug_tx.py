from web3 import Web3
import json

RPC_URL = "https://aeneid.storyrpc.io"
TX_HASH = "0xfa386380e47e6eecc158c40c539903feed40703338c9ef2307169b4eddbe60eb"

w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    print("❌ Failed to connect to RPC")
    exit()

print(f"🔍 Checking TX: {TX_HASH}")
try:
    receipt = w3.eth.get_transaction_receipt(TX_HASH)
    print(f"📄 Status: {receipt['status']} (1=Success, 0=Revert)")
    
    if receipt['status'] == 1:
        print(f"✅ Transaction Succeeded!")
        print(f"📜 Logs Count: {len(receipt['logs'])}")
        for i, log in enumerate(receipt['logs']):
            print(f"   [Log {i}] Address: {log['address']}")
            print(f"   Topics: {[t.hex() for t in log['topics']]}")
    else:
        print("❌ Transaction Reverted on-chain.")
        # Try to call using trace or debug if possible, but usually just inputs format check
        tx = w3.eth.get_transaction(TX_HASH)
        print("📥 Input Data:", tx['input'])

except Exception as e:
    print(f"⚠️ Error fetching receipt: {e}")
