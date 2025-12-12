import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  Fingerprint,
  Lock,
  Zap,
  ShieldCheck,
  Activity,
  Search,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "perceptual-hashing",
    icon: Fingerprint,
    title: "Perceptual Hashing",
    shortDesc: "Detect near-duplicate and manipulated media with AI.",
    longDesc:
      "Unlike traditional cryptographic hashes (like SHA-256) that change completely with a single bit flip, our perceptual hashing (pHash) technology generates a fingerprint based on the visual content. This allows us to detect resized, cropped, or slightly color-graded versions of the same image, as well as identify malicious manipulations.",
    tags: ["AI Analysis", "Content ID", "Robust"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50",
    colSpan: "md:col-span-2",
  },
  {
    id: "immutable-record",
    icon: Lock,
    title: "Immutable Record",
    shortDesc: "Every signature is permanently stored on Story Protocol.",
    longDesc:
      "We leverage Story Protocol's IP Asset Registry to create an unalterable timestamp and proof of existence for every piece of content. Once registered as an IP Asset with attached licensing, it cannot be changed, deleted, or censored, providing a mathematically verifiable chain of custody from the moment of creation.",
    tags: ["Blockchain", "Story Protocol", "Security"],
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "verification-api",
    icon: Zap,
    title: "Verification API",
    shortDesc: "Enterprise-grade API for bulk checking at scale.",
    longDesc:
      "Built for platforms that handle millions of uploads. Our high-performance REST and GraphQL APIs allow social media networks, news organizations, and marketplaces to automatically verify content authenticity in real-time before it's published to their users.",
    tags: ["Developer Tools", "High Performance", "Scalable"],
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "group-hover:border-amber-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "publisher-identity",
    icon: ShieldCheck,
    title: "Publisher Identity",
    shortDesc: "Verified publishers ensure content legitimacy.",
    longDesc:
      "Trust the source, not just the content. SIGNET links media signatures to verified on-chain identities (DID). This allows viewers to instantly see if a video actually came from the BBC, CNN, or a government official, effectively neutralizing impersonation attacks.",
    tags: ["Identity", "DID", "Trust"],
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "group-hover:border-emerald-500/50",
    colSpan: "md:col-span-2",
  },
  {
    id: "anti-deepfake",
    icon: Activity,
    title: "Anti-Deepfake Defense",
    shortDesc: "Identify synthetic media instantly.",
    longDesc:
      "Our multi-layered defense system combines metadata analysis, provenance tracking, and AI detection models to flag potentially synthetic content. We provide a 'Trust Score' for every piece of media, giving users context about its origin and integrity.",
    tags: ["AI Safety", "Deepfake Detection", "Protection"],
    gradient: "from-red-500/20 to-rose-500/20",
    border: "group-hover:border-red-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "public-portal",
    icon: Search,
    title: "Public Portal",
    shortDesc: "Anyone can verify content without an account.",
    longDesc:
      "Transparency is key to trust. Our public verification portal allows journalists, researchers, and the general public to upload a file or paste a URL to instantly check its history, origin, and authenticity status—no login or subscription required.",
    tags: ["Open Access", "Transparency", "Free"],
    gradient: "from-indigo-500/20 to-violet-500/20",
    border: "group-hover:border-indigo-500/50",
    colSpan: "md:col-span-2",
  },
];

function SpotlightCard({
  children,
  className = "",
  onClick,
  layoutId,
  gradient,
}: any) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className={cn(
        "group relative border border-gray-300 dark:border-white/10 bg-white/[0.5] dark:bg-white/[0.02] overflow-hidden rounded-3xl cursor-pointer backdrop-blur-sm",
        className
      )}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br",
          gradient
        )}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="features" className="py-24 relative overflow-visible">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to secure digital trust.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          {FEATURES.map((feature) => (
            <SpotlightCard
              key={feature.id}
              layoutId={`card-${feature.id}`}
              onClick={() => setSelectedId(feature.id)}
              className={feature.colSpan}
              gradient={feature.gradient}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      "bg-white/[0.3] dark:bg-white/5 border border-gray-300 dark:border-white/8",
                      "group-hover:scale-110 transition-transform duration-500 shadow-lg",
                      feature.border
                    )}
                  >
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>

                <div className="mt-auto">
                  <motion.h3
                    layoutId={`title-${feature.id}`}
                    className="text-2xl font-bold mb-3 text-foreground"
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p
                    layoutId={`desc-${feature.id}`}
                    className="text-muted-foreground text-base leading-relaxed"
                  >
                    {feature.shortDesc}
                  </motion.p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {selectedId &&
          createPortal(
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="fixed inset-0 bg-background/80 backdrop-blur-md z-99999 cursor-pointer"
              />

              <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                {FEATURES.map(
                  (feature) =>
                    feature.id === selectedId && (
                      <motion.div
                        key={feature.id}
                        layoutId={`card-${feature.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-4xl bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(null);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                        >
                          <X className="w-5 h-5 text-foreground" />
                        </button>

                        <div
                          className={cn(
                            "w-full md:w-2/5 p-8 flex items-center justify-center relative overflow-hidden",
                            "bg-linear-to-br",
                            feature.gradient
                          )}
                        >
                          <feature.icon className="w-32 h-32 text-foreground relative z-10 drop-shadow-2xl" />
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        </div>

                        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col bg-white dark:bg-[#0A0A0A] overflow-y-auto relative z-10 border-t md:border-t-0 md:border-l border-gray-300 dark:border-white/10">
                          <motion.h3
                            layoutId={`title-${feature.id}`}
                            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                          >
                            {feature.title}
                          </motion.h3>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {feature.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 border border-white/10 text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <motion.p
                            layoutId={`desc-${feature.id}`}
                            className="text-muted-foreground text-lg leading-relaxed mb-8"
                          >
                            {feature.longDesc}
                          </motion.p>

                          <div className="mt-auto pt-8 border-t border-gray-300 dark:border-white/10">
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                              Key Benefits
                            </h4>
                            <ul className="grid grid-cols-1 gap-3">
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Enterprise-grade security</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Real-time verification</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Seamless integration</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )
                )}
              </div>
            </>,
            document.body
          )}
      </div>
    </section>
  );
}
