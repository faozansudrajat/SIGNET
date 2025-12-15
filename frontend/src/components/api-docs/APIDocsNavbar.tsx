import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import signetLogoPurple from "@/assets/img/signet-logo-purple.svg";
import signetLogoWhite from "@/assets/img/signet-logo-white.svg";

type APIDocsNavbarProps = {
  isMobileOpen: boolean;
  onMobileToggle: () => void;
};

export function APIDocsNavbar({
  isMobileOpen,
  onMobileToggle,
}: APIDocsNavbarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get logo based on theme (default to dark before mount)
  const logo =
    mounted && theme === "light" ? signetLogoPurple : signetLogoWhite;

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl h-20 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
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
          <span className="font-bold text-xl tracking-tight">
            SIGNET{" "}
            <span className="text-gray-500 font-normal ml-2 text-sm">
              API Docs
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/">
            <span className="hover:text-white transition-colors cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/verify">
            <span className="hover:text-white transition-colors cursor-pointer">
              Verify
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="hover:text-white transition-colors cursor-pointer">
              Dashboard
            </span>
          </Link>
          <Link href="/docs">
            <span className="text-white">Docs</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={onMobileToggle}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
