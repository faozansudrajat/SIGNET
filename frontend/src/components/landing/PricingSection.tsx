import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import {
    CheckCircle,
    Building2,
    Users,
    ArrowRight,
    RotateCcw,
    Info,
    ShieldCheck
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const CheckItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <li className={`flex items-start gap-3 text-sm text-muted-foreground ${className}`}>
        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
        <span className="flex-1 leading-tight">{children}</span>
    </li>
);

interface PricingSectionProps {
    onConnect?: () => void;
}

interface FlipCardProps {
    plan: {
        name: string;
        badge?: string;
        status: string;
        description: string;
        price: string;
        period: string;
        icon: any;
        features: string[];
        details: string[];
        cta: string;
        action?: () => void;
        highlight: boolean;
        color: string;
    };
    delay: number;
}

const FlipCard = ({ plan, delay }: FlipCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="h-full min-h-[600px]"
        >
            <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
                <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* FRONT SIDE */}
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden"
                        }}
                    >
                        <GlassCard
                            className={`relative flex flex-col h-full p-8 ${plan.highlight
                                ? "border-blue-500/20 dark:border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-blue-500/5 dark:bg-blue-900/10"
                                : "opacity-80 hover:opacity-100 transition-opacity"
                                }`}
                        >
                            {plan.badge && (
                                <div className={`absolute top-0 right-0 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-bl-2xl rounded-tr-[22px] border-l border-b ${plan.color === 'blue' ? 'bg-blue-600/90 border-blue-400/30 text-white' :
                                    plan.color === 'purple' ? 'bg-purple-600/90 border-purple-400/30 text-white' :
                                        'bg-rose-600/90 border-rose-400/30 text-white'
                                    }`}>
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                    plan.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-rose-500/20 text-rose-400'
                                    }`}>
                                    <plan.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    {plan.period && plan.price !== "Free" && plan.price !== "Custom" && plan.price !== "TBD" && <span className="text-muted-foreground text-sm">/ {plan.period}</span>}
                                </div>
                            </div>

                            {/* HOOKS - Key Features */}
                            <div className="flex-1 mb-6">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                    Key Features
                                </h4>
                                <ul className="space-y-3">
                                    {plan.features.slice(0, 4).map((feat, j) => (
                                        <CheckItem key={j}>{feat}</CheckItem>
                                    ))}
                                </ul>
                            </div>

                            {/* Show More Button */}
                            <div className="space-y-3 mt-auto">
                                <button
                                    onClick={() => setIsFlipped(true)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.15] dark:border-white/[0.08] text-foreground font-semibold hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 group text-sm"
                                >
                                    <Info className="w-4 h-4" />
                                    Show Details
                                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                </button>
                            </div>
                        </GlassCard>
                    </div>

                    {/* BACK SIDE */}
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)"
                        }}
                    >
                        <GlassCard
                            className={`relative flex flex-col h-full p-8 ${plan.highlight
                                ? "border-blue-500/20 dark:border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-blue-500/5 dark:bg-blue-900/10"
                                : "opacity-80"
                                }`}
                        >
                            {/* Back Header */}
                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                    plan.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-rose-500/20 text-rose-400'
                                    }`}>
                                    <Info className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {plan.name} Details
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Complete feature breakdown and specifications
                                </p>
                            </div>

                            {/* Detailed Features */}
                            <div className="flex-1 mb-6 overflow-y-auto custom-scrollbar max-h-[280px]">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                    What's Included
                                </h4>
                                <ul className="space-y-3">
                                    {plan.details.map((detail, j) => (
                                        <CheckItem key={j}>{detail}</CheckItem>
                                    ))}
                                </ul>
                            </div>

                            {/* Back to Front Button */}
                            <div className="mt-auto">
                                <button
                                    onClick={() => setIsFlipped(false)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.15] dark:border-white/[0.08] text-foreground font-semibold hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 group text-sm"
                                >
                                    <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                                    Back to Overview
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export const PricingSection = ({ onConnect }: PricingSectionProps) => {
    // Data paket disesuaikan dengan fitur Backend Story Protocol & SignetNFT
    const plans = [
        {
            name: "STARTER", // Diganti dari HACKATHON menjadi STARTER
            badge: "Free Access",
            status: "Available Now",
            description: "Full access to Story Protocol IP Registration & Deepfake Scanning.",
            price: "Free",
            period: "Forever",
            icon: Users,
            features: [
                "Story Protocol Aeneid Integration", // Fitur config.py
                "Smart Contract Minting (ERC-721)", // Fitur SignetNFT.sol
                "AI Deepfake Detection (pHash)",    // Fitur signet_core.py
                "Automated Takedown PDF"            // Fitur generate_pdf
            ],
            details: [
                "Self-Service Publisher Registration", // Fitur registerAsPublisher
                "Mint IP Asset on Story Protocol",
                "Automatic Perceptual Hashing (pHash)",
                "Store Metadata on IPFS (Pinata)",
                "Real-time Duplicate Hash Prevention", // Fitur isHashRegistered
                "Non-Commercial License Attachment",
                "Deepfake Similarity Scanning",
                "Generate Legal Evidence PDF",
                "Telegram Bot Integration",
                "Public Verification API Access"
            ],
            cta: "Connect Wallet",
            action: onConnect,
            highlight: true,
            color: "blue"
        },
        {
            name: "ENTERPRISE",
            badge: "Commercial",
            status: "Contact Sales",
            description: "For organizations requiring commercial licensing modules & high throughput.",
            price: "Custom",
            period: "Contact",
            icon: Building2,
            features: [
                "Commercial Licensing Modules", // Fitur Story Protocol Licensing
                "Dedicated RPC Nodes",
                "Batch Minting API",
                "24/7 Dispute Resolution"
            ],
            details: [
                "Everything in Starter plan",
                "Commercial Use License (PIL)",
                "Royalty Revenue Sharing",
                "High-Frequency API Rate Limits",
                "Custom Branding on Evidence PDF",
                "Dedicated Account Manager",
                "Priority Blockchain Transaction",
                "Custom Smart Contract Logic",
                "Multi-Signature Wallet Support",
                "Enterprise SLA & Uptime"
            ],
            cta: "Contact Sales",
            action: () => window.open("mailto:sales@signet.com?subject=Enterprise%20Inquiry", "_blank"),
            highlight: false,
            color: "rose"
        }
    ];

    return (
        <section id="pricing" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                        Protected on Story Protocol
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Secure your intellectual property with Proof-of-Existence and programmable IP licensing.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                    {plans.map((plan, i) => (
                        <FlipCard key={i} plan={plan} delay={i * 0.1} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Link href="/contact">
                        <span className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group text-sm cursor-pointer">
                            Need custom integration? Contact us
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </section>
    );
};