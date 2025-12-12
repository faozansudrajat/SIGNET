import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {

  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Copy,
  RefreshCw,
  AlertTriangle,
  Key,
  BarChart3,
} from "lucide-react";

const USAGE_DATA = [
  { name: "Mon", requests: 4000 },
  { name: "Tue", requests: 3000 },
  { name: "Wed", requests: 2000 },
  { name: "Thu", requests: 2780 },
  { name: "Fri", requests: 1890 },
  { name: "Sat", requests: 2390 },
  { name: "Sun", requests: 3490 },
];

export default function APIUsage() {
  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          API Usage
        </h2>
        <p className="text-gray-400 mt-1">
          Monitor your API consumption and manage access keys.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats & Graph */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Request Volume (7 Days)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USAGE_DATA}>
                  <defs>
                    <linearGradient
                      id="colorRequests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Total Requests
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                19,550
              </h3>
              <p className="text-green-400 text-sm mt-2">Top 10% of users</p>
            </GlassCard>
            <GlassCard>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Avg. Latency
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                124ms
              </h3>
              <p className="text-blue-400 text-sm mt-2">Global CDN Active</p>
            </GlassCard>
          </div>
        </div>

        {/* Sidebar: Quota & Keys */}
        <div className="space-y-8">
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Monthly Quota
            </h3>
            <div className="relative pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-900 dark:text-white">Used</span>
                <span className="text-gray-400">45,200 / 50,000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[90%]" />
              </div>
              <div className="flex items-start gap-3 mt-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                <div className="text-sm">
                  <p className="text-orange-200 font-medium">Quota Warning</p>
                  <p className="text-orange-200/70">
                    You are approaching your monthly limit. Consider upgrading.
                  </p>
                </div>
              </div>
              <GlowButton className="w-full mt-6" variant="secondary">
                Upgrade Plan
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              API Key
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Public Key</p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-sm text-gray-300">
                  <span className="truncate">pk_live_51Mx...92zA</span>
                  <Copy className="w-4 h-4 ml-auto cursor-pointer hover:text-slate-900 dark:hover:text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Secret Key</p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-sm text-gray-300">
                  <span className="truncate">sk_live_................</span>
                  <Copy className="w-4 h-4 ml-auto cursor-pointer hover:text-slate-900 dark:hover:text-white" />
                </div>
              </div>
              <GlowButton variant="danger" className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Rotate Keys
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
