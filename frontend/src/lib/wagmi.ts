import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";

// Get the project ID from environment variables
const projectId = import.meta.env.VITE_PROJECT_ID;

// Define Story Protocol Aeneid Testnet
const storyAeneid = defineChain({
  id: 1315,
  name: "Story Aeneid",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://aeneid.storyrpc.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "StoryScan",
      url: "https://aeneid.storyrpc.io",
    },
  },
  testnet: true,
  // Add icon URL to prevent Web3Modal from trying to fetch undefined assets
  iconUrl: "https://story.foundation/favicon.ico", // Story Protocol logo
});

// Create a metadata object - this is used for the wallet connection modal
const metadata = {
  name: "SIGNET",
  description:
    "AI-powered, blockchain-backed platform to authenticate digital content",
  url: "https://signet.app", // optional
  icons: ["https://signet.app/logo.png"], // optional
};

// Create the Wagmi Adapter - Story Protocol Aeneid Testnet
const wagmiAdapter = new WagmiAdapter({
  networks: [storyAeneid],
  projectId,
});

// Get the wagmi config from the adapter
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create the AppKit instance - Story Protocol Aeneid Testnet
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [storyAeneid],
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#5227FF",
  },
});

// Contract address - read from environment variable or use default
// This should point to the SignetNFT contract address for authorization checks
// Priority: VITE_NFT_CONTRACT_ADDRESS > VITE_REGISTRY_ADDRESS > VITE_CONTRACT_ADDRESS > hardcoded fallback
// Make sure to set VITE_NFT_CONTRACT_ADDRESS in your .env file
export const CONTRACT_ADDRESS = (import.meta.env.VITE_NFT_CONTRACT_ADDRESS ||
  "0x6dAc7fA7b8F2dCa71BF16b6DDCc1dECD76d974f8") as  // SignetNFT contract address
`0x${string}`;
