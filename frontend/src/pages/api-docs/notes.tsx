import { GlassCard } from "@/components/ui/glass-card";
import { AlertCircle, Bot, Settings } from "lucide-react";

export default function Notes() {
  return (
    <div className="space-y-8 max-w-4xl">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-400" />
          Additional Notes
        </h2>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Gasless Transactions
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The <strong>Register Content</strong> endpoint uses{" "}
              <strong>EIP-2771 meta-transactions</strong> (gasless) for
              blockchain registration.
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-white space-y-2 ml-2">
              <li>
                Publishers don&apos;t need to pay gas fees - the backend relayer
                handles it
              </li>
              <li>
                The{" "}
                <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-purple-700 dark:text-purple-300 font-mono text-sm">
                  publisher_address
                </code>{" "}
                parameter is used for publisher validation
              </li>
              <li>
                Backend validates if the publisher is whitelisted before
                processing the transaction
              </li>
              <li>Uses Story Protocol network with trusted forwarder contract</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Telegram Bot
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In addition to this API, a <strong>Telegram Bot</strong> is also
              available with more comprehensive features.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The bot uses the{" "}
              <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm">
                /api/verify
              </code>{" "}
              endpoint behind the scenes for file processing.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Environment Configuration
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Some API behaviors are influenced by the{" "}
              <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-300 font-mono text-sm">
                .env
              </code>{" "}
              file:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-white space-y-2 ml-2">
              <li>
                <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm">
                  HAMMING_THRESHOLD
                </code>
                : Threshold for image difference tolerance (Default: 25). The
                lower the value, the stricter the verification.
              </li>
              <li>
                <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm">
                  VITE_FORWARDER_ADDRESS
                </code>
                : EIP-2771 trusted forwarder contract address for gasless
                transactions.
              </li>
              <li>
                <code className="bg-black/5 dark:bg-black/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm">
                  VITE_REGISTRY_ADDRESS
                </code>
                : SIGNET Registry smart contract address on Story Protocol network.
              </li>
            </ul>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

