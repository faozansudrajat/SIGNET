import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Scale, Building2 } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Protect Brand Reputation",
    desc: "Prevent misinformation from damaging trust",
  },
  {
    icon: Scale,
    title: "Legal & Compliance Ready",
    desc: "Immutable proofs for audits, legal cases, and reporting.",
  },
  {
    icon: Building2,
    title: "Built for Enterprise",
    desc: "Scalable for media, government, law firms, and investigators.",
  },
];

export const WhySignetSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Large offset to ensure cards come from outside viewport (like thrown)
  // Using 3000px which is larger than most viewport widths
  const throwOffset = 3000;

  // Title animation - slide from left, no fade
  const titleX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [-300, 0, 0, 300]
  );

  // Subtitle animation - slide from right, no fade
  const subtitleX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [300, 0, 0, -300]
  );

  // Card 1 - slide from left viewport edge with rotation
  const card1X = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [-throwOffset, 0, 0, 0, throwOffset]
  );
  const card1Rotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [-45, 0, 0, 0, 45]
  );

  // Card 2 - slide from right viewport edge with rotation
  const card2X = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.85, 1],
    [throwOffset, 0, 0, 0, -throwOffset]
  );
  const card2Rotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.85, 1],
    [45, 0, 0, 0, -45]
  );

  // Card 3 - slide from right viewport edge with rotation (different from card 2)
  const card3X = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.9, 1],
    [throwOffset, 0, 0, 0, -throwOffset]
  );
  const card3Rotate = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.9, 1],
    [60, 0, 0, 0, -60]
  );

  return (
    <section ref={sectionRef} className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            style={{ x: titleX }}
            className="text-3xl md:text-5xl font-bold mb-4 text-foreground"
          >
            Why SIGNET?
          </motion.h2>
          <motion.p style={{ x: subtitleX }} className="text-muted-foreground">
            Built for trust in the digital age.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, i) => {
            let cardX, cardRotate;
            if (i === 0) {
              cardX = card1X;
              cardRotate = card1Rotate;
            } else if (i === 1) {
              cardX = card2X;
              cardRotate = card2Rotate;
            } else {
              cardX = card3X;
              cardRotate = card3Rotate;
            }

            return (
              <motion.div
                key={i}
                style={{
                  x: cardX,
                  rotate: cardRotate,
                }}
                className="h-full"
              >
                <CardSpotlight
                  className="h-full bg-white/5 dark:bg-white/5 border-white/10 backdrop-blur-md p-8 rounded-3xl cursor-pointer"
                  color="#3b82f6"
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="p-3 w-fit rounded-xl bg-gradient-to-br from-white/[0.05] dark:from-white/[0.05] to-white/[0.02] dark:to-white/[0.02] border border-white/[0.1] dark:border-white/[0.08] mb-6 group-hover:border-white/[0.15] dark:group-hover:border-white/[0.12] transition-all duration-500 shadow-lg backdrop-blur-[8px]">
                      <benefit.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.desc}</p>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

