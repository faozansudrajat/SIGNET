import { GlassCard } from "@/components/ui/glass-card";

import { motion } from "framer-motion";

type APIDocsSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export function APIDocsSection({ id, title, children }: APIDocsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-8 md:p-10 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="prose prose-invert max-w-none space-y-6">{children}</div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

