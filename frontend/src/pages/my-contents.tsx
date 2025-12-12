import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MoreVertical,
  ExternalLink,
  Clock,
  Hash,
  Loader2,
  Database,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getMyContents } from "@/lib/api";

// Helper to format address

// Helper function to format TX Hash with 0x prefix
const formatTxHash = (txHash: string) => {
  if (!txHash) return "";
  // Ensure 0x prefix
  const hash = txHash.startsWith("0x") ? txHash : `0x${txHash}`;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

// Helper to format time ago
const formatTimeAgo = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

// Helper to format date
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper to get file URL from IPFS metadata
const getFileUrlFromMetadata = async (
  metadataUri: string
): Promise<string | null> => {
  if (!metadataUri || !metadataUri.startsWith("ipfs://")) {
    return null;
  }

  try {
    const gatewayUrl = metadataUri.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    );
    const response = await fetch(gatewayUrl);
    if (!response.ok) return null;

    const metadata = await response.json();
    // Extract file URL from metadata.image (format: ipfs://CID)
    const imageUri = metadata.image || metadata.video || metadata.animation_url;
    if (imageUri) {
      if (imageUri.startsWith("ipfs://")) {
        return imageUri.replace(
          "ipfs://",
          "https://gateway.pinata.cloud/ipfs/"
        );
      }
      return imageUri;
    }
    return null;
  } catch (error) {
    console.error("Error fetching file URL from metadata:", error);
    return null;
  }
};

// Helper to get description from IPFS metadata
const getDescriptionFromMetadata = async (
  metadataUri: string
): Promise<string | null> => {
  if (!metadataUri || !metadataUri.startsWith("ipfs://")) {
    return null;
  }

  try {
    const gatewayUrl = metadataUri.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    );
    const response = await fetch(gatewayUrl);
    if (!response.ok) return null;

    const metadata = await response.json();
    return metadata.description || null;
  } catch (error) {
    console.error("Error fetching description from metadata:", error);
    return null;
  }
};

// Component untuk menampilkan description dari IPFS metadata
function IPFSDescription({ metadataUri }: { metadataUri: string }) {
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      setIsLoading(true);
      const desc = await getDescriptionFromMetadata(metadataUri);
      setDescription(desc);
      setIsLoading(false);
    };
    if (metadataUri) {
      fetchDescription();
    } else {
      setIsLoading(false);
    }
  }, [metadataUri]);

  if (isLoading) {
    return <span className="text-xs text-gray-500">Loading...</span>;
  }

  if (!description) {
    return <span className="text-xs text-gray-500">No description</span>;
  }

  return (
    <p className="text-xs text-gray-500 line-clamp-2 max-w-md">{description}</p>
  );
}

// Hook untuk mendapatkan file URL dari IPFS metadata
function useIPFSFileUrl(metadataUri: string) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileUrl = async () => {
      setIsLoading(true);
      const url = await getFileUrlFromMetadata(metadataUri);
      setFileUrl(url);
      setIsLoading(false);
    };
    if (metadataUri) {
      fetchFileUrl();
    } else {
      setIsLoading(false);
    }
  }, [metadataUri]);

  return { fileUrl, isLoading, metadataUri };
}

