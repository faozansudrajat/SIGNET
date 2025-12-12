import { Upload, Fingerprint, ShieldCheck } from "lucide-react";
import { LampContainer } from "@/components/ui/lamp";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "motion/react";

const STEPS = [
    {
        id: 1,
        title: "Upload & Hash",
        desc: "Your content is processed locally using advanced perceptual hashing (pHash) to create a unique digital fingerprint.",
        icon: Upload,
        color: "text-blue-500",
    },
    {
        id: 2,
        title: "Blockchain Timestamp",
        desc: "The fingerprint is cryptographically signed and permanently stored on Story Protocol as an IP Asset for immutable proof.",
        icon: Fingerprint,
        color: "text-purple-500",
    },
    {
        id: 3,
        title: "Instant Verification",
        desc: "Anyone can verify the content's authenticity by comparing it against the on-chain record in milliseconds.",
        icon: ShieldCheck,
        color: "text-emerald-500",
    },
];

export const HowItWorksSection = () => {
    const testimonials = STEPS.map(step => ({
        quote: step.desc,
        name: step.title,
        designation: `Step ${step.id}`,
        icon: <step.icon className={`w-32 h-32 ${step.color}`} />
    }));

    return (
        <section id="how-it-works" className="relative z-10 overflow-hidden">
            <LampContainer className="min-h-[40rem] pt-58 md:pt-98">
                <motion.h1
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="mt-8 py-4 text-center text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white md:text-7xl"
                >
                    How SIGNET Works
                </motion.h1>

                <div className="mt-12 w-full max-w-6xl">
                    <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
                </div>
            </LampContainer>
        </section>
    );
};
