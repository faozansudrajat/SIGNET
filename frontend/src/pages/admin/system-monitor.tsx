import { GlassCard } from "@/components/ui/glass-card";
import {
  Server,
  Activity,
  Database,
  Cpu,
  Network,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SYSTEM_METRICS = [
  { time: "00:00", requests: 1200, latency: 45, errors: 2 },
  { time: "04:00", requests: 800, latency: 38, errors: 1 },
  { time: "08:00", requests: 2400, latency: 52, errors: 3 },
  { time: "12:00", requests: 3200, latency: 48, errors: 1 },
  { time: "16:00", requests: 2800, latency: 55, errors: 4 },
  { time: "20:00", requests: 1900, latency: 42, errors: 2 },
];

const NODE_STATUS = [
  {
    name: "Lisk Node 1",
    status: "healthy",
    uptime: "99.9%",
    latency: "12ms",
    blocks: "1,234,567",
  },
  {
    name: "Lisk Node 2",
    status: "healthy",
    uptime: "99.8%",
    latency: "15ms",
    blocks: "1,234,566",
  },
  {
    name: "Indexer Service",
    status: "healthy",
    uptime: "99.7%",
    latency: "8ms",
    blocks: "1,234,567",
  },
  {
    name: "API Gateway",
    status: "warning",
    uptime: "98.5%",
    latency: "45ms",
    blocks: "-",
  },
];

export default function SystemMonitor() {
  return (
    <>
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          System Monitor
        </h2>
        <p className="text-muted-foreground mt-1">
          Monitor infrastructure health, performance metrics, and system status.
        </p>
      </motion.header>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Server className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-green-500/[0.15] border border-green-500/[0.2] text-green-400 mb-4">
                <Server className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                System Status
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Healthy
              </h3>
              <p className="text-green-400 text-sm mt-2">
                All systems operational
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Activity className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-blue-500/[0.15] border border-blue-500/[0.2] text-blue-400 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Avg. Latency
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                48ms
              </h3>
              <p className="text-blue-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                -5% from last hour
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Database className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-purple-500/[0.15] border border-purple-500/[0.2] text-purple-400 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Storage Used
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                68%
              </h3>
              <p className="text-purple-400 text-sm mt-2">2.4 TB / 3.5 TB</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-orange-500/[0.15] border border-orange-500/[0.2] text-orange-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                CPU Usage
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                42%
              </h3>
              <p className="text-orange-400 text-sm mt-2">Normal load</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Request Volume (24h)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SYSTEM_METRICS}>
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
                    dataKey="time"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-400" />
              Response Latency (24h)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SYSTEM_METRICS}>
                  <XAxis
                    dataKey="time"
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Node Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-green-400" />
              Node Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-900 dark:text-white border-b border-white/5 text-sm uppercase tracking-wider bg-white/[0.02]">
                  <th className="p-6 font-medium">Service</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium">Uptime</th>
                  <th className="p-6 font-medium">Latency</th>
                  <th className="p-6 font-medium">Blocks</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {NODE_STATUS.map((node, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {node.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      {node.status === "healthy" ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/[0.08] backdrop-blur-[4px] text-green-400 text-xs border border-green-500/[0.15] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Healthy
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/[0.08] backdrop-blur-[4px] text-yellow-400 text-xs border border-yellow-500/[0.15] flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Warning
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-slate-700 dark:text-gray-300">
                      {node.uptime}
                    </td>
                    <td className="p-6 text-slate-700 dark:text-gray-300">
                      {node.latency}
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-slate-700 dark:text-gray-300">
                        {node.blocks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}
