import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck } from "lucide-react";

export default function Verify() {
  return (
    <div className="space-y-8 max-w-4xl">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          3. Verify Content
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Check content authenticity by comparing the perceptual hash (pHash)
          with the existing database.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Method</p>
            <p className="text-yellow-500 font-mono font-bold">POST</p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Endpoint</p>
            <p className="text-blue-600 dark:text-blue-300 font-mono">
              /api/verify
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Body Type</p>
            <p className="text-purple-500 dark:text-purple-300 font-mono">
              form-data
            </p>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Body Parameters
          </h3>
          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/40 dark:bg-white/5 border-b border-white/40 dark:border-white/10">
                  <tr>
                    <th className="p-4 font-semibold text-blue-700 dark:text-blue-200">
                      Key
                    </th>
                    <th className="p-4 font-semibold text-blue-700 dark:text-blue-200">
                      Type
                    </th>
                    <th className="p-4 font-semibold text-blue-700 dark:text-blue-200">
                      Required
                    </th>
                    <th className="p-4 font-semibold text-blue-700 dark:text-blue-200">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60 dark:divide-white/5">
                  <tr>
                    <td className="p-4 font-mono text-purple-700 dark:text-purple-300">
                      file
                    </td>
                    <td className="p-4 text-slate-700 dark:text-gray-300">
                      File
                    </td>
                    <td className="p-4 text-yellow-500 dark:text-yellow-400">
                      Optional*
                    </td>
                    <td className="p-4 text-slate-700 dark:text-gray-300">
                      File to verify for authenticity.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-purple-700 dark:text-purple-300">
                      link
                    </td>
                    <td className="p-4 text-slate-700 dark:text-gray-300">
                      Text
                    </td>
                    <td className="p-4 text-yellow-500 dark:text-yellow-400">
                      Optional*
                    </td>
                    <td className="p-4 text-slate-700 dark:text-gray-300">
                      Video/image link (YouTube, TikTok, Instagram, Direct URL).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 text-sm text-slate-700 dark:text-gray-400 italic">
              *One of <code>file</code> or <code>link</code> must be provided.
            </div>
          </GlassCard>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Response: VERIFIED (Authentic)
          </h3>
          <p className="text-sm text-muted-foreground">
            Content found with similarity below threshold (Hamming Distance
            &lt;= Threshold).
          </p>
          <GlassCard className="p-0 overflow-hidden bg-[#f5f5f5] dark:bg-[#1e1e1e]">
            <pre className="p-4 text-sm text-slate-800 dark:text-gray-300 overflow-x-auto">
              {`{
    "status": "VERIFIED",
    "pHash_input": "a1b2c3d4e5f67890",
    "pHash_match": "a1b2c3d4e5f67890",
    "hamming_distance": 0,
    "publisher": "0xPublisherAddress...",
    "title": "Content Title",
    "txHash": "0x123456789abcdef...",
    "explorer_link": "https://aeneid.storyscan.xyz/tx/0x...",
    "message": "Content is authentic."
}`}
            </pre>
          </GlassCard>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Response: UNVERIFIED (Fake/Not Registered)
          </h3>
          <p className="text-sm text-muted-foreground">
            Content not found or difference is too large.
          </p>
          <GlassCard className="p-0 overflow-hidden bg-[#f5f5f5] dark:bg-[#1e1e1e]">
            <pre className="p-4 text-sm text-slate-800 dark:text-gray-300 overflow-x-auto">
              {`{
    "status": "UNVERIFIED",
    "pHash_input": "f9e8d7c6b5a43210",
    "message": "No matching content found."
}`}
            </pre>
          </GlassCard>
          <p className="text-sm text-muted-foreground mt-2">
            Or if found but distance is too large:
          </p>
          <GlassCard className="p-0 overflow-hidden bg-[#f5f5f5] dark:bg-[#1e1e1e]">
            <pre className="p-4 text-sm text-slate-800 dark:text-gray-300 overflow-x-auto">
              {`{
    "status": "UNVERIFIED",
    "pHash_input": "...",
    "pHash_match": "...",
    "hamming_distance": 35,
    ...
    "message": "Content is different."
}`}
            </pre>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

