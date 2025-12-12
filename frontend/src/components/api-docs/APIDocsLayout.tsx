import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import { TableOfContents } from "./TableOfContents";
import { MobileTableOfContents } from "./MobileTableOfContents";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";
import LiquidEther from "@/components/LiquidEther";

interface APIDocsLayoutProps {
  children: React.ReactNode;
}

export function APIDocsLayout({ children }: APIDocsLayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Get logo based on theme (default to white/dark mode before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-blue-500/30 dark:selection:bg-blue-500/30">
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

      {/* Top Navbar - Fixed rounded-full navbar (desktop) */}
      <motion.nav
        className="hidden lg:block fixed top-4 left-4 right-4 z-50 rounded-full border border-white/[0.1] dark:border-white/[0.08] bg-background/30 dark:bg-black/30 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                <img
                  src={logo}
                  alt="SIGNET"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">SIGNET</span>
              <span className="text-muted-foreground font-normal ml-2 text-sm hidden xl:inline">
                API Docs
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <GlowButton variant="secondary" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back to Home
              </GlowButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Desktop Layout: Fixed Sidebar + Content Area */}
      <div className="hidden lg:flex relative z-30">
        {/* Fixed Sidebar - Independent container */}
        <TableOfContents />

        {/* Content Area - Independent scrollable container */}
        <div
          className="flex-1 ml-[296px] h-screen overflow-y-auto relative z-30"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Spacer for navbar - increased for rounded navbar */}
          <div className="h-28 flex-shrink-0" />

          {/* Content */}
          <div className="p-6 lg:p-10 pb-20">{children}</div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-30">
        {/* Mobile Navbar - Rounded full */}
        <motion.nav
          className="fixed top-4 left-4 right-4 z-50 rounded-full border border-white/[0.1] dark:border-white/[0.08] bg-background/30 dark:bg-black/30 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-6 h-full flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/20 dark:bg-black/20 backdrop-blur-[8px] border border-white/[0.1] dark:border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                  <img src={logo} alt="SIGNET" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  SIGNET{" "}
                  <span className="text-muted-foreground font-normal ml-2 text-sm">
                    API Docs
                  </span>
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Sidebar - slides in from the right */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMobileOpen ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed top-24 right-4 bottom-4 w-[280px] z-40 rounded-3xl overflow-hidden",
            "bg-white/[0.05] dark:bg-black/90 backdrop-blur-[12px]",
            "border border-white/[0.1] dark:border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          )}
          style={{ pointerEvents: isMobileOpen ? "auto" : "none" }}
        >
          <MobileTableOfContents onItemClick={() => setIsMobileOpen(false)} />
        </motion.div>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/40 dark:bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Content */}
        <div className="overflow-y-auto pt-24" style={{ scrollBehavior: "smooth" }}>
          <div className="p-6 pb-20">{children}</div>
        </div>
      </div>
    </div>
  );
}
