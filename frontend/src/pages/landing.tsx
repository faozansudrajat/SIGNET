import { Link } from "wouter";
import { motion, useMotionValue } from "framer-motion";
import { GlowButton } from "@/components/ui/glow-button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useTheme } from "next-themes";

import LiquidEther from "@/components/LiquidEther";
import BlurText from "@/components/BlurText";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { DesktopStoryProtocol } from "@/components/illustrations/desktop-story-protocol";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

import { HowItWorksSection2 } from "@/components/landing/HowItWorksSection2";
import { WhySignetSection } from "@/components/landing/WhySignetSection";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

// Floating particles component
const FloatingParticles = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  // Higher opacity in dark mode to make particles more visible
  const opacityRange =
    mounted && theme === "dark" ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-foreground/5 dark:bg-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: opacityRange,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const scrollY = useMotionValue(0);
  const isInitialMount = useRef(true);
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  // Static values for padding
  // Navbar height (h-20 = 80px) + top-4 (16px) + extra spacing (64px) = 160px
  const heroPaddingTop = 180;
  const heroPaddingBottom = 40;

  const [showDescription, setShowDescription] = useState(false);

  const handleConnectWallet = () => {
    // ...
    if (isConnected) {
      // If connected, navigate to dashboard
      window.location.href = "/dashboard";
    } else {
      // If not connected, open wallet modal
      open();
    }
  };

  useEffect(() => {
    // Initialize scrollY value
    scrollY.set(window.scrollY);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Skip state updates on initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      setScrolled(currentScrollY > 20);

      // Animate on scroll: logo pulled down, description fades in
      if (currentScrollY > 0 && !showDescription) {
        setShowDescription(true);
      } else if (currentScrollY === 0 && showDescription) {
        setShowDescription(false);
      }

      scrollY.set(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Set initial mount to false after a short delay to allow components to render
    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [scrollY, showDescription]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-blue-500/30 dark:selection:bg-blue-500/30">
      {/* LiquidEther Background - Full Page Animation */}
      <div
        className="fixed inset-0 pointer-events-none bg-background"
        style={{ zIndex: 0 }}
      >
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={50}
          isViscous={false}
          viscous={30}
          iterationsViscous={4}
          iterationsPoisson={4}
          resolution={0.1}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          className="opacity-60"
        />
      </div>

      {/* Overlay gradient for text readability */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-background/40 to-background/80 dark:from-black/80 dark:via-black/40 dark:to-black/80"
        style={{ zIndex: 1 }}
      />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Animated gradient orbs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content wrapper */}
      <div>
        {/* Navbar */}
        <LandingNavbar scrolled={scrolled} />
        {/* Hero Section */}
        <motion.section
          id="hero"
          className="relative px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden z-10 scroll-mt-32"
          style={{
            paddingTop: heroPaddingTop,
            paddingBottom: heroPaddingBottom,
          }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
              {/* Left Column: Text Content */}
              <motion.div
                className="flex flex-col items-start text-left px-2 md:px-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-6">
                  <BlurText
                    text="Protect the Truth"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
                  />

                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight mt-2">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent lg:whitespace-nowrap">
                      Verify Digital Content
                    </span>
                  </h1>
                </div>

                <div className="space-y-6 max-w-xl">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Upload & Hash: Content is processed using perceptual hashing
                    (pHash) for instant verification. Your content is registered as IP Assets on Story Protocol with licensing protection, stored immutably on-chain for verifiable authenticity.
                  </p>

                  <Link href="/verify">
                    <GlowButton className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg group">
                      <span>Verify Content Now</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </GlowButton>
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Desktop Mockup */}
              <motion.div
                className="relative flex justify-center lg:justify-end items-start px-2 md:px-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {/* Glow effect behind desktop */}
                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full transform scale-75" />

                <motion.div
                  className="relative z-10 w-full max-w-lg transform hover:scale-[1.02] transition-transform duration-500 lg:-mt-12"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <DesktopStoryProtocol />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works - Card Swap Section */}
        <HowItWorksSection2 />

        {/* Features Grid */}
        <FeaturesSection />
        {/* Benefits Section */}
        <WhySignetSection />
        {/* Pricing */}
        <PricingSection onConnect={handleConnectWallet} />
        {/* Whitelist Section Removed */}
        {/* FAQ Section */}
        <FAQSection />
        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
}
