import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAddress } from "ethers";
import emailjs from "emailjs-com";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Wallet, CheckCircle, AlertCircle, Loader2, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

export const WhitelistSection = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submittedAt, setSubmittedAt] = useState("");

    // Validate wallet address
    const validateWallet = (address: string): boolean => {
        if (!address.trim()) {
            setError("Please enter a wallet address");
            return false;
        }

        if (!isAddress(address)) {
            setError("Invalid Ethereum wallet address. Please check the format (0x...)");
            return false;
        }

        setError("");
        return true;
    };

    // Step 1 -> Step 2
    const handleContinue = () => {
        if (validateWallet(walletAddress)) {
            const timestamp = new Date().toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
            setSubmittedAt(timestamp);
            setCurrentStep(2);
        }
    };

    // Send email via EmailJS
    const sendEmailToAdmin = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Format wallet address for display
            const shortWallet = `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}`;

            const templateParams = {
                // Common EmailJS variable names
                to_name: "Admin",
                from_name: "Whitelist Form",
                from_wallet: walletAddress,
                wallet_address: walletAddress,
                short_wallet: shortWallet,
                submitted_at: submittedAt,
                submission_time: submittedAt,
                message: `New whitelist request received!\n\nWallet Address: ${walletAddress}\nSubmitted At: ${submittedAt}\n\nPlease review and add this wallet to the whitelist.`,
                subject: `[Whitelist Request] ${shortWallet}`,
                reply_to: "noreply@signet.app",
            };

            console.log("Sending email with params:", templateParams);

            const response = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            console.log("EmailJS Response:", response);

            if (response.status === 200) {
                setCurrentStep(3);
            } else {
                throw new Error("Failed to send email");
            }
        } catch (err) {
            console.error("EmailJS Error:", err);
            setError("Failed to submit your request. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setWalletAddress("");
        setError("");
        setIsLoading(false);
        setSubmittedAt("");
        setCurrentStep(1);
    };

    const totalSteps = 3;

    return (
        <section id="whitelist" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >

                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                        Join the Whitelist
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Be among the first to access exclusive features. Submit your wallet address and our admin will review your request.
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-2">
                        ⏳ Limited spots available for early access
                    </p>
                </motion.div>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <GlassCard className="p-8 bg-white/[0.08] dark:bg-white/[0.03] border border-white/[0.15] dark:border-white/[0.08]">
                        {/* Step Indicators */}
                        <div className="flex items-center justify-center mb-10">
                            {[1, 2, 3].map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: currentStep === step ? 1.1 : 1,
                                            backgroundColor: currentStep > step
                                                ? 'rgba(82,39,255,0.3)'
                                                : currentStep === step
                                                    ? 'rgba(82,39,255,0.2)'
                                                    : 'rgba(255,255,255,0.05)',
                                            borderColor: currentStep >= step
                                                ? 'rgba(82,39,255,0.6)'
                                                : 'rgba(255,255,255,0.15)',
                                        }}
                                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full font-semibold border-2 relative"
                                    >
                                        {currentStep > step ? (
                                            <CheckCircle className="h-6 w-6 text-blue-400" />
                                        ) : currentStep === step ? (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-muted-foreground">{step}</span>
                                        )}
                                    </motion.div>

                                    {index < totalSteps - 1 && (
                                        <div className="w-16 md:w-24 h-0.5 mx-2 bg-white/[0.1] dark:bg-white/[0.05] relative overflow-hidden">
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scaleX: currentStep > step ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.4 }}
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            {/* Step 1: Wallet Input */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.15] dark:border-white/10 mb-4">
                                            <Wallet className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            Enter Your Wallet Address
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Provide your Ethereum wallet address to join the whitelist
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="wallet" className="block text-sm font-semibold text-foreground">
                                            Wallet Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="wallet"
                                                type="text"
                                                value={walletAddress}
                                                onChange={(e) => {
                                                    setWalletAddress(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                placeholder="0x..."
                                                className={`w-full px-4 py-4 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border-2 ${error
                                                    ? 'border-red-500/50 focus:border-red-500'
                                                    : 'border-white/[0.15] dark:border-white/[0.08] focus:border-blue-500/50'
                                                    } text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all backdrop-blur-sm`}
                                            />
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                                >
                                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                                </motion.div>
                                            )}
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                            >
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <GlowButton
                                            onClick={handleContinue}
                                            disabled={!walletAddress.trim()}
                                            className="w-full justify-center py-4 text-base font-semibold group"
                                        >
                                            Continue
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </GlowButton>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Confirmation */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/[0.15] dark:border-white/10 mb-4">
                                            <CheckCircle className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            Confirm Your Information
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Please review your details before submitting
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.15] dark:border-white/[0.08]">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                    <Wallet className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Wallet Address</p>
                                                    <p className="text-foreground font-mono text-sm break-all">{walletAddress}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.15] dark:border-white/[0.08]">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                                    <Calendar className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Submission Time</p>
                                                    <p className="text-foreground text-sm">{submittedAt}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                                            >
                                                <p className="text-sm text-red-400 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {error}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            disabled={isLoading}
                                            className="flex-1 px-6 py-4 rounded-xl bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.15] dark:border-white/[0.08] text-foreground font-semibold hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            Back
                                        </button>
                                        <GlowButton
                                            onClick={sendEmailToAdmin}
                                            disabled={isLoading}
                                            className="flex-[2] justify-center py-4 text-base font-semibold"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Request
                                                    <CheckCircle className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </GlowButton>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Success */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, ease: "easeOut" }}
                                    className="space-y-6 text-center py-10 relative"
                                >
                                    {/* Lightweight confetti effect */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="absolute inset-0 pointer-events-none overflow-hidden"
                                    >
                                        {[...Array(18)].map((_, i) => (
                                            <motion.span
                                                key={i}
                                                className="absolute w-2 h-2 rounded-sm bg-gradient-to-br from-blue-500 to-purple-500"
                                                initial={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 1,
                                                    scale: 0.8,
                                                }}
                                                animate={{
                                                    x: (Math.random() - 0.5) * 260,
                                                    y: (Math.random() - 0.5) * 260,
                                                    opacity: 0,
                                                    scale: 1.2,
                                                }}
                                                transition={{ duration: 1.6, delay: i * 0.05, ease: "easeOut" }}
                                            />
                                        ))}
                                    </motion.div>

                                    {/* Animated success icon */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 220, damping: 14 }}
                                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/25 to-emerald-500/15 border-2 border-green-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                                    >
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </motion.div>

                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl font-bold text-foreground"
                                    >
                                        Request Submitted Successfully 🎉
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="text-muted-foreground max-w-md mx-auto mb-2 text-base"
                                    >
                                        Thank you! Your admin will review your request and whitelist your wallet manually.
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-500/15 border border-green-500/25 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-sm font-semibold text-green-400">
                                            Email sent to admin
                                        </span>
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleReset}
                                        className="px-6 py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-500/25 to-purple-500/25 border border-white/15 shadow-[0_0_18px_rgba(82,39,255,0.25)] hover:shadow-[0_0_25px_rgba(82,39,255,0.4)] transition-all font-semibold text-white"
                                    >
                                        Submit Another Wallet
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </motion.div>

                {/* Info Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-muted-foreground/60">
                        💡 By joining the whitelist, you'll get early access to premium features and exclusive benefits
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
