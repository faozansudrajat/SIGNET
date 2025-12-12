import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Upload, Fingerprint, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    title: "Upload & Hash",
    desc: "Content is processed using perceptual hashing (pHash).",
    icon: Upload,
    angle: 0, // 0 degrees (top)
  },
  {
    title: "Fingerprint on Chain",
    desc: "The hash is stored immutably on Story Protocol.",
    icon: Fingerprint,
    angle: 120, // 120 degrees (bottom-right)
  },
  {
    title: "Instant Verification",
    desc: "Compare any content against on-chain fingerprints.",
    icon: ShieldCheck,
    angle: 240, // 240 degrees (bottom-left)
  },
];

type RotatingCardsProps = {
  imageUrl: string;
  imageAlt?: string;
};

export function RotatingCards({ imageUrl, imageAlt = "SIGNET" }: RotatingCardsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const radius = 180; // Distance from center

  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Center Image */}
      <motion.div
        className="relative z-10 w-64 h-64 rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Rotating Cards */}
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        // Calculate position based on angle
        const radians = (step.angle * Math.PI) / 180;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;

        return (
          <motion.div
            key={index}
            className="absolute z-20 w-[280px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0.3,
              scale: isHovered ? 1 : 0.9,
              x: isHovered ? x : x * 0.7,
              y: isHovered ? y : y * 0.7,
              rotate: isHovered ? 0 : step.angle - 90,
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            style={{
              left: "50%",
              top: "50%",
              transformOrigin: "center center",
            }}
          >
            <GlassCard
              className={`group h-full transition-all duration-500 ${
                isHovered
                  ? "border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-black/40"
                  : "border-white/5 bg-black/20"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                    isHovered
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-[0_0_20px_rgba(100,130,255,0.2)] scale-110"
                      : "bg-white/[0.05] border-white/[0.08]"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-500 ${
                      isHovered ? "text-blue-300" : "text-gray-400"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-base font-semibold mb-1 transition-colors duration-500 ${
                      isHovered ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}

      {/* Connecting Lines (optional, for visual connection) */}
      {isHovered && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-5"
          style={{ overflow: "visible" }}
        >
          {STEPS.map((step, index) => {
            const radians = (step.angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;
            const centerX = 50; // 50% of container
            const centerY = 50; // 50% of container
            const endX = 50 + (x / 10); // Convert to percentage
            const endY = 50 + (y / 10);

            return (
              <motion.line
                key={index}
                x1={`${centerX}%`}
                y1={`${centerY}%`}
                x2={`${endX}%`}
                y2={`${endY}%`}
                stroke="url(#gradient-line)"
                strokeWidth="2"
                strokeDasharray="4,4"
                strokeOpacity="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5227FF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF9FFC" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}

