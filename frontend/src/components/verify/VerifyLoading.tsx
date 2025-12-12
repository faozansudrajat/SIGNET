import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function VerifyLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-12 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Animated Shield Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div>
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/20"
              animate={{
                scale: [1, 1.3, 1.8],
                opacity: [0.3, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </motion.div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Analyzing Content
            </h3>
            <p className="text-muted-foreground">
              Calculating perceptual hash and checking against blockchain
              registry...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </motion.div>
              <span className="text-sm text-muted-foreground">
                Processing file...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </motion.div>
              <span className="text-sm text-muted-foreground">
                Generating fingerprint...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              >
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </motion.div>
              <span className="text-sm text-muted-foreground">
                Querying blockchain...
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
