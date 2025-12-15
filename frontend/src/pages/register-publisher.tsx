import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {
  ShieldCheck,
  ArrowRight,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import LiquidEther from "@/components/LiquidEther";
import { SignetNFT_ABI } from "@/config/abi";
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";
import { useAppKit } from "@reown/appkit/react";
import { Link } from "wouter";

export default function RegisterPublisher() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [scrolled, setScrolled] = useState(false);

  /* =======================
     CONTRACT READ
  ======================= */
  const { data: isAuthorized, refetch: refetchAuth } = useReadContract({
    address: BLOCKCHAIN_CONFIG.NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: SignetNFT_ABI,
    functionName: "authorizedPublishers",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  /* =======================
     CONTRACT WRITE
  ======================= */
  const {
    data: hash,
    writeContract,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  /* =======================
     EFFECTS
  ======================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      refetchAuth();
    }
  }, [isConfirmed, refetchAuth]);

  /* =======================
     HANDLERS
  ======================= */
  const handleRegister = () => {
    if (!isConnected) {
      open();
      return;
    }

    writeContract({
      address: BLOCKCHAIN_CONFIG.NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: SignetNFT_ABI,
      functionName: "registerAsPublisher",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-blue-500/30">
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
          className="opacity-60"
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-background/40 to-background/80"
        style={{ zIndex: 1 }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingNavbar scrolled={scrolled} />

        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <div className="max-w-4xl w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Become a Publisher
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the SIGNET network to register and protect your digital
                content. Self-register your wallet directly on the blockchain.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isConnected ? (
                /* =======================
                   CONNECT WALLET
                ======================= */
                <motion.div
                  key="connect"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <GlassCard className="max-w-md mx-auto p-8 text-center border-blue-500/20">
                    <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                      <Wallet className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Connect Wallet
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Please connect your wallet to verify or register as a
                      publisher.
                    </p>
                    <GlowButton onClick={() => open()} className="w-full">
                      Connect Wallet
                    </GlowButton>
                  </GlassCard>
                </motion.div>
              ) : isAuthorized ? (
                /* =======================
                   ALREADY AUTHORIZED
                ======================= */
                <motion.div
                  key="authorized"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <GlassCard className="max-w-xl mx-auto p-10 text-center border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <ShieldCheck className="w-12 h-12 text-green-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">
                      You are Authorized!
                    </h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Your wallet is already registered as a Publisher.
                    </p>
                    <Link href="/dashboard">
                      <GlowButton className="min-w-[200px]">
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </GlowButton>
                    </Link>
                  </GlassCard>
                </motion.div>
              ) : (
                /* =======================
                   REGISTER
                ======================= */
                <motion.div
                  key="register"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <GlassCard className="max-w-lg mx-auto p-8 border-purple-500/20">
                    {writeError && (
                      <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3 text-sm text-red-200">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <p>
                          {(writeError as any).shortMessage ||
                            writeError.message}
                        </p>
                      </div>
                    )}

                    <GlowButton
                      onClick={handleRegister}
                      className="w-full h-14 text-lg"
                      disabled={isWritePending || isConfirming}
                      loading={isWritePending || isConfirming}
                    >
                      {isWritePending
                        ? "Confirm in Wallet..."
                        : isConfirming
                        ? "Registering on Chain..."
                        : "Register as Publisher"}
                    </GlowButton>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
