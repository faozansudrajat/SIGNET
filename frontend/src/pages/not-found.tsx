import { Link } from "wouter";
import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/glow-button";
import generatedImage from '@/assets/img/dark_futuristic_background_with_swirling_blue_and_orange_lights.png';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
       {/* Background Image Layer */}
       <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url(${generatedImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[12rem] md:text-[18rem] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/10 select-none"
        >
          404
        </motion.h1>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass-panel p-8 md:p-12 rounded-3xl -mt-12 md:-mt-20 max-w-xl backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Oops, page not found</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The page you are looking for might have been under construction or moved to a different location.
          </p>
          
          <Link href="/">
            <GlowButton className="mx-auto">
              Back to Home →
            </GlowButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
