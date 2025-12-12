import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

export function CodeBlock({ code, language = "javascript", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="bg-black/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 overflow-x-auto shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{language}</div>
        <pre className="text-sm text-gray-300 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

