import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { GlowButton } from "@/components/ui/glow-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import { ArrowLeft, ShieldCheck, ServerOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VerifyHero } from "@/components/verify/VerifyHero";
import { VerifyInput } from "@/components/verify/VerifyInput";
import { VerifyResult } from "@/components/verify/VerifyResult";
import { VerifyLoading } from "@/components/verify/VerifyLoading";
import LiquidEther from "@/components/LiquidEther";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";
import { verifyContent } from "@/lib/api";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

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
    ipfsMetadata?: string; // IPFS metadata URI
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
  error?: string;
};

export default function VerifyContent() {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get logo based on theme (default to white/dark mode before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  const handleVerify = async () => {
    if (!file) return;

    setIsVerifying(true);
    setResult(null);

    try {
      // Story Protocol backend: POST /verify with file only
      const response = await verifyContent(file);

      // Story Protocol backend returns:
      // { status: "MATCH_FOUND" | "NO_MATCH", match_data?, distance, similarity_percent?, is_scam? }
      // Backend always sets is_scam: True for all matches, meaning the verified file is a duplicate/manipulation
      if (response?.status === "MATCH_FOUND") {
        const distance = response.distance || 0;
        const similarity = response.similarity_percent || 100 - distance * 2;
        const matchData = response.match_data || {};

        // All matches are considered suspicious - determine severity based on similarity
        // High similarity (>=80%) = duplicate, Lower similarity (<80%) = manipulation
        let status: "duplicate-detected" | "manipulation-detected" =
          "duplicate-detected";
        if (similarity < 80) {
          status = "manipulation-detected";
        }

        // Use IPFS metadata if available, otherwise fallback to matchData
        const ipfsMetadata = matchData.ipfs_metadata_parsed || {};
        const metadataTitle =
          ipfsMetadata.name ||
          matchData.filename ||
          file.name ||
          "Unknown File";
        const metadataDescription =
          ipfsMetadata.description ||
          (matchData.filename
            ? `This file matches with registered content: ${matchData.filename}. The original content was registered on Story Protocol.`
            : "This file matches with a registered content on Story Protocol blockchain.");
        const metadataContentType =
          ipfsMetadata.attributes?.find(
            (attr: any) => attr.trait_type === "Content Type"
          )?.value ||
          file.type ||
          "Unknown";

        // Extract publisher name from IPFS metadata or use a formatted version of wallet
        const publisherName =
          ipfsMetadata.attributes?.find(
            (attr: any) =>
              attr.trait_type === "Publisher" || attr.trait_type === "Owner"
          )?.value ||
          (matchData.owner
            ? `Publisher (${formatAddress(matchData.owner)})`
            : "Unknown Publisher");

        setResult({
          status: status,
          similarity: similarity,
          hammingDistance: distance,
          publisher: matchData.owner
            ? {
                name: publisherName,
                wallet: matchData.owner,
                verified: true,
              }
            : undefined,
          metadata: {
            title: metadataTitle,
            description: metadataDescription,
            dateRegistered: new Date().toISOString(),
            contentType: metadataContentType,
            ipfsMetadata: matchData.ipfs_metadata || "",
          },
          blockchainProof:
            matchData.tx_hash_mint ||
            matchData.tx_hash_register ||
            matchData.tx_hash_license
              ? {
                  txHash:
                    matchData.tx_hash_register || matchData.tx_hash_mint || "", // Primary tx hash for display
                  txHashMint: matchData.tx_hash_mint || "",
                  txHashRegister: matchData.tx_hash_register || "",
                  txHashLicense: matchData.tx_hash_license || "",
                  blockHeight: "",
                  timestamp: "",
                  contractId: matchData.ip_id || "",
                  explorerLink: matchData.tx_hash_register
                    ? `https://aeneid.storyscan.xyz/tx/${matchData.tx_hash_register}`
                    : matchData.tx_hash_mint
                    ? `https://aeneid.storyscan.xyz/tx/${matchData.tx_hash_mint}`
                    : "",
                }
              : undefined,
        });
      } else {
        setResult({
          status: "unverified",
          similarity: 0,
          hammingDistance: response.distance,
        });
      }
    } catch (error: any) {
      // Handle error - show user-friendly message
      const errorMessage = error.message || "Verification failed";

      // Set result with error flag
      setResult({
        status: "unverified",
        similarity: 0,
        hammingDistance: undefined,
        error: errorMessage,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-blue-500/30 dark:selection:bg-blue-500/30">
      {/* LiquidEther Background - Full Page Animation */}
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

      {/* Navbar */}
      <motion.nav
        className="fixed top-4 left-4 right-4 z-50 rounded-full border border-white/[0.1] dark:border-white/[0.08] bg-background/30 dark:bg-black/30 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <VerifyHero />

          <VerifyInput
            file={file}
            url={""}
            isVerifying={isVerifying}
            onFileChange={setFile}
            onUrlChange={() => {}}
          />

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowButton
              className="w-full h-14 text-lg shadow-[0_0_30px_rgba(100,130,255,0.25)]"
              onClick={handleVerify}
              disabled={!file || isVerifying}
              loading={isVerifying}
            >
              {isVerifying ? (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Verify Authenticity
                </>
              )}
            </GlowButton>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isVerifying && <VerifyLoading />}
          </AnimatePresence>

          {/* Backend Error Alert */}
          {result && (result as any).error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/20"
              >
                <ServerOff className="h-4 w-4" />
                <AlertTitle className="text-red-400">
                  Backend Server Error
                </AlertTitle>
                <AlertDescription className="text-red-300 text-sm mt-1">
                  {(result as any).error ||
                    "Unable to connect to the backend server. Please make sure the backend is running"}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {result && !isVerifying && !(result as any).error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VerifyResult result={result} />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex justify-center"
                >
                  <GlowButton variant="secondary" onClick={handleReset}>
                    Verify Another Content
                  </GlowButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
