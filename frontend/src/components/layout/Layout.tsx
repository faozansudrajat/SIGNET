import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UploadCloud,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Copy,
  Wallet,
  FileCheck,

} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";
import LiquidEther from "@/components/LiquidEther";
import { usePublisher } from "@/hooks/usePublisher";

// Helper function to format address
const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Register Content", icon: UploadCloud, href: "/dashboard/upload" },
  { label: "My Contents", icon: FileCheck, href: "/dashboard/contents" },
  // { label: "API Usage", icon: Zap, href: "/dashboard/api" }, // Hidden
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const {
    isPublisher,
    isOwner,
    isLoading: isLoadingPublisher,
  } = usePublisher();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging (remove in production)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("[Layout] Debug:", {
        address,
        isPublisher,
        isOwner,
        isLoadingPublisher,
      });
    }
  }, [address, isPublisher, isOwner, isLoadingPublisher]);

  // Get logo based on theme (default to white/dark mode before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground font-sans selection:bg-blue-500/30 dark:selection:bg-blue-500/30 relative overflow-hidden">
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

      {/* Mobile Nav Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-full bg-white/[0.08] dark:bg-white/[0.08] backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] hover:bg-white/[0.12] dark:hover:bg-white/[0.12] transition-colors"
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed md:sticky top-0 h-screen w-[280px] flex flex-col p-6 z-40",
              "bg-white/[0.05] dark:bg-black/90 md:bg-background/20 md:dark:bg-black/20 border-r border-white/[0.1] dark:border-white/[0.08]",
              "backdrop-blur-[12px]"
            )}
            style={{
              pointerEvents:
                isMobileOpen || window.innerWidth >= 768 ? "auto" : "none",
            }}
          >
            <div className="mb-10 flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                <img
                  src={logo}
                  alt="SIGNET"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <span className="font-bold text-xl tracking-tight">SIGNET</span>
            </div>

            <nav className="flex-1 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                Publisher
              </p>
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                          location === item.href
                            ? "text-foreground border border-white/[0.15] dark:border-white/[0.12] bg-accent shadow-[0_0_20px_rgba(100,130,255,0.12)] dark:shadow-[0_0_20px_rgba(100,130,255,0.12)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        {location === item.href && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.15] to-purple-500/[0.15] opacity-100" />
                        )}
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-colors relative z-10",
                            location === item.href
                              ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        <span className="font-medium relative z-10">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/[0.08] dark:border-white/[0.08] space-y-3">
              <div className="px-4">
                <ThemeToggle className="w-full justify-start" />
              </div>
              {isConnected && address && (
                <div className="px-4 py-3 rounded-xl bg-accent/50 border border-white/[0.1] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-muted-foreground">
                      Wallet Address
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground font-medium">
                      {formatAddress(address)}
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
              )}
              <Link href="/">
                <div className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:text-foreground hover:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.08] transition-colors group border border-transparent hover:border-blue-500/[0.15] cursor-pointer">
                  <ArrowLeft className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  <span className="font-medium">Back to Landing</span>
                </div>
              </Link>
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:text-foreground hover:bg-red-500/[0.08] dark:hover:bg-red-500/[0.08] transition-colors group border border-transparent hover:border-red-500/[0.15]"
              >
                <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                <span className="font-medium">Disconnect Wallet</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay - Blur effect when sidebar is open */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/40 dark:bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen relative z-10">
        <div className="max-w-6xl mx-auto space-y-8 pb-10">{children}</div>
      </main>
    </div>
  );
}
