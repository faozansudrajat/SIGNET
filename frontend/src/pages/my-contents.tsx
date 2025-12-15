import { useState, useEffect, useMemo } from "react";
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
  Loader2,
  Database,
  Search,
  X,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/lib/api";
import { Input } from "@/components/ui/input";

// Helper to format address



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









export default function MyContents() {
  useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Fetch ALL contents (same as /activity)
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allContents"],
    queryFn: () => getAllContents(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const allContents = apiResponse?.contents || [];

  // Sort by timestamp (newest first - most recent registration on top)
  const sortedContents = useMemo(
    () =>
      allContents
        ? [...allContents].sort(
          (a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0)
        )
        : [],
    [allContents]
  );

  // Filter contents based on search query
  const filteredContents = useMemo(
    () =>
      searchQuery
        ? sortedContents.filter((item: any) => {
          const query = searchQuery.toLowerCase();
          const filename = (item.filename || item.name || "").toLowerCase();
          const ipId = (item.ip_id || "").toLowerCase();
          const phash = (item.phash || "").toLowerCase();

          return (
            filename.includes(query) ||
            ipId.includes(query) ||
            phash.includes(query)
          );
        })
        : sortedContents,
    [searchQuery, sortedContents]
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil((filteredContents?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContents = filteredContents?.slice(startIndex, endIndex) || [];

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
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* Title Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Contents</h2>
            <p className="text-muted-foreground mt-1">
              View all registered digital assets and their blockchain proofs.
            </p>
            {allContents && allContents.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Total:{" "}
                <span className="text-blue-400 font-semibold">
                  {allContents.length}
                </span>{" "}
                registered items
                {searchQuery && (
                  <span className="text-gray-400">
                    {" "}• Showing {filteredContents.length} results
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, IP ID, or pHash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-black/20 dark:bg-white/5 border-black/10 dark:border-white/10 backdrop-blur-sm focus:border-blue-500/50 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <GlassCard className="p-0 overflow-hidden backdrop-blur-xl bg-black/20 dark:bg-white/5 border border-black/10 dark:border-white/10">
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
          ) : !allContents || allContents.length === 0 ? (
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
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="text-muted-foreground border-b border-black/5 dark:border-white/5 text-xs uppercase tracking-wider bg-black/[0.02] dark:bg-white/[0.02]">
                    <th className="p-3 font-medium w-[25%]">Name</th>
                    <th className="p-3 font-medium w-[18%]">IP ID</th>
                    <th className="p-3 font-medium w-[15%]">pHash</th>
                    <th className="p-3 font-medium w-[20%]">TX</th>
                    <th className="p-3 font-medium w-[10%]">License</th>
                    <th className="p-3 font-medium text-right w-[12%]">Time</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {currentContents.map((item: any, index: number) => (
                    <tr
                      key={item.ip_id || item.phash || index}
                      className="group hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                    >
                      {/* Name */}
                      <td className="p-3">
                        <p className="font-medium text-foreground truncate" title={item.filename || item.name || item.ip_id || "Untitled"}>
                          {item.filename || item.name || item.ip_id || "Untitled"}
                        </p>
                      </td>

                      {/* IP ID */}
                      <td className="p-3">
                        {item.ip_id ? (
                          item.ip_id.startsWith("0x") && item.ip_id.length === 42 ? (
                            <a
                              href={`https://aeneid.storyscan.xyz/address/${item.ip_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors font-mono truncate block"
                              title={item.ip_id}
                            >
                              {item.ip_id.slice(0, 6)}...{item.ip_id.slice(-4)}
                            </a>
                          ) : (
                            <span className="text-gray-500 font-mono truncate block" title={item.ip_id}>
                              {item.ip_id.length > 20 ? `${item.ip_id.slice(0, 15)}...` : item.ip_id}
                            </span>
                          )
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>

                      {/* pHash */}
                      <td className="p-3">
                        <span
                          className="font-mono text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded truncate block"
                          title={item.phash || "N/A"}
                        >
                          {item.phash ? `${item.phash.substring(0, 8)}...` : "N/A"}
                        </span>
                      </td>

                      {/* TX Hashes - Compact inline */}
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {item.tx_hash_mint && (
                            <a
                              href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_mint}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 font-mono"
                              title="Mint TX"
                            >
                              M
                            </a>
                          )}
                          {item.tx_hash_register && (
                            <a
                              href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_register}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-mono"
                              title="Register TX"
                            >
                              R
                            </a>
                          )}
                          {item.tx_hash_license && (
                            <a
                              href={`https://aeneid.storyscan.xyz/tx/${item.tx_hash_license}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 font-mono"
                              title="License TX"
                            >
                              L
                            </a>
                          )}
                          {!item.tx_hash_mint && !item.tx_hash_register && !item.tx_hash_license && (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>

                      {/* License */}
                      <td className="p-3">
                        {item.license?.status ? (
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${item.license.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400"
                              : item.license.status === "FAILED"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
                              }`}
                          >
                            {item.license.status === "ACTIVE" ? "✓" : item.license.status === "FAILED" ? "✗" : "-"}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="p-3 text-right">
                        <span className="text-gray-500" title={item.timestamp ? formatDate(item.timestamp) : "N/A"}>
                          {item.timestamp ? formatTimeAgo(item.timestamp) : "N/A"}
                        </span>
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
