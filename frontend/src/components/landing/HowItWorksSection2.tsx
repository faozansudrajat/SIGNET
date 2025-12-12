import { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Upload, Fingerprint, ShieldCheck } from "lucide-react";
import CardSwap, { Card } from "@/components/CardSwap";
import image1 from "@/assets/img/1.png";
import image2 from "@/assets/img/2.png";
import image3 from "@/assets/img/3.png";

const HOW_IT_WORKS_STEPS = [
  {
    id: 1,
    title: "Upload & Hash",
    desc: "Your content is processed locally using advanced perceptual hashing (pHash) to create a unique digital fingerprint.",
    icon: Upload,
    color: "text-blue-500",
    image: image1,
  },
  {
    id: 2,
    title: "Register as IP Asset",
    desc: "The NFT is minted and registered as an IP Asset on Story Protocol with an attached Non-Commercial license, providing immutable proof and legal protection.",
    icon: Fingerprint,
    color: "text-purple-500",
    image: image2,
  },
  {
    id: 3,
    title: "Instant Verification",
    desc: "Anyone can verify the content's authenticity by comparing it against the on-chain IP Asset record in milliseconds.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    image: image3,
  },
];

export const HowItWorksSection2 = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardSize, setCardSize] = useState<{ width?: number; height?: number }>(
    {}
  );

  // Spotlight effect for container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const updateCardSize = () => {
      if (window.innerWidth < 640) {
        // Small screens (mobile)
        setCardSize({ width: 240, height: 200 });
      } else if (window.innerWidth < 1024) {
        // Medium screens (tablet)
        setCardSize({ width: 300, height: 260 });
      } else {
        // Large screens - use default (no width/height prop)
        setCardSize({});
      }
    };

    updateCardSize();
    window.addEventListener("resize", updateCardSize);
    return () => window.removeEventListener("resize", updateCardSize);
  }, []);

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            How SIGNET Works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to protect your digital content
          </p>
        </motion.div>

        {/* Container Card dengan rounded dan margin */}
        <div
          className="bg-white/[0.5] dark:bg-white/[0.02] border border-gray-300 dark:border-white/10 backdrop-blur-sm rounded-3xl pl-6 md:pl-8 lg:pl-12 shadow-2xl py-0 relative group/spotlight overflow-hidden cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Spotlight effect */}
          <motion.div
            className="pointer-events-none absolute z-0 -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(59, 130, 246, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-12 items-stretch relative z-10">
            {/* Left: Penjelasan (untuk layar besar) */}
            <motion.div
              key={activeCardIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 order-2 lg:order-1 flex flex-col justify-center h-full py-8 lg:py-0"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 ${HOW_IT_WORKS_STEPS[
                    activeCardIndex
                  ].color
                    .replace("text-", "bg-")
                    .replace("-500", "-500/20")}`}
                >
                  {(() => {
                    const IconComponent =
                      HOW_IT_WORKS_STEPS[activeCardIndex].icon;
                    return (
                      <IconComponent
                        className={`w-8 h-8 ${HOW_IT_WORKS_STEPS[activeCardIndex].color}`}
                      />
                    );
                  })()}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Step {HOW_IT_WORKS_STEPS[activeCardIndex].id}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    {HOW_IT_WORKS_STEPS[activeCardIndex].title}
                  </h3>
                </div>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                {HOW_IT_WORKS_STEPS[activeCardIndex].desc}
              </p>

              {/* Step Indicators */}
              <div className="flex gap-2 mt-8">
                {HOW_IT_WORKS_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCardIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeCardIndex
                        ? "bg-foreground w-8"
                        : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right: Card Swap dengan Illustrasi (untuk layar besar) */}
            <div className="relative h-[350px] md:h-[450px] lg:h-[550px] flex items-center justify-center md:items-end md:justify-end order-1 lg:order-2">
              <div className="relative w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto overflow-visible md:overflow-hidden px-4 sm:px-6 md:px-0 pb-8 md:pb-0">
                <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-end pr-0 md:pr-4 pb-0 md:pb-4">
                  <CardSwap
                    {...(cardSize.width && cardSize.height
                      ? { width: cardSize.width, height: cardSize.height }
                      : {})}
                    cardDistance={30}
                    verticalDistance={70}
                    delay={5000}
                    pauseOnHover={false}
                    autoSwap={false}
                    onCardClick={(idx) => setActiveCardIndex(idx)}
                  >
                    {HOW_IT_WORKS_STEPS.map((step) => {
                      return (
                        <Card
                          key={step.id}
                          className="border-white/20"
                          customClass="cursor-pointer hover:scale-105 transition-transform"
                          style={{
                            backgroundImage: `url(${step.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {/* Info di pojok kiri atas */}
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 pointer-events-none">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs md:text-sm font-semibold text-white">
                                {step.title}
                              </span>
                              <span className="text-[10px] md:text-xs text-white/80">
                                Step {step.id}
                              </span>
                            </div>
                          </div>
                          {/* Tengah dikosongkan */}
                        </Card>
                      );
                    })}
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