// Component untuk dropdown menu dengan opsi View File
function IPFSFileMenu({ metadataUri }: { metadataUri?: string }) {
  const { fileUrl, isLoading } = useIPFSFileUrl(metadataUri || "");

  if (!metadataUri) {
    return null;
  }

  const handleViewFile = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      // Fallback ke metadata URL
      const metadataUrl = metadataUri.replace(
        "ipfs://",
        "https://gateway.pinata.cloud/ipfs/"
      );
      window.open(metadataUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleViewFile}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {isLoading ? "Loading..." : "View File"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MyContents() {
  const { address, isConnected } = useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch user's contents
  const {
    data: contents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myContents", address],
    queryFn: () => getMyContents(address as string),
    enabled: !!address && isConnected,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Pagination logic
  const totalPages = Math.ceil((contents?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContents = contents?.slice(startIndex, endIndex) || [];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Contents</h2>
          <p className="text-muted-foreground mt-1">
            View all registered digital assets and their blockchain proofs.
          </p>
          {contents && contents.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Total:{" "}
              <span className="text-blue-400 font-semibold">
                {contents.length}
              </span>{" "}
              registered items
            </p>
          )}
        </div>
      </header>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">
              <p>Failed to load your contents</p>
              <p className="text-sm text-gray-500 mt-1">
                {(error as Error).message}
              </p>
            </div>
          ) : !contents || contents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No content registered yet</p>
              <p className="text-sm mt-1">
                Register your first content to get started
              </p>
              <a
                href="/dashboard/upload"
                className="inline-block mt-4 px-6 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Register Content
              </a>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-muted-foreground border-b border-black/5 dark:border-white/5 text-sm uppercase tracking-wider bg-black/[0.02] dark:bg-white/[0.02]">
                    <th className="p-6 font-medium">Name</th>
                    <th className="p-6 font-medium">Description</th>
                    <th className="p-6 font-medium">IP ID</th>
                    <th className="p-6 font-medium">pHash</th>
                    <th className="p-6 font-medium">TX Hashes</th>
                    <th className="p-6 font-medium">License</th>
                    <th className="p-6 font-medium text-right">Time</th>
                    <th className="p-6 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentContents.map((item: any, index: number) => (
                    <tr
                      key={item.ip_id || item.phash || index}
                      className="group hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <p className="font-medium text-foreground">
                            {item.filename ||
                              item.name ||
                              item.ip_id ||
                              "Untitled"}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        {item.ipfs_metadata ? (
                          <IPFSDescription metadataUri={item.ipfs_metadata} />
                        ) : (
                          <span className="text-xs text-gray-500">
                            No description
                          </span>
                        )}
                      </td>
                      <td className="p-6">
                        {item.ip_id ? (
                          // Check if IP ID is a valid address (starts with 0x and has 42 chars) or is placeholder
                          item.ip_id.startsWith("0x") &&
                          item.ip_id.length === 42 ? (
                            <a
                              href={`https://aeneid.storyscan.xyz/ip-asset/${item.ip_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group/ip font-mono text-xs"
                              title="View IP Asset on Story Protocol"
                            >
                              <span className="truncate max-w-[100px]">
                                {item.ip_id.slice(0, 8)}...
                                {item.ip_id.slice(-6)}
                              </span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover/ip:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <span
                              className="text-gray-500 text-xs font-mono"
                              title="IP Asset not registered (NFT only)"
                            >
                              {item.ip_id}
                            </span>
                          )
                        ) : (
                          <span className="text-gray-500 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-blue-400" />
                          <div
                            className="font-mono text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded w-fit max-w-[120px] truncate"
                            title={item.phash || "N/A"}
                          >
                            {item.phash
                              ? `${item.phash.substring(0, 12)}...`
                              : "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          {item.tx_hash_mint && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 w-16">
                                Mint:
                              </span>
                              <a
                                href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_mint}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-orange-400/80 hover:text-orange-400 transition-colors cursor-pointer group/mint font-mono text-xs"
                                title="NFT Mint Transaction - Creates the NFT token"
                              >
                                <span className="truncate max-w-[80px]">
                                  {formatTxHash(item.tx_hash_mint)}
                                </span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/mint:opacity-100 transition-opacity" />
                              </a>
                            </div>
                          )}
                          {item.tx_hash_register && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 w-16">
                                Register:
                              </span>
                              <a
                                href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_register}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-400/80 hover:text-blue-400 transition-colors cursor-pointer group/tx font-mono text-xs"
                                title="IP Asset Registration - Registers NFT as IP Asset on Story Protocol"
                              >
                                <span className="truncate max-w-[80px]">
                                  {formatTxHash(item.tx_hash_register)}
                                </span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/tx:opacity-100 transition-opacity" />
                              </a>
                            </div>
                          )}
                          {item.tx_hash_license && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 w-16">
                                License:
                              </span>
                              <a
                                href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_license}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-purple-400/80 hover:text-purple-400 transition-colors cursor-pointer group/license font-mono text-xs"
                                title="License Attachment - Attaches Non-Commercial license to IP Asset"
                              >
                                <span className="truncate max-w-[80px]">
                                  {formatTxHash(item.tx_hash_license)}
                                </span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/license:opacity-100 transition-opacity" />
                              </a>
                            </div>
                          )}
                          {!item.tx_hash_mint &&
                            !item.tx_hash_register &&
                            !item.tx_hash_license && (
                              <span className="text-gray-500 text-xs">N/A</span>
                            )}
                        </div>
                      </td>
                      <td className="p-6">
                        {item.license?.status ? (
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium w-fit ${
                                item.license.status === "ACTIVE"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : item.license.status === "FAILED"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                              }`}
                            >
                              {item.license.status}
                            </span>
                            {item.license.type && (
                              <span className="text-xs text-gray-500">
                                {item.license.type}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {item.timestamp
                                ? formatTimeAgo(item.timestamp)
                                : "N/A"}
                            </span>
                          </div>
                          {item.timestamp && (
                            <span className="text-xs text-gray-600">
                              {formatDate(item.timestamp)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <IPFSFileMenu metadataUri={item.ipfs_metadata} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, idx) => (
                        <PaginationItem key={idx}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => setCurrentPage(page as number)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </GlassCard>
    </>
  );
}
