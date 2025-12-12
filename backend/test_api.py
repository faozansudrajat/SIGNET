import requests
import json

try:
    response = requests.get("http://127.0.0.1:8000/list")
    data = response.json()
    print("✅ /list response status:", response.status_code)
    print("📦 Data received:", json.dumps(data[:1], indent=2) if data else "[]")
    
    if data:
        keys = data[0].keys()
        print("🔑 Keys present:", list(keys))
        expected_keys = ["ip_id", "phash", "owner", "filename", "tx_hash_register", "license_data"]
        missing = [k for k in expected_keys if k not in keys]
        if missing:
            print("⚠️ Missing keys expected by frontend:", missing)
        else:
            print("✨ JSON Format looks compatible with Frontend!")
    else:
        print("⚠️ Database is empty, cannot verify keys.")
        
except Exception as e:
    print("❌ Failed to connect to backend:", e)
    print("Make sure uvicorn is running!")
