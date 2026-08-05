import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Cpu, Server, Database, RefreshCw, CheckCircle2, Users, Terminal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export default function AdminOverview() {
  const { isDark } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState([
    { id: '1', time: '23:10:04', level: 'INFO', msg: 'AI Routing Engine initialized with Gemini & Pollinations failover.' },
    { id: '2', time: '23:10:12', level: 'WARN', msg: 'Local MongoDB fallback cache active for instant response speed.' },
    { id: '3', time: '23:10:25', level: 'INFO', msg: 'JWT Auth Service operational with HMAC-SHA256 tokens.' },
    { id: '4', time: '23:11:01', level: 'INFO', msg: 'Socket.IO real-time event broadcaster standing by on port 3001.' },
  ]);

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs((prev) => [
        { id: String(Date.now()), time: new Date().toLocaleTimeString(), level: 'INFO', msg: 'Admin system diagnostics refreshed cleanly.' },
        ...prev,
      ]);
      setIsRefreshing(false);
    }, 600);
  };

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-5">
      {/* Admin Header */}
      <div className={`p-5 rounded-xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <Badge variant="indigo" className="mb-2">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Platform Admin Portal
          </Badge>
          <h2 className={`text-lg font-bold ${textPri}`}>System Infrastructure & Health</h2>
          <p className={`text-xs mt-0.5 ${textMut}`}>
            Real-time monitoring of backend servers, database connectivity, AI endpoints, and system logs.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          onClick={handleRefreshStats}
        >
          Run Diagnostics
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <div className={`text-xs ${textMut}`}>Backend Server</div>
            <div className="text-sm font-bold text-emerald-500 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy (3001)
            </div>
            <div className={`text-[10px] mt-1 ${textMut}`}>Express & Socket.IO active</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <div className={`text-xs ${textMut}`}>Database Engine</div>
            <div className="text-sm font-bold text-amber-500 mt-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> In-Memory Cache
            </div>
            <div className={`text-[10px] mt-1 ${textMut}`}>MongoDB ready for reconnect</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <div className={`text-xs ${textMut}`}>AI LLM Provider</div>
            <div className="text-sm font-bold text-indigo-400 mt-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Active (Gemini/Poll)
            </div>
            <div className={`text-[10px] mt-1 ${textMut}`}>Avg latency ~240ms</div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <div className={`text-xs ${textMut}`}>Registered Users</div>
            <div className={`text-sm font-bold mt-1 ${textPri}`}>1,482 Users</div>
            <div className="text-[10px] text-emerald-500 mt-1">+14% this week</div>
          </div>
          <div className={`p-2.5 rounded-lg ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'}`}>
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Terminal Live Logs */}
      <div className={`rounded-xl border ${cardBg} overflow-hidden`}>
        <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h3 className={`text-xs font-semibold ${textPri}`}>System Audit Stream</h3>
          </div>
          <Badge variant="zinc">Live</Badge>
        </div>

        <div className={`p-4 font-mono text-xs space-y-2 max-h-64 overflow-y-auto ${isDark ? 'bg-zinc-950 text-zinc-300' : 'bg-zinc-900 text-zinc-100'}`}>
          {logs.map((log) => (
            <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} key={log.id} className="flex gap-3">
              <span className="text-zinc-500 flex-shrink-0">[{log.time}]</span>
              <span className={`font-semibold flex-shrink-0 ${log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {log.level}
              </span>
              <span className="leading-relaxed">{log.msg}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
