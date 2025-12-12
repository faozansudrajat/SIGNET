import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { GlowButton } from "@/components/ui/glow-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Copy, LogOut, Menu, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";
import { usePublisher } from "@/hooks/usePublisher";
import { NotPublisherModal } from "@/components/modals/NotPublisherModal";

type LandingNavbarProps = {
  scrolled: boolean;
  onMobileMenuChange?: (isOpen: boolean) => void;
};

// Helper function to format address
const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function LandingNavbar({
  scrolled,
  onMobileMenuChange,
}: LandingNavbarProps) {
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOwner, isPublisher, isLoading } = usePublisher();
  const [isNotPublisherModalOpen, setIsNotPublisherModalOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get logo based on theme (default to white/dark mode before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isPublisher) {
      e.preventDefault();
      setIsNotPublisherModalOpen(true);
      if (isMobileMenuOpen) {
        handleMobileMenuToggle(false);
      }
    }
  };

  // Debug logging
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[LandingNavbar] Admin tab check:", { isOwner, isLoading });
  }

  const handleMobileMenuToggle = (open: boolean) => {
    setIsMobileMenuOpen(open);
    onMobileMenuChange?.(open);
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-4 left-4 right-4 z-40 rounded-full transition-all duration-300 ${scrolled
            ? "border border-white/[0.1] dark:border-white/[0.08] bg-background/30 dark:bg-black/30 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "border border-white/[0.1] dark:border-white/[0.08] bg-background/20 dark:bg-black/20 backdrop-blur-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
              <img
                src={logo}
                alt="SIGNET"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">SIGNET</span>
            {/* Theme Toggle on Desktop - Next to SIGNET */}
            <ThemeToggle className="hidden lg:flex ml-2" />
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <Link href="/verify">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Verify
              </span>
            </Link>
            <Link href="/activity">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Activity
              </span>
            </Link>
            <Link href="/register-publisher">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Register
              </span>
            </Link>
            {/* API Docs link - Hidden */}
            {/* <Link href="/docs">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                API Docs
              </span>
            </Link> */}
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop: Wallet, Connect Button */}
            {isConnected && (
              <>
                <Link href="/dashboard" className="hidden lg:block">
                  <span
                    onClick={handleDashboardClick}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    Dashboard
                  </span>
                </Link>
                {isOwner && (
                  <Link href="/admin/publishers" className="hidden lg:block">
                    <span className="text-sm font-medium text-red-400 hover:text-red-300 cursor-pointer transition-colors flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      Admin
                    </span>
                  </Link>
                )}
                {/* Wallet Address Display */}
                <GlassCard className="hidden lg:flex px-4 py-2 border-white/[0.1] dark:border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Wallet
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground font-mono">
                          {formatAddress(address || "")}
                        </span>
                        <button
                          onClick={handleCopyAddress}
                          className="p-1 hover:bg-accent rounded transition-colors group"
                          title="Copy address"
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="p-2 hover:bg-red-500/[0.1] dark:hover:bg-red-500/[0.1] rounded-lg transition-colors group border border-transparent hover:border-red-500/[0.2]"
                      title="Disconnect"
                    >
                      <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                </GlassCard>
              </>
            )}
            {!isConnected && (
              <GlowButton
                className="hidden lg:flex"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </GlowButton>
            )}

            {/* Mobile: Burger Button */}
            <button
              onClick={() => handleMobileMenuToggle(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/[0.05] dark:bg-white/[0.05] backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] hover:bg-white/[0.08] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar - Rendered outside nav to avoid blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay - behind sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/40 dark:bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => handleMobileMenuToggle(false)}
            />

            {/* Sidebar with glass effect */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 right-0 h-full w-[320px] max-w-[85vw] z-[70] lg:hidden",
                "bg-white/[0.05] dark:bg-black/90 backdrop-blur-[12px]",
                "border-l border-white/[0.1] dark:border-white/[0.08]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              )}
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                      <img
                        src={logo}
                        alt="SIGNET"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">
                      SIGNET
                    </span>
                  </div>
                  <button
                    onClick={() => handleMobileMenuToggle(false)}
                    className="p-2 rounded-full bg-white/[0.05] dark:bg-white/[0.05] border border-white/[0.1] dark:border-white/[0.08] hover:bg-white/[0.08] dark:hover:bg-white/[0.08] transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2 mb-6">
                  <a
                    href="#features"
                    onClick={() => handleMobileMenuToggle(false)}
                    className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => handleMobileMenuToggle(false)}
                    className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium"
                  >
                    Pricing
                  </a>
                  <Link
                    href="/verify"
                    onClick={() => handleMobileMenuToggle(false)}
                  >
                    <span className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium cursor-pointer">
                      Verify
                    </span>
                  </Link>
                  <Link
                    href="/activity"
                    onClick={() => handleMobileMenuToggle(false)}
                  >
                    <span className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium cursor-pointer">
                      Activity
                    </span>
                  </Link>
                  <Link
                    href="/register-publisher"
                    onClick={() => handleMobileMenuToggle(false)}
                  >
                    <span className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium cursor-pointer">
                      Register
                    </span>
                  </Link>
                  {/* API Docs link - Hidden */}
                  {/* <Link
                    href="/docs"
                    onClick={() => handleMobileMenuToggle(false)}
                  >
                    <span className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium cursor-pointer">
                      API Docs
                    </span>
                  </Link> */}
                  {isConnected && (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={(e) => {
                          handleDashboardClick(e);
                          if (isPublisher) handleMobileMenuToggle(false);
                        }}
                      >
                        <span className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-colors font-medium cursor-pointer">
                          Dashboard
                        </span>
                      </Link>
                      {isOwner && (
                        <Link
                          href="/admin/publishers"
                          onClick={() => handleMobileMenuToggle(false)}
                        >
                          <span className="block px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/[0.1] dark:hover:bg-red-500/[0.1] transition-colors font-medium cursor-pointer flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Admin
                          </span>
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                {/* Wallet Info (if connected) */}
                {isConnected && address && (
                  <div className="mb-6">
                    <GlassCard className="p-4 border-white/[0.1] dark:border-white/[0.08]">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Wallet Address
                          </span>
                          <button
                            onClick={handleCopyAddress}
                            className="p-1.5 hover:bg-accent rounded transition-colors group"
                            title="Copy address"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-foreground font-mono break-all">
                          {formatAddress(address)}
                        </span>
                        <button
                          onClick={() => {
                            disconnect();
                            handleMobileMenuToggle(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/[0.1] dark:hover:bg-red-500/[0.1] transition-colors group"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Disconnect Wallet</span>
                        </button>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 border-t border-white/[0.08] dark:border-white/[0.08] pt-6">
                  {!isConnected && (
                    <GlowButton
                      className="w-full justify-center"
                      onClick={() => {
                        handleConnectWallet();
                        handleMobileMenuToggle(false);
                      }}
                    >
                      Connect Wallet
                    </GlowButton>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.05] border border-white/[0.1] dark:border-white/[0.08]">
                    <span className="text-sm font-medium text-foreground">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <NotPublisherModal
        isOpen={isNotPublisherModalOpen}
        onClose={() => setIsNotPublisherModalOpen(false)}
      />
    </>
  );
}
