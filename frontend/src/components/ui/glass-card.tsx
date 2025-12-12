import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface GlassCardProps extends ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-[24px] p-8 transition-all duration-500 relative overflow-hidden group",
        // Apple-style glassmorphism: subtle blur, more transparent
        "bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.1] dark:border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        hoverEffect && "hover:translate-y-[-4px] hover:bg-white/[0.08] dark:hover:bg-white/[0.05] hover:border-white/[0.15] dark:hover:border-white/[0.12] hover:shadow-[0_12px_48px_rgba(100,130,255,0.15)] dark:hover:shadow-[0_12px_48px_rgba(100,130,255,0.12)]",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] dark:from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      
      {/* Content wrapper to ensure z-index above overlays */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
