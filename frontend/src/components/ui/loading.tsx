import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GlassCard } from "./glass-card";

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Loading({ message = "Loading...", fullScreen = false, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const content = (
    <GlassCard className="p-8 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className={`${sizeClasses[size]} text-blue-400`} />
        </motion.div>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm font-medium"
          >
            {message}
          </motion.p>
        )}
      </div>
    </GlassCard>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
}

