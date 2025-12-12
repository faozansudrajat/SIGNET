import { Check, Copy } from "lucide-react";
import { useState } from "react";


interface CodeBlockGlassProps {
  language?: string;
  code: string;
  title?: string;
}

export function CodeBlockGlass({ language = "javascript", code, title }: CodeBlockGlassProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md my-4 shadow-lg">
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            {title && <span className="text-xs font-mono text-gray-400 ml-2">{title}</span>}
          </div>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-blue-100/90 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
