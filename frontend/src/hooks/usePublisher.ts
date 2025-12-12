import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "authorizedPublishers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function usePublisher() {
  const { address, isConnected } = useAccount();

  // Check if address is authorized publisher
  const { data: isPublisher, isLoading: isLoadingPublisher } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "authorizedPublishers",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000, // Refetch every 5 seconds to ensure fresh data
    },
  });

  // Check if address is owner
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "owner",
    query: {
      enabled: isConnected,
      refetchInterval: 5000, // Refetch every 5 seconds to ensure fresh data
    },
  });

  // Debug logging (remove in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[usePublisher] Debug:", {
      contractAddress: CONTRACT_ADDRESS, // Show which contract is being checked
      address,
      owner,
      isConnected,
      isPublisher,
      isOwner:
        isConnected &&
        !!owner &&
        !!address &&
        address.toLowerCase() === (owner as string).toLowerCase(),
    });
  }

  const isOwner =
    isConnected &&
    !!owner &&
    !!address &&
    typeof owner === "string" &&
    address.toLowerCase() === owner.toLowerCase();

  return {
    isPublisher: isPublisher === true, // Explicitly convert to boolean
    isOwner: isOwner,
    isLoading: isLoadingPublisher || isLoadingOwner,
    isConnected,
    address,
  };
}
