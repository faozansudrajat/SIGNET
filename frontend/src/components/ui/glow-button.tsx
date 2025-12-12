import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

interface GlowButtonProps extends ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function GlowButton({ 
  children, 
  className, 
  variant = "primary", 
  loading = false,
  disabled,
  ...props 
}: GlowButtonProps) {
  const variants = {
    primary: "bg-blue-500/20 dark:bg-white/[0.08] border-blue-500/40 dark:border-white/[0.15] hover:bg-blue-500/30 dark:hover:bg-white/[0.12] hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_24px_rgba(100,130,255,0.3)] text-blue-700 dark:text-white font-semibold",
    secondary: "bg-white/[0.05] dark:bg-transparent border-white/[0.1] dark:border-white/[0.08] hover:bg-white/[0.08] dark:hover:bg-white/[0.03] text-foreground dark:text-gray-300",
    danger: "bg-red-500/20 dark:bg-red-500/[0.08] border-red-500/40 dark:border-red-500/[0.15] hover:bg-red-500/30 dark:hover:bg-red-500/[0.12] hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] dark:hover:shadow-[0_0_24px_rgba(239,68,68,0.3)] text-red-700 dark:text-red-200"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 border backdrop-blur-[12px] flex items-center justify-center gap-2",
        variants[variant],
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
