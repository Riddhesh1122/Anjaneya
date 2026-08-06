import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, UserCheck, ShieldCheck, Ticket, Award, CheckCircle2,
  AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, FileText, Download, Filter
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { exportToCSV, exportToPDF } from '../utils/exportReports';

interface MetricStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  status: 'Good' | 'Warning' | 'Critical';
  icon: React.ElementType;
}

export default function AdminOverview() {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const metrics: MetricStat[] = [
    { id: '1', title: 'Total Platform Events', value: 24, change: '+12.5%', isPositive: true, status: 'Good', icon: Calendar },
    { id: '2', title: 'Active Live Events', value: 8, change: '+4.2%', isPositive: true, status: 'Good', icon: CheckCircle2 },
    { id: '3', title: 'Upcoming Events', value: 12, change: '+18.0%', isPositive: true, status: 'Good', icon: Calendar },
    { id: '4', title: 'Completed Events', value: 4, change: '0%', isPositive: true, status: 'Good', icon: Award },
    { id: '5', title: 'Total Registered Users', value: 1480, change: '+24.1%', isPositive: true, status: 'Good', icon: Users },
    { id: '6', title: 'Active Organizers', value: 42, change: '+8.3%', isPositive: true, status: 'Good', icon: ShieldCheck },
    { id: '7', title: 'Registered Volunteers', value: 185, change: '+15.2%', isPositive: true, status: 'Good', icon: UserCheck },
    { id: '8', title: 'Total Event Registrations', value: 3820, change: '+31.0%', isPositive: true, status: 'Good', icon: Ticket },
    { id: '9', title: 'Certificates Issued', value: 920, change: '+19.4%', isPositive: true, status: 'Good', icon: Award },
    { id: '10', title: 'Average Event Capacity', value: '78%', change: '+5.1%', isPositive: true, status: 'Good', icon: Users },
    { id: '11', title: 'Pending Approval Queue', value: 3, change: '-2.0%', isPositive: false, status: 'Warning', icon: AlertTriangle },
    { id: '12', title: 'System Security Audit', value: '100% OK', change: 'Optimal', isPositive: true, status: 'Good', icon: ShieldCheck },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const statusBadgeClass = (st: 'Good' | 'Warning' | 'Critical') => {
    switch (st) {
      case 'Good':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Warning':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Admin_Platform_Metrics',
      ['Metric Title', 'Current Value', 'Growth Change', 'Status'],
      metrics.map(m => [m.title, String(m.value), m.change, m.status])
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      'Admin Platform Performance Report',
      ['Metric Title', 'Current Value', 'Growth Change', 'Status'],
      metrics.map(m => [m.title, String(m.value), m.change, m.status])
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Platform Overview</span>
          <h2 className={`text-xl font-black ${textPri}`}>Analytics & Metric Command Center</h2>
          <p className={`text-xs ${textSub}`}>Real-time performance indicators and operational health metrics (No-Graphs Compliant)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl border ${cardBg} text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-500" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* 12 SaaS Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border ${cardBg} transition-all cursor-pointer flex flex-col justify-between min-h-[145px] hover:border-zinc-700/80`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className={`text-[11px] font-extrabold truncate block ${textSub}`}>{m.title}</span>
                  <h3 className={`text-2xl font-black tracking-tight ${textPri}`}>{m.value}</h3>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
                <span className={`text-xs font-bold flex items-center gap-0.5 ${m.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {m.change}
                </span>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusBadgeClass(m.status)}`}>
                  {m.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
