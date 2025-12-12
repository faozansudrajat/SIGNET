import { GlassCard } from "@/components/ui/glass-card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";


type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

export function CodeBlock({ code, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="p-0 overflow-hidden border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
      {title && (
        <div className="px-4 py-2 border-b border-white/10 bg-black/20">
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      )}
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <pre className="p-6 overflow-x-auto">
          <code className={`text-sm font-mono text-gray-300`}>{code}</code>
        </pre>
      </div>
    </GlassCard>
  );
}

