import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Hash,
  ShieldCheck,
  Upload,
  Building2,
  Zap,
  Code,
  AlertTriangle,
} from "lucide-react";

const SECTIONS = [
  { id: "introduction", label: "Introduction", icon: Hash },
  { id: "authentication", label: "Authentication", icon: ShieldCheck },
  { id: "verify-endpoint", label: "Verify Content", icon: ShieldCheck },
  { id: "register-endpoint", label: "Register Content", icon: Upload },
  { id: "publisher-endpoint", label: "Get Publisher", icon: Building2 },
  { id: "rate-limits", label: "Rate Limits", icon: Zap },
  { id: "sdk-js", label: "JavaScript SDK", icon: Code },
  { id: "sdk-python", label: "Python SDK", icon: Code },
  { id: "errors", label: "Error Codes", icon: AlertTriangle },
];

type APIDocsSidebarProps = {
  activeSection: string;
  onSectionClick: (id: string) => void;
  isMobileOpen: boolean;
};

export function APIDocsSidebar({
  activeSection,
  onSectionClick,
  isMobileOpen,
}: APIDocsSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "fixed lg:sticky top-20 lg:top-20 h-[calc(100vh-80px)] w-[280px] flex flex-col p-6 z-40 overflow-y-auto bg-white/80 dark:bg-[rgba(20,20,20,0.6)] backdrop-blur-[24px] border-r border-white/[0.18] dark:border-white/[0.08]",
        !isMobileOpen && "hidden lg:flex"
      )}
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-6 px-3">
          Table of Contents
        </h3>
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-3 group relative border-l-2",
                isActive
                  ? "text-gray-900 dark:text-white bg-white/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 border-transparent hover:border-blue-500/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                )}
              />
              <span className="font-medium">{section.label}</span>
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}
