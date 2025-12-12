import { GlassCard } from "@/components/ui/glass-card";
import {
  Eye,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Loader2,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/lib/api";

// Helper to format address
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

// Helper to format time ago
const formatTimeAgo = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function ContentReview() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all contents
  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allContents"],
    queryFn: getAllContents,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Handle response format: { contents: [...], total: number, limit: number, offset: number }
  const contents = responseData?.contents || [];

  // Filter contents based on search query
  const filteredContents = contents.filter((content: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (content.title && content.title.toLowerCase().includes(query)) ||
      (content.publisher && content.publisher.toLowerCase().includes(query)) ||
      (content.phash && content.phash.toLowerCase().includes(query)) ||
      (content.txhash && content.txhash.toLowerCase().includes(query))
    );
  });

  // Calculate stats
  const totalContents = contents.length;
  // Assuming we can determine status from content data, or default to 'verified' if txhash exists
  // For now, let's assume if it has a txhash it's verified/registered
  const verifiedCount = contents.filter((c: any) => c.txhash).length;
  const pendingCount = 0; // We might need a status field from backend to track pending
  const flaggedCount = 0; // We might need a status field from backend to track flagged

  return (
    <>
      <motion.header
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Global Content Review
          </h2>
          <p className="text-muted-foreground mt-1">
            Review and moderate all content registered across the platform.
          </p>
        </div>
      </motion.header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Eye className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-blue-500/[0.15] border border-blue-500/[0.2] text-blue-400 mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Total Contents
              </p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                {totalContents}
              </h3>
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
              <CheckCircle2 className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-green-500/[0.15] border border-green-500/[0.2] text-green-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Verified
              </p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                {verifiedCount}
              </h3>
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
              <Clock className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-yellow-500/[0.15] border border-yellow-500/[0.2] text-yellow-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Pending
              </p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                {pendingCount}
              </h3>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <AlertTriangle className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-red-500/[0.15] border border-red-500/[0.2] text-red-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Flagged
              </p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                {flaggedCount}
              </h3>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by title, publisher, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-white/5 border-slate-300/60 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-slate-300/60 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </GlassCard>

      {/* Contents Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">
              <p>Failed to load contents</p>
              <p className="text-sm text-gray-500 mt-1">
                {(error as Error).message}
              </p>
            </div>
          ) : !filteredContents || filteredContents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No content found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-900 dark:text-white border-b border-white/5 text-sm uppercase tracking-wider bg-white/[0.02]">
                  <th className="p-6 font-medium">Content</th>
                  <th className="p-6 font-medium">Publisher</th>
                  <th className="p-6 font-medium">pHash</th>
                  <th className="p-6 font-medium">TX Hash</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredContents.map((content: any) => (
                  <tr
                    key={content.id}
                    className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <td className="p-6">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {content.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {content.description
                            ? content.description.substring(0, 30) + "..."
                            : "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-slate-900 dark:text-white text-sm">
                            Publisher
                          </p>
                          <p className="text-xs text-slate-700 dark:text-gray-500 font-mono">
                            {formatAddress(content.publisher)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs text-slate-900 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded w-fit">
                          {content.phash
                            ? `${content.phash.substring(0, 12)}...`
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <a
                        href={`https://aeneid.storyscan.xyz/tx/${content.txhash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-900 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer group/tx"
                      >
                        <span className="font-mono">
                          {formatTxHash(content.txhash)}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/tx:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="p-6">
                      {/* Assuming verified if txhash exists for now */}
                      {content.txhash ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/[0.08] backdrop-blur-[4px] text-green-400 text-xs border border-green-500/[0.15]">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/[0.08] backdrop-blur-[4px] text-yellow-400 text-xs border border-yellow-500/[0.15]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(content.timestamp)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </>
  );
}
