import { GlassCard } from "@/components/ui/glass-card";
import {
  ShieldCheck,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Building2,
  Wallet,
  Hash,
  FileText,
  Copy,
  Link2,
  Image as ImageIcon,
  Video,
  Loader2,
  Flag,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { reportInfringement } from "@/lib/api";

type VerificationResult = {
  status: "duplicate-detected" | "manipulation-detected" | "unverified";
  similarity: number;
  hammingDistance?: number;
  publisher?: {
    name: string;
    wallet: string;
    verified: boolean;
  };
  metadata?: {
    title: string;
    description: string;
    dateRegistered: string;
    contentType: string;
    ipfsMetadata?: string;
  };
  blockchainProof?: {
    txHash: string;
    txHashMint?: string;
    txHashRegister?: string;
    txHashLicense?: string;
    blockHeight: string;
    timestamp: string;
    contractId: string;
    explorerLink?: string;
  };
  similarContent?: Array<{
    title: string;
    similarity: number;
    publisher: string;
    txHash: string;
  }>;
};

type VerifyResultProps = {
  result: VerificationResult;
  scamFilename?: string; // Filename of the file that was verified (the potential scam)
};

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to convert IPFS URI to gateway URL
const toGatewayUrl = (ipfsUri: string): string => {
  if (!ipfsUri || !ipfsUri.startsWith("ipfs://")) {
    return "";
  }
  return ipfsUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
};

export function VerifyResult({ result, scamFilename }: VerifyResultProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReport = async () => {
    if (!result.blockchainProof?.contractId || !scamFilename) {
      return;
    }

    setIsReporting(true);
    try {
      await reportInfringement(
        scamFilename,
        result.blockchainProof.contractId,
        result.similarity
      );
    } catch (error: any) {
      console.error("Error reporting infringement:", error);
      alert(`Failed to generate report: ${error.message || "Unknown error"}`);
    } finally {
      setIsReporting(false);
    }
  };

  // Fetch preview from IPFS metadata
  useEffect(() => {
    const fetchPreview = async () => {
      if (!result.metadata?.ipfsMetadata) {
        return;
      }

      setIsLoadingPreview(true);
      setPreviewError(null);

      try {
        // Convert metadata URI to gateway URL
        const metadataUrl = toGatewayUrl(result.metadata.ipfsMetadata);
        if (!metadataUrl) {
          setIsLoadingPreview(false);
          return;
        }

        // Fetch metadata JSON
        const response = await fetch(metadataUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const metadata = await response.json();

        // Extract image/video URL from metadata
        const mediaUrl =
          metadata.image || metadata.video || metadata.animation_url;
        if (mediaUrl) {
          // Convert to gateway URL if it's IPFS URI
          const finalUrl = mediaUrl.startsWith("ipfs://")
            ? toGatewayUrl(mediaUrl)
            : mediaUrl;
          setPreviewUrl(finalUrl);
        }
      } catch (error: any) {
        console.error("Error fetching preview:", error);
        setPreviewError(error.message || "Failed to load preview");
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [result.metadata?.ipfsMetadata]);

  const getStatusConfig = () => {
    switch (result.status) {
      case "duplicate-detected":
        return {
          icon: AlertTriangle,
          title: "Duplicate Content Detected",
          description:
            "This content matches a registered fingerprint on Story Protocol. The file appears to be a duplicate or copy of content that has already been registered.",
          glow: "shadow-[0_0_50px_rgba(249,115,22,0.3)]",
          border: "border-orange-500/30",
          gradient: "from-orange-400 to-red-600",
          iconBg: "bg-orange-500/10",
          iconBorder: "border-orange-500/30",
          iconColor: "text-orange-400",
          badgeBg: "bg-orange-500/20",
          badgeBorder: "border-orange-500/30",
          badgeText: "text-orange-400",
        };
      case "manipulation-detected":
        return {
          icon: AlertTriangle,
          title: "Content Manipulation Detected",
          description:
            "This content is similar to a registered fingerprint but shows significant differences. The file may have been altered, edited, or manipulated from the original.",
          glow: "shadow-[0_0_50px_rgba(239,68,68,0.3)]",
          border: "border-red-500/30",
          gradient: "from-red-500 to-orange-600",
          iconBg: "bg-red-500/10",
          iconBorder: "border-red-500/30",
          iconColor: "text-red-400",
          badgeBg: "bg-red-500/20",
          badgeBorder: "border-red-500/30",
          badgeText: "text-red-400",
        };
      default:
        return {
          icon: XCircle,
          title: "No Match Found",
          description:
            "This content does not match any registered fingerprint on the blockchain. The file appears to be original or has not been registered in the system.",
          glow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]",
          border: "border-blue-500/30",
          gradient: "from-blue-500 to-cyan-600",
          iconBg: "bg-blue-500/10",
          iconBorder: "border-blue-500/30",
          iconColor: "text-blue-400",
          badgeBg: "bg-blue-500/20",
          badgeBorder: "border-blue-500/30",
          badgeText: "text-blue-400",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <GlassCard
        className={`${config.border} ${config.glow} overflow-hidden relative`}
      >
        {/* Top status bar */}
        <div
          className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${config.gradient}`}
        />

        <div className="p-8 space-y-8">
          {/* Status Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div
                className={`w-24 h-24 rounded-full ${config.iconBg} flex items-center justify-center border-2 ${config.iconBorder} ${config.glow}`}
              >
                <Icon className={`w-12 h-12 ${config.iconColor}`} />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {config.title}
                  </h3>
                  {result.similarity > 0 && (
                    <span
                      className={`px-4 py-1.5 rounded-full ${config.badgeBg} ${config.badgeText} text-sm font-bold uppercase tracking-wider border ${config.badgeBorder}`}
                    >
                      {result.similarity}% Match
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">
                  {config.description}
                </p>
              </div>

              {/* Similarity Score */}
              {(result.similarity > 0 ||
                result.hammingDistance !== undefined) && (
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-300 dark:border-white/8">
                  {result.similarity > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/20">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Similarity
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {result.similarity}%
                        </p>
                      </div>
                    </div>
                  )}
                  {result.hammingDistance !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/10 border border-purple-500/20 dark:border-purple-500/20">
                        <Hash className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Hamming Distance
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {result.hammingDistance}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Publisher Identity */}
          {result.publisher && (
            <div className="bg-white/[0.05] dark:bg-black/40 rounded-xl p-6 border border-gray-300 dark:border-white/[0.08] space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Publisher Identity
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30 dark:border-blue-500/30">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">
                      {result.publisher.name}
                    </p>
                    {result.publisher.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="font-mono">
                      {formatAddress(result.publisher.wallet)}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(result.publisher!.wallet, "publisher-wallet")
                      }
                      className="p-1 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors"
                    >
                      <Copy
                        className={`w-3.5 h-3.5 ${
                          copied === "publisher-wallet"
                            ? "text-green-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Preview - Only show if match found (duplicate or manipulation) */}
          {result.status !== "unverified" &&
            (previewUrl || isLoadingPreview || previewError) && (
              <div className="bg-white/[0.05] dark:bg-black/40 rounded-xl p-6 border border-gray-300 dark:border-white/[0.08] space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  {result.metadata?.contentType?.startsWith("image/") ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : result.metadata?.contentType?.startsWith("video/") ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Original Content Preview
                </h4>
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-muted-foreground">
                      Loading preview...
                    </span>
                  </div>
                ) : previewError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm">Unable to load preview</p>
                    <p className="text-xs mt-1">{previewError}</p>
                  </div>
                ) : previewUrl ? (
                  <div className="space-y-3">
                    {result.metadata?.contentType?.startsWith("image/") ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-white/[0.08] bg-black/20">
                        <img
                          src={previewUrl}
                          alt={result.metadata.title || "Original content"}
                          className="w-full h-auto max-h-[500px] object-contain mx-auto"
                          onError={() =>
                            setPreviewError("Failed to load image")
                          }
                        />
                      </div>
                    ) : result.metadata?.contentType?.startsWith("video/") ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-white/[0.08] bg-black/20">
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-auto max-h-[500px] mx-auto"
                          onError={() =>
                            setPreviewError("Failed to load video")
                          }
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Preview not available for this content type
                        </p>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center gap-1"
                        >
                          Open in new tab <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span>Source: IPFS</span>
                      <span>•</span>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                      >
                        View full size <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

          {/* Content Metadata */}
          {result.metadata && (
            <div className="bg-white/[0.05] dark:bg-black/40 rounded-xl p-6 border border-gray-300 dark:border-white/[0.08] space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Content Metadata
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    File Name
                  </p>
                  <p className="text-foreground font-medium">
                    {result.metadata.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Content Type
                  </p>
                  <p className="text-foreground font-medium">
                    {result.metadata.contentType}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-muted-foreground">
                    {result.metadata.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Blockchain Proof */}
          {result.blockchainProof && (
            <div className="bg-white/[0.05] dark:bg-black/40 rounded-xl p-6 border border-gray-300 dark:border-white/[0.08] space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Blockchain Proof
              </h4>
              <div className="space-y-3">
                {/* Mint Transaction */}
                {result.blockchainProof.txHashMint && (
                  <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.03] dark:bg-black/60 border border-gray-300 dark:border-white/[0.05]">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        Mint Transaction
                      </p>
                      <p className="font-mono text-sm text-green-600 dark:text-green-400 truncate">
                        {result.blockchainProof.txHashMint}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(
                            result.blockchainProof!.txHashMint!,
                            "tx-hash-mint"
                          )
                        }
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors"
                      >
                        <Copy
                          className={`w-4 h-4 ${
                            copied === "tx-hash-mint"
                              ? "text-green-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <a
                        href={`https://aeneid.storyscan.xyz/tx/${result.blockchainProof.txHashMint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors text-muted-foreground hover:text-blue-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Register Transaction */}
                {result.blockchainProof.txHashRegister && (
                  <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.03] dark:bg-black/60 border border-gray-300 dark:border-white/[0.05]">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        Register Transaction
                      </p>
                      <p className="font-mono text-sm text-green-600 dark:text-green-400 truncate">
                        {result.blockchainProof.txHashRegister}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(
                            result.blockchainProof!.txHashRegister!,
                            "tx-hash-register"
                          )
                        }
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors"
                      >
                        <Copy
                          className={`w-4 h-4 ${
                            copied === "tx-hash-register"
                              ? "text-green-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <a
                        href={`https://aeneid.storyscan.xyz/tx/${result.blockchainProof.txHashRegister}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors text-muted-foreground hover:text-blue-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* License Transaction */}
                {result.blockchainProof.txHashLicense && (
                  <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.03] dark:bg-black/60 border border-gray-300 dark:border-white/[0.05]">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        License Transaction
                      </p>
                      <p className="font-mono text-sm text-green-600 dark:text-green-400 truncate">
                        {result.blockchainProof.txHashLicense}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(
                            result.blockchainProof!.txHashLicense!,
                            "tx-hash-license"
                          )
                        }
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors"
                      >
                        <Copy
                          className={`w-4 h-4 ${
                            copied === "tx-hash-license"
                              ? "text-green-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <a
                        href={`https://aeneid.storyscan.xyz/tx/${result.blockchainProof.txHashLicense}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded transition-colors text-muted-foreground hover:text-blue-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Contract ID */}
                {result.blockchainProof.contractId && (
                  <div className="p-3 rounded-lg bg-white/[0.03] dark:bg-black/60 border border-gray-300 dark:border-white/[0.05]">
                    <p className="text-xs text-muted-foreground mb-1">
                      IP Asset ID
                    </p>
                    <p className="font-mono text-sm text-foreground truncate">
                      {result.blockchainProof.contractId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Similar Content */}
          {result.similarContent && result.similarContent.length > 0 && (
            <div className="bg-white/[0.05] dark:bg-black/40 rounded-xl p-6 border border-gray-300 dark:border-white/[0.08] space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Similar Content Found
              </h4>
              <div className="space-y-3">
                {result.similarContent.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/[0.03] dark:bg-black/60 border border-gray-300 dark:border-white/[0.05] hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-1">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.publisher}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-yellow-400">
                          {item.similarity}%
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.txHash.slice(0, 10)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Button - Only show when match is found */}
          {(result.status === "duplicate-detected" ||
            result.status === "manipulation-detected") &&
            result.blockchainProof?.contractId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center pt-4"
              >
                <GlowButton
                  variant="danger"
                  onClick={handleReport}
                  loading={isReporting}
                  disabled={isReporting || !scamFilename}
                  className="shadow-[0_0_30px_rgba(239,68,68,0.25)]"
                >
                  <Flag className="w-5 h-5 mr-2" />
                  {isReporting ? "Generating Report..." : "Generate Takedown Report"}
                </GlowButton>
              </motion.div>
            )}

          {/* Security Note */}
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400 dark:border-blue-500/30">
            <p className="text-sm text-blue-600 dark:text-blue-200 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                <strong>Security Note:</strong> SIGNET does not store your
                files. Hashing is done locally and only the fingerprint is
                stored on the blockchain. Your privacy is protected.
              </span>
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
