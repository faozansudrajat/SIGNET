---

# **SIGNET: The Universal Shield for Digital Content**

### **Project Overview**
SIGNET is a decentralized "Security-as-a-Service" platform designed to protect content creators from piracy, unauthorized usage, and the growing threat of AI-driven identity theft.
In an era where digital content can be stolen, reposted, or cloned in seconds, traditional copyright methods are too slow and ineffective. SIGNET solves this by combining **AI Forensics (Perceptual Hashing)** with the **Immutable Legal Framework of Story Protocol**.
We don't just detect fake or stolen content; we provide creators with undeniable, on-chain proof of ownership and programmable licensing that legally prohibits all forms of exploitation.

### **The Problem**
1.  **Rampant Content Theft:** Creators lose billions to piracy, "right-click saving," and unauthorized re-uploads across social platforms.
2.  **AI & Identity Abuse:** Deepfakes and generative AI have weaponized identity theft, making it harder to distinguish original work from fabrications.
3.  **Slow Legal Process:** Proving ownership of viral content and issuing takedowns is manual, expensive, and often too late.

### **The Solution: SIGNET**
SIGNET creates a unique "Digital Fingerprint" for every uploaded asset, registers it on the blockchain, and empowers a community of "Hunters" to police the internet for infringement.

### **Key Features**
* 🛡️ **Immutable IP Registration:** Creators upload content via a Web3 Dashboard. SIGNET mints this as an **IP Asset** on Story Protocol, creating a permanent timestamped record of ownership that acts as the global source of truth.
* 🧠 **Robust Fingerprinting (pHash):** We use Perceptual Hashing (pHash) to generate a unique ID for images/videos. Unlike traditional file hashes (MD5), pHash detects stolen content even if it has been resized.
* 🚫 **Comprehensive Protection Licensing:** Every registered asset is automatically attached with a **Strict Protection License** on-chain. The custom clause covers all bases: *"Strictly Non-Commercial. No unauthorized reproduction, modification, distribution, or AI model training."*
* 🔍 **Universal Theft Detection:** Users can scan suspicious content against our registry. If a match is found (based on Hamming Distance), SIGNET generates an automated **Legal Evidence PDF** for DMCA takedowns—whether for a stolen meme, a pirated video, or a deepfake.

### **Business Model (Web3 Native)**
We utilize a sustainable "Protection & Bounty" economy:
1.  **Protection Fee (Minting):** Creators pay a small fee (in IP Tokens) to register and protect their assets against all threats. This creates the platform's revenue and treasury.
2.  **The Bounty Hunter System:** A portion of the fees goes into a **Community Bounty Pool**. Decentralized "Hunters" are incentivized to scan and report stolen or infringing content. If their report leads to a successful takedown or claim, they earn a bounty.
3.  **Verification API (B2B):** (Future Roadmap) Media companies and platforms pay to access our API to verify content authenticity and ownership status before publishing news.

### **Technical Architecture**
* **Frontend:** Next.js (React) with Wallet Connect (Web3 Native).
* **Backend:** Python (FastAPI) acting as the **Forensic Oracle**.
    * *Modules:* `signet_core` (Forensic Logic), `ipfs_client` (Storage), `story_client` (Blockchain Data Sync).
* **AI Layer:** Perceptual Hashing (pHash) & Hamming Distance algorithms (OpenCV/NumPy).
* **Storage:** IPFS via **Pinata** (Decentralized Metadata Storage).
* **Blockchain:** **Story Protocol (Aeneid Testnet)**.
    * *Contracts:* Custom `SignetNFT.sol` with payable minting functions.
    * *Modules:* IP Asset Registry, Licensing Module (PIL).

### **How It Works (User Flow)**
1.  **Connect & Protect:** The user connects their wallet to the SIGNET Dashboard.
2.  **Upload & Fingerprint:** The user uploads a file. The backend generates a pHash and uploads the evidence to IPFS.
3.  **Mint & License:** The user signs a transaction to mint the IP Asset and attach the **"Total Protection"** License Terms on-chain.
4.  **Monitor:** The asset is now live in the global registry, protected against theft and misuse.
5.  **Scan & Enforce:** Anyone can upload suspicious content to check if it infringes on a protected SIGNET asset. If a match is found, a legal report is generated instantly for enforcement.

