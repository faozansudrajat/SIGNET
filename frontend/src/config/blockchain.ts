export const BLOCKCHAIN_CONFIG = {
  // Story Protocol Testnet (Aeneid) Contract Addresses
  // These are used by the backend, frontend mainly needs API_URL
  IP_ASSET_REGISTRY_ADDR:
    import.meta.env.VITE_IP_ASSET_REGISTRY_ADDR ||
    "0x77319A401d08E9447eF39eafb713e67500b5C63B",
  LICENSING_MODULE_ADDR:
    import.meta.env.VITE_LICENSING_MODULE_ADDR ||
    "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f",
  PIL_TEMPLATE_ADDR:
    import.meta.env.VITE_PIL_TEMPLATE_ADDR ||
    "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
  NFT_CONTRACT_ADDRESS:
    import.meta.env.VITE_NFT_CONTRACT_ADDRESS ||
    "0x6dAc7fA7b8F2dCa71BF16b6DDCc1dECD76d974f8",

  // Network - Story Protocol Aeneid Testnet
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID) || 1315, // Aeneid testnet chain ID
  CHAIN_NAME:
    import.meta.env.VITE_CHAIN_NAME || "Story Protocol Aeneid Testnet",
  RPC_URL: import.meta.env.VITE_RPC_URL || "", // Should be set in backend .env

  // Backend API - Story Protocol Backend
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",

  // Gasless Transaction (Optional - not used with Story Protocol backend)
  FORWARDER_ADDRESS: import.meta.env.VITE_FORWARDER_ADDRESS || "",
  REGISTRY_ADDRESS: import.meta.env.VITE_REGISTRY_ADDRESS || "",
};

// Debug logging in development
if (typeof window !== "undefined" && import.meta.env.DEV) {
  console.log("🔧 BLOCKCHAIN_CONFIG Loaded:", BLOCKCHAIN_CONFIG);
  console.log("📝 Environment Variables:", {
    VITE_FORWARDER_ADDRESS: import.meta.env.VITE_FORWARDER_ADDRESS,
    VITE_REGISTRY_ADDRESS: import.meta.env.VITE_REGISTRY_ADDRESS,
    VITE_CHAIN_ID: import.meta.env.VITE_CHAIN_ID,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  });
}

// EIP-712 Domain for MinimalForwarder
export const EIP712_DOMAIN = {
  name: "MinimalForwarder",
  version: "1.0.0",
  chainId: BLOCKCHAIN_CONFIG.CHAIN_ID,
  verifyingContract: BLOCKCHAIN_CONFIG.FORWARDER_ADDRESS as `0x${string}`,
};

// EIP-712 Types
export const EIP712_TYPES = {
  ForwardRequest: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
  ],
};
