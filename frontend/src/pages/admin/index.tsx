import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  MoreVertical,
  Wallet,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";
import { usePublisher } from "@/hooks/usePublisher";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useGaslessAdmin } from "@/hooks/useGaslessAdmin";
import { parseAbiItem } from "viem";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface Publisher {
  id: string;
  wallet: string;
  name: string;
  status: "active" | "banned";
  registered: string;
  contents: number;
  verified: boolean;
}

export default function ManagePublishers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPublisherAddress, setNewPublisherAddress] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoadingPublishers, setIsLoadingPublishers] = useState(true);

  const [, setLocation] = useLocation();
  const { isConnected } = useAccount();
  const { isOwner, isLoading: isLoadingOwner } = usePublisher();
  const publicClient = usePublicClient();

  // Gasless Admin Hook
  const {
    addPublisher,
    loading: isAdding,
    error: addError,
    result: addResult,
    step,
  } = useGaslessAdmin();

  // Redirect if not owner
  useEffect(() => {
    if (!isLoadingOwner && (!isConnected || !isOwner)) {
      setLocation("/");
    }
  }, [isConnected, isOwner, isLoadingOwner, setLocation]);

  // Fetch publishers from blockchain events
  useEffect(() => {
    const fetchPublishers = async () => {
      if (!publicClient) return;

      try {
        setIsLoadingPublishers(true);

        // Get current block number
        const currentBlock = await publicClient.getBlockNumber();

        // Calculate fromBlock to stay within 100k block limit
        // Using 90k to be safe and leave some margin
        const blockRange = 90000n;
        const fromBlock =
          currentBlock > blockRange ? currentBlock - blockRange : 0n;

        // Fetch PublisherAdded events
        // Assuming event PublisherAdded(address indexed publisher)
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event PublisherAdded(address indexed publisher)"
          ),
          fromBlock: fromBlock,
          toBlock: currentBlock,
        });

        const fetchedPublishers: Publisher[] = await Promise.all(
          logs.map(async (log) => {
            const wallet = log.args.publisher!;
            // We don't have name/metadata on-chain, so we use address or "Unknown"
            // We could potentially fetch content count from API

            // Get block timestamp for registration date
            const block = await publicClient.getBlock({
              blockNumber: log.blockNumber,
            });
            const date = new Date(
              Number(block.timestamp) * 1000
            ).toLocaleDateString();

            return {
              id: wallet,
              wallet: wallet,
              name: "Publisher", // Placeholder as we don't have names on-chain
              status: "active", // Default to active
              registered: date,
              contents: 0, // Would need API to get this
              verified: true,
            };
          })
        );

        // Remove duplicates (if any)
        const uniquePublishers = Array.from(
          new Map(fetchedPublishers.map((p) => [p.wallet, p])).values()
        );

        setPublishers(uniquePublishers);
      } catch (error) {
        console.error("Failed to fetch publishers:", error);
      } finally {
        setIsLoadingPublishers(false);
      }
    };

    if (isConnected && isOwner) {
      fetchPublishers();
    }
  }, [publicClient, isConnected, isOwner]);

  // Reset form on success
  useEffect(() => {
    if (addResult) {
      setNewPublisherAddress("");
      setIsDialogOpen(false);
      // Ideally refetch publishers here, but for now we just close dialog
      // A simple reload or refetch trigger would be better
      window.location.reload();
    }
  }, [addResult]);

  const handleAddPublisher = async () => {
    if (!newPublisherAddress || !newPublisherAddress.startsWith("0x")) {
      return;
    }
    await addPublisher(newPublisherAddress);
  };

  const filteredPublishers = publishers.filter(
    (p) =>
      p.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingOwner) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isConnected || !isOwner) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            Only the contract owner can access this page.
          </p>
        </div>
      </div>
    );
  }

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
            Manage Publishers
          </h2>
          <p className="text-muted-foreground mt-1">
            Whitelist and manage publisher access to the SIGNET platform.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <GlowButton className="gap-2">
              <Plus className="w-4 h-4" />
              Add Publisher
            </GlowButton>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add New Publisher (Gasless)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Wallet Address</Label>
                <Input
                  placeholder="0x..."
                  value={newPublisherAddress}
                  onChange={(e) => setNewPublisherAddress(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono"
                />
              </div>
              {addError && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-sm">
                  {addError}
                </div>
              )}
              <GlowButton
                className="w-full"
                onClick={handleAddPublisher}
                loading={isAdding}
                disabled={
                  !newPublisherAddress || !newPublisherAddress.startsWith("0x")
                }
              >
                {isAdding ? step || "Processing..." : "Add Publisher"}
              </GlowButton>
              {addResult && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-green-400 text-sm">
                  Publisher added successfully! Transaction: {addResult.txHash}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
              <Building2 className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-blue-500/[0.15] border border-blue-500/[0.2] text-blue-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Total Publishers
              </p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                {publishers.length}
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
              placeholder="Search by wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-white/5 border-slate-300/60 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600"
            />
          </div>
        </div>
      </GlassCard>

      {/* Publishers Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoadingPublishers ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            </div>
          ) : filteredPublishers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No publishers found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-900 dark:text-white border-b border-white/5 text-sm uppercase tracking-wider bg-white/[0.02]">
                  <th className="p-6 font-medium">Publisher</th>
                  <th className="p-6 font-medium">Wallet Address</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium">Registered</th>
                  <th className="p-6 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPublishers.map((publisher) => (
                  <tr
                    key={publisher.id}
                    className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                          <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {publisher.name}
                          </p>
                          {publisher.verified && (
                            <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 font-mono text-slate-900 dark:text-gray-300">
                        <Wallet className="w-4 h-4 text-gray-500" />
                        {formatAddress(publisher.wallet)}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-full bg-green-500/[0.08] backdrop-blur-[4px] text-green-400 text-xs border border-green-500/[0.15]">
                        {publisher.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {publisher.registered}
                      </div>
                    </td>
                    <td className="p-6">
                      <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
