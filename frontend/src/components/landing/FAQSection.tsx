import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
    {
        q: "Do I need admin approval to register content?",
        a: "No. In the spirit of Web3, our smart contract is permissionless. You can use the 'Self-Service Registration' feature to whitelist your wallet instantly and start minting IP Assets on Story Protocol without waiting for centralized approval.",
    },
    {
        q: "What is the difference between pHash and SHA-256?",
        a: "SHA-256 breaks if a single pixel changes. Our AI Perceptual Hashing (pHash) creates a visual fingerprint that survives resizing, compression, and format changes, allowing SIGNET to detect 'visually similar' stolen content even if the file data is different.",
    },
    {
        q: "What legal protection do I get?",
        a: "Every registered asset automatically gets a 'Non-Commercial Social Media' Programmable IP License (PIL) attached via Story Protocol. Additionally, our system generates a cryptographically signed PDF Evidence Report that includes the on-chain transaction hash for DMCA takedowns.",
    },
    {
        q: "Is the verification data public?",
        a: "Yes. The SIGNET Registry is built on the Story Protocol Aeneid Testnet. Anyone can query our public API or verify the 'Proof-of-Existence' directly on the blockchain using the IP ID or Transaction Hash.",
    },
    {
        q: "Can I integrate SIGNET into my platform?",
        a: "Absolutely. We provide a REST API for high-volume content platforms. You can send media files to our /verify endpoint to check for deepfakes or copyright infringements in real-time before they are published.",
    },
];

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 relative z-10 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/[0.05] dark:bg-white/[0.03] border border-white/[0.1] dark:border-white/[0.08] shadow-lg backdrop-blur-[12px]">
                        <HelpCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Technical details about our Forensic AI & Blockchain stack.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <GlassCard
                                className={`group transition-all duration-300 ${openIndex === i
                                    ? "bg-white/[0.08] dark:bg-white/[0.05] border-blue-500/20 dark:border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] dark:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                    : "hover:bg-white/[0.08] dark:hover:bg-white/[0.04] hover:border-white/[0.15] dark:hover:border-white/[0.1]"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(i)}
                                    className="w-full text-left flex items-center justify-between p-1"
                                >
                                    <span className={`text-lg font-medium transition-colors duration-300 ${openIndex === i ? "text-blue-300" : "text-foreground group-hover:text-foreground"
                                        }`}>
                                        {item.q}
                                    </span>
                                    <div className={`ml-4 p-2 rounded-full transition-all duration-300 ${openIndex === i ? "bg-blue-500/20 text-blue-300 rotate-180" : "bg-white/[0.05] dark:bg-white/[0.05] border border-white/[0.1] dark:border-white/[0.08] text-muted-foreground group-hover:bg-white/[0.1] dark:group-hover:bg-white/[0.1] group-hover:text-foreground"
                                        }`}>
                                        {openIndex === i ? (
                                            <Minus className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 pb-2 text-muted-foreground leading-relaxed border-t border-white/[0.08] dark:border-white/[0.08] mt-4">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};