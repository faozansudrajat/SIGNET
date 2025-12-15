import { GlassCard } from "@/components/ui/glass-card";
import {
  Activity,
  Database,
  ShieldCheck,
  ArrowUpRight,
  Wallet,
  Copy,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

import { getAllContents } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Helper function to format address
const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to format TX Hash with 0x prefix
const formatTxHash = (txHash: string) => {
  if (!txHash) return "";
  // Ensure 0x prefix
  const hash = txHash.startsWith("0x") ? txHash : `0x${txHash}`;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

// Helper function to format time ago
const formatTimeAgo = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function DashboardHome() {
  const { address, isConnected } = useAccount();

  // Fetch all contents for stats
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allContents"],
    queryFn: getAllContents,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  // Calculate stats from real data
  const contents = apiResponse?.contents || [];
  const totalRegistered = apiResponse?.total || contents.length || 0;

  // Filter recent contents by connected wallet address
  const myRecentContents = address
    ? contents
      .filter((c: any) => {
        const contentOwner = c.owner || c.publisher || "";
        return contentOwner.toLowerCase() === address.toLowerCase();
      })
      .slice(0, 3)
    : [];

  return (
    <>
      <motion.header
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 dark:from-blue-400 via-blue-400 dark:via-purple-400 to-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your content and monitor blockchain registrations.
          </p>
        </div>
        {isConnected && address && (
          <GlassCard className="px-4 py-3 border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/[0.15] border border-blue-500/[0.2]">
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Connected Wallet
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground font-medium">
                    {formatAddress(address)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-white/[0.05] dark:hover:bg-white/[0.05] rounded transition-colors group"
                    title="Copy address"
                  >
                    <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Database className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-2 w-fit rounded-lg bg-blue-500/[0.15] border border-blue-500/[0.2] text-blue-400 mb-2">
                <Database className="w-4 h-4" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Total Registered
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  totalRegistered.toLocaleString()
                )}
              </h3>
              <div className="flex items-center gap-1 text-blue-400 text-sm mt-2">
                <Activity className="w-4 h-4" />
                <span>On-chain verified</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-2 w-fit rounded-lg bg-purple-500/[0.15] border border-purple-500/[0.2] text-purple-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Publishers
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  new Set(
                    contents
                      ?.map((c: any) => c.publisher || c.owner)
                      .filter(Boolean)
                  ).size || 0
                )}
              </h3>
              <div className="flex items-center gap-1 text-purple-400 text-sm mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Active publishers</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Activity className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-2 w-fit rounded-lg bg-orange-500/[0.15] border border-orange-500/[0.2] text-orange-400 mb-2">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Recent Contents
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  myRecentContents.length
                )}
              </h3>
              <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Your latest</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard className="mt-4 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Contents
            </h3>
            <a
              href="/dashboard/contents"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </a>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                <p>Failed to load activity</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(error as Error).message}
                </p>
              </div>
            ) : !isConnected || !address ? (
              <div className="text-center py-12 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Please connect your wallet to view your contents</p>
              </div>
            ) : myRecentContents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No content registered yet</p>
                <a
                  href="/dashboard/upload"
                  className="inline-block mt-4 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Register Content
                </a>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-muted-foreground border-b border-white/[0.08] dark:border-white/[0.08] text-sm uppercase tracking-wider">
                    <th className="pb-4 font-medium">Name</th>
                    <th className="pb-4 font-medium">TX Hash</th>
                    <th className="pb-4 font-medium">License</th>
                    <th className="pb-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {myRecentContents.map((content: any, i: number) => (
                    <tr
                      key={content.id || i}
                      className="group hover:bg-white/[0.03] dark:hover:bg-white/[0.03] transition-colors border-b border-white/[0.08] dark:border-white/[0.08] last:border-0"
                    >
                      <td className="py-2 font-medium text-foreground group-hover:text-foreground truncate max-w-[150px]">
                        {content.filename ||
                          content.name ||
                          content.title ||
                          "Untitled"}
                      </td>
                      <td className="py-2">
                        <a
                          href={`https://aeneid.storyscan.xyz/tx/${content.txhash?.startsWith("0x")
                              ? content.txhash
                              : `0x${content.txhash}`
                            }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-blue-400/80 hover:text-blue-400 transition-colors"
                        >
                          {formatTxHash(content.txhash)}
                        </a>
                      </td>
                      <td className="py-2">
                        {content.license?.status ? (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${content.license.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : content.license.status === "FAILED"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                              }`}
                          >
                            {content.license.status}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground text-right">
                        {content.timestamp
                          ? formatTimeAgo(content.timestamp)
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}
