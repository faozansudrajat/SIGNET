import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import {
  BLOCKCHAIN_CONFIG,
  EIP712_DOMAIN,
  EIP712_TYPES,
} from "../config/blockchain";
import {
  getNonce,
  encodeRegisterContent,
  buildForwardRequest,
  signForwardRequest,
} from "../utils/blockchain";
import { getPHash } from "../lib/api";

export function useGaslessRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    txHash: string;
    pHash: string;
  } | null>(null);
  const [step, setStep] = useState<string>(""); // To show progress
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const register = async (file: File, title: string, description: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStep("Initializing...");

    try {
      // 1. Check if wallet is connected
      if (!address || !walletClient) {
        throw new Error("Please connect your wallet first!");
      }

      // 2. Get signer from connected wallet
      setStep("Connecting to wallet...");
      if (!window.ethereum) {
        throw new Error(
          "No wallet extension found. Please install MetaMask or another compatible wallet."
        );
      }

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const userAddress = address || signerAddress;

      // Verify the address matches the connected wallet from wagmi
      if (address && signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error(
          `Wallet mismatch detected. Connected wallet: ${address}, Selected wallet: ${signerAddress}. ` +
            "Please disconnect and reconnect with the correct wallet, or disable other wallet extensions."
        );
      }

      console.log("User address:", userAddress);
      console.log("BLOCKCHAIN_CONFIG:", BLOCKCHAIN_CONFIG);

      // Validate required config
      if (!BLOCKCHAIN_CONFIG.REGISTRY_ADDRESS) {
        throw new Error(
          "VITE_REGISTRY_ADDRESS not set in .env file. Please add it and restart dev server."
        );
      }
      if (!BLOCKCHAIN_CONFIG.FORWARDER_ADDRESS) {
        throw new Error(
          "VITE_FORWARDER_ADDRESS not set in .env file. Please add it and restart dev server."
        );
      }

      // 2. Check authorization
      setStep("Checking authorization...");
      const publisherCheckResponse = await fetch(
        `${BLOCKCHAIN_CONFIG.API_URL}/api/publisher/${userAddress}`
      );

      if (!publisherCheckResponse.ok) {
        throw new Error("Failed to check publisher status");
      }

      const publisherStatus = await publisherCheckResponse.json();

      if (!publisherStatus.is_authorized) {
        throw new Error(
          "You are not an authorized publisher. Please contact support."
        );
      }

      // 3. Get pHash from file
      setStep("Generating content hash...");
      const pHash = await getPHash(file);
      console.log("Generated pHash:", pHash);

      // 4. Get nonce
      setStep("Getting nonce...");
      const nonce = await getNonce(userAddress);
      console.log("Current nonce:", nonce);

      // 5. Encode function call
      console.log("Encoding with params:", { pHash, title, description });
      const encodedData = encodeRegisterContent(pHash, title, description);
      console.log("Encoded data:", encodedData);

      // 6. Build ForwardRequest
      console.log("Building ForwardRequest with:", {
        userAddress,
        encodedData,
        nonce,
      });
      const forwardRequest = buildForwardRequest(
        userAddress,
        encodedData,
        nonce
      );
      console.log("ForwardRequest:", forwardRequest);

      // 7. Sign request
      setStep("Waiting for signature...");
      console.log("Requesting signature...");
      console.log("EIP712_DOMAIN:", EIP712_DOMAIN);
      console.log("EIP712_TYPES:", EIP712_TYPES);
      const signature = await signForwardRequest(signer, forwardRequest);
      console.log("Signature:", signature);

      // 8. Submit to backend
      setStep("Submitting to blockchain...");
      // Backend expects FormData (multipart/form-data), not JSON
      const formData = new FormData();
      formData.append("publisher_address", userAddress);
      formData.append("p_hash", pHash);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("signature", signature);

      const registerResponse = await fetch(
        `${BLOCKCHAIN_CONFIG.API_URL}/api/register-content`,
        {
          method: "POST",
          body: formData, // Don't set Content-Type header, browser will set it with boundary
        }
      );

      if (!registerResponse.ok) {
        let errorMessage = "Failed to register content";
        try {
          const errorData = await registerResponse.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${registerResponse.status}: ${registerResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await registerResponse.json();
      console.log("Success!", data);

      setResult({
        txHash: data.tx_hash || data.txHash,
        pHash: pHash,
      });

      setStep("Done!");
      return data;
    } catch (err: any) {
      console.error("Gasless registration error:", err);
      let errorMessage = err.message || "An error occurred";

      if (err.code === "ACTION_REJECTED") {
        errorMessage = "You rejected the transaction signature.";
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  return {
    register,
    loading,
    error,
    result,
    step,
  };
}
