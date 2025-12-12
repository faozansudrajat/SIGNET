import { GlassCard } from "@/components/ui/glass-card";
import { Globe } from "lucide-react";

export default function Contents() {
  return (
    <div className="space-y-8 max-w-4xl">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400" />
          4. Get All Contents
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          View the list of indexed content in the local database.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Method</p>
            <p className="text-green-500 font-mono font-bold">GET</p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Endpoint</p>
            <p className="text-blue-600 dark:text-blue-300 font-mono">
              /api/contents
            </p>
          </GlassCard>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Success Response (200 OK)
          </h3>
          <p className="text-sm text-muted-foreground">
            Returns an object with contents array and pagination metadata. Note
            the lowercase keys as per database model.
          </p>
          <GlassCard className="p-0 overflow-hidden bg-[#f5f5f5] dark:bg-[#1e1e1e]">
            <pre className="p-4 text-sm text-slate-800 dark:text-gray-300 overflow-x-auto">
                            {`{
    "contents": [
        {
            "id": 1,
            "phash": "a1b2c3d4e5f67890",
            "publisher": "0xPublisherAddress...",
            "title": "Content Title",
            "description": "Content description...",
            "timestamp": 1700000000,
            "txhash": "0x123456789abcdef...",
            "blocknumber": 1005,
            "created_at": "2024-01-01T12:00:00"
        }
    ],
    "total": 100,
    "limit": 50,
    "offset": 0
}`}
                        </pre>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

