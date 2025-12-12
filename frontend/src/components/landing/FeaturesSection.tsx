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
  FileText, // Ditambahkan untuk ikon Evidence PDF
  Scale     // Ditambahkan untuk ikon Licensing
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "perceptual-hashing",
    icon: Fingerprint,
    title: "AI Perceptual Hashing",
    shortDesc: "Robust content fingerprinting using pHash algorithms.",
    longDesc:
      "Unlike fragile SHA-256 hashes that break with a single pixel change, our Perceptual Hashing (pHash) technology generates a visual fingerprint that survives compression, resizing, and format changes. This allows the system to detect the 'same' image or video even after it has been manipulated or posted across different platforms.",
    tags: ["Core Tech", "pHash", "Python OpenCV"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50",
    colSpan: "md:col-span-2",
  },
  {
    id: "story-protocol",
    icon: Lock,
    title: "Story Protocol IP Anchor",
    shortDesc: "Assets are registered on the Aeneid Testnet.",
    longDesc:
      "Every uploaded file is not just stored; it is minted as an NFT and automatically registered as an IP Asset on Story Protocol. This creates an immutable, on-chain provenance record that mathematically proves ownership and creation time, secured by the Story IP Asset Registry.",
    tags: ["Blockchain", "Story Aeneid", "IP Asset"],
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "smart-licensing",
    icon: Scale,
    title: "Programmable Licensing",
    shortDesc: "Auto-attach Non-Commercial terms (PIL).",
    longDesc:
      "Forget complex legal paperwork. SIGNET automatically attaches the 'Non-Commercial Social Media' Programmable IP License (PIL) to every registered asset via the Story Licensing Module. This embeds usage rights directly into the blockchain transaction, making IP compliance readable by both humans and machines.",
    tags: ["Licensing Module", "PIL", "Smart Contract"],
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "group-hover:border-amber-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "visual-similarity",
    icon: Activity,
    title: "Similarity & Deepfake Scan",
    shortDesc: "Detect manipulated media via Hamming Distance.",
    longDesc:
      "Our Verification Engine calculates the Hamming Distance between media fingerprints to identify deepfakes, unauthorized edits, and near-duplicate infringements. If a scanned file has a similarity score above 80%, the system flags it as a potential violation of a registered IP Asset.",
    tags: ["Visual Forensics", "Hamming Distance", "Security"],
    gradient: "from-red-500/20 to-rose-500/20",
    border: "group-hover:border-red-500/50",
    colSpan: "md:col-span-2",
  },
  {
    id: "evidence-generation",
    icon: FileText,
    title: "Legal Evidence PDF",
    shortDesc: "Generate automated takedown reports instantly.",
    longDesc:
      "When a violation is detected, SIGNET instantly generates a cryptographically signed PDF report. This document includes the original IP ID, the infringing content's visual similarity score, and the on-chain transaction hash—providing a ready-to-use evidence package for DMCA takedowns or legal disputes.",
    tags: ["Legal Tech", "PDF Generator", "Automation"],
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "group-hover:border-emerald-500/50",
    colSpan: "md:col-span-1",
  },
  {
    id: "permissionless-registry",
    icon: Search,
    title: "Permissionless Registry",
    shortDesc: "Self-service registration for all creators.",
    longDesc:
      "We believe in open access. Our Smart Contract allows any user to call the 'registerAsPublisher' function, enabling a permissionless ecosystem where journalists, artists, and creators can secure their work without waiting for centralized approval.",
    tags: ["Open Access", "Web3", "Decentralized"],
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
            Powered by Story Protocol & Advanced Forensic AI.
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
                            "bg-gradient-to-br",
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
                                <span>Story Protocol Integration</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>On-Chain Provenance</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Automated Legal Tech</span>
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