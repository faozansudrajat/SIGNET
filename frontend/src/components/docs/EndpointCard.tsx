import { GlassCard } from "@/components/ui/glass-card";
import { CodeBlock } from "./CodeBlock";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type EndpointCardProps = {
  method: Method;
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  requestExample?: string;
  responseExample?: string;
  errorExamples?: Array<{
    code: number;
    message: string;
  }>;
};

const methodColors = {
  GET: "bg-green-500/20 text-green-400 border-green-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function EndpointCard({
  method,
  path,
  description,
  parameters,
  requestExample,
  responseExample,
  errorExamples,
}: EndpointCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-8 space-y-6 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        {/* Header */}
        <div className="flex items-start gap-4">
          <span
            className={`px-3 py-1 rounded-lg text-sm font-bold border ${methodColors[method]}`}
          >
            {method}
          </span>
          <code className="flex-1 text-lg font-mono text-white bg-black/40 px-4 py-2 rounded-lg border border-white/10">
            {path}
          </code>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>

        {/* Parameters Table */}
        {parameters && parameters.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Parameters
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Required
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <code className="text-blue-400 font-mono text-sm">{param.name}</code>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{param.type}</td>
                      <td className="py-3 px-4">
                        {param.required ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs border border-red-500/30">
                            Required
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 text-xs border border-gray-500/30">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Example */}
        {requestExample && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Request Example
            </h4>
            <CodeBlock code={requestExample} language="javascript" />
          </div>
        )}

        {/* Response Example */}
        {responseExample && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Success Response
            </h4>
            <CodeBlock code={responseExample} language="json" />
          </div>
        )}

        {/* Error Examples */}
        {errorExamples && errorExamples.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Error Responses
            </h4>
            <div className="space-y-3">
              {errorExamples.map((error, idx) => (
                <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                      {error.code}
                    </span>
                    <span className="text-red-300 text-sm font-medium">{error.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

