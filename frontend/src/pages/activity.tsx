import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/lib/api";
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
  ExternalLink,
  Hash,
  User,
  Clock,
  Loader2,
  Database,
  Search,
  X,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { GlowButton } from "@/components/ui/glow-button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import LiquidEther from "@/components/LiquidEther";
import { Input } from "@/components/ui/input";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";

// Helper to format address
const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper to format TX Hash with 0x prefix
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

export default function Activity() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get logo based on theme (default to white/dark mode before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  // Fetch all contents with auto-refresh every 30 seconds (optimized)
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allContents"],
    queryFn: getAllContents,
    refetchInterval: 30000, // Refresh every 30 seconds (optimized from 10s)
  });

  const allContents = apiResponse?.contents || [];

  // Sort by timestamp (newest first) - memoized for performance
  // Data sudah di-sort di api.ts, tapi kita sort lagi untuk memastikan
  const sortedContents = useMemo(
    () =>
      allContents
        ? [...allContents].sort(
            (a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0)
          )
        : [],
    [allContents]
  );

  // Filter contents based on search query - memoized for performance
  const filteredContents = useMemo(
    () =>
      searchQuery
        ? sortedContents.filter((item: any) => {
            const query = searchQuery.toLowerCase();
            const title = (item.title || "").toLowerCase();
            const description = (item.description || "").toLowerCase();
            const publisher = (item.publisher || "").toLowerCase();
            const txhash = (item.txhash || "").toLowerCase();
            const phash = (item.phash || "").toLowerCase();

            return (
              title.includes(query) ||
              description.includes(query) ||
              publisher.includes(query) ||
              txhash.includes(query) ||
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

  // Copy to clipboard function
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContents = filteredContents.slice(startIndex, endIndex);

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
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-blue-500/30 dark:selection:bg-blue-500/30">
      {/* LiquidEther Background */}
      <div
        className="fixed inset-0 pointer-events-none bg-background"
        style={{ zIndex: 0 }}
      >
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={50}
          isViscous={false}
          viscous={30}
          iterationsViscous={4}
          iterationsPoisson={4}
          resolution={0.1}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          className="opacity-60"
        />
      </div>

      {/* Overlay gradient for text readability */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-background/40 to-background/80 dark:from-black/80 dark:via-black/40 dark:to-black/80"
        style={{ zIndex: 1 }}
      />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navbar - Simplified for performance */}
        <nav className="fixed top-4 left-4 right-4 z-50 rounded-full border border-white/[0.1] dark:border-white/[0.08] bg-background/30 dark:bg-black/30 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                <img
                  src={logo}
                  alt="SIGNET"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">SIGNET</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <GlowButton variant="secondary" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </GlowButton>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-32 pb-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Activity Feed
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Real-time blockchain transaction logs • Updates every 30 seconds
              </p>
              {allContents && (
                <p className="text-sm text-muted-foreground mt-2">
                  Total Transactions:{" "}
                  <span className="text-blue-400 font-semibold">
                    {allContents.length}
                  </span>
                  {searchQuery && (
                    <>
                      {" • "}
                      Filtered Results:{" "}
                      <span className="text-blue-400 font-semibold">
                        {filteredContents.length}
                      </span>
                    </>
                  )}
                </p>
              )}
            </header>

            {/* Search Bar */}
            <div className="mb-6 max-w-4xl mx-auto">
              <GlassCard className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search by title, description, publisher, TX hash, or pHash..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 bg-white/60 dark:bg-white/5 border-slate-300/60 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 focus-visible:ring-blue-500/50 w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors z-10"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white" />
                    </button>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Activity Table */}
            <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20 text-red-400">
                    <p>Failed to load activity feed</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(error as Error).message}
                    </p>
                  </div>
                ) : !currentContents || currentContents.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No activity yet</p>
                    <p className="text-sm mt-1">
                      Transaction logs will appear here once content is
                      registered
                    </p>
                  </div>
                ) : (
                  <>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-900 dark:text-white border-b border-white/5 text-sm uppercase tracking-wider bg-white/[0.02]">
                          <th className="p-6 font-medium">Name</th>
                          <th className="p-6 font-medium">Publisher</th>
                          <th className="p-6 font-medium">IP ID</th>
                          <th className="p-6 font-medium">pHash</th>
                          <th className="p-6 font-medium">TX Hash</th>
                          <th className="p-6 font-medium">License</th>
                          <th className="p-6 font-medium text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {currentContents.map((item: any, index: number) => (
                          <tr
                            key={item.id || index}
                            className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            <td className="p-6">
                              <p className="font-medium text-slate-900 dark:text-white truncate max-w-md">
                                {item.filename ||
                                  item.name ||
                                  item.title ||
                                  "Untitled"}
                              </p>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-purple-400" />
                                <span className="font-mono text-xs text-slate-900 dark:text-white">
                                  {formatAddress(item.publisher)}
                                </span>
                              </div>
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
                                <span className="text-gray-500 text-xs">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-blue-400" />
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      item.phash,
                                      item.id || index
                                    )
                                  }
                                  className="group/copy font-mono text-xs text-slate-900 dark:text-white bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/20 transition-colors cursor-pointer flex items-center gap-2"
                                  title="Click to copy full pHash"
                                >
                                  <span className="truncate max-w-[120px]">
                                    {item.phash || "N/A"}
                                  </span>
                                  {copiedHash === (item.id || index) ? (
                                    <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                                  ) : (
                                    <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity flex-shrink-0" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="p-6">
                              <a
                                href={`https://aeneid.storyscan.xyz/tx/${
                                  item.txhash?.startsWith("0x")
                                    ? item.txhash
                                    : `0x${item.txhash}`
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-900 dark:text-white hover:text-blue-500 transition-colors cursor-pointer group/tx font-mono"
                              >
                                <span>{formatTxHash(item.txhash)}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/tx:opacity-100 transition-opacity" />
                              </a>
                            </td>
                            <td className="p-6">
                              {item.license?.status ? (
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    item.license.status === "ACTIVE"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : item.license.status === "FAILED"
                                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                  }`}
                                >
                                  {item.license.status}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">
                                  N/A
                                </span>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="p-6 border-t border-white/5 bg-white/[0.02]">
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
                                    onClick={() =>
                                      setCurrentPage(page as number)
                                    }
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
                                  setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                  )
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
          </div>
        </main>

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
}
