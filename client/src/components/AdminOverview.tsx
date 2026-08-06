import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Cpu, Server, Database, RefreshCw, CheckCircle2, Users, Calendar,
  Ticket, UserCheck, Award, AlertTriangle, TrendingUp, Sparkles, Clock, MapPin, Download, FileText
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import AdvancedDataTable from './dashboard/AdvancedDataTable';
import { exportToCSV, exportToPDF } from '../utils/exportReports';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description: string;
  status: 'good' | 'warning' | 'critical';
  statusLabel: string;
  icon: React.ReactNode;
}

function AdminStatCard({ title, value, description, status, statusLabel, icon }: AdminStatCardProps) {
  const { isDark } = useTheme();

  const statusBadge = {
    good: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  }[status];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`p-5 rounded-2xl border transition-all cursor-default flex flex-col justify-between h-full ${
        isDark
          ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-md shadow-zinc-950/40'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800 text-amber-400 border border-zinc-700/60' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusBadge}`}>
            {statusLabel}
          </span>
        </div>

        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {title}
        </p>
        <p className={`text-3xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      <p className={`text-[11px] font-medium mt-3 pt-2.5 border-t border-zinc-800/40 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {description}
      </p>
    </motion.div>
  );
}

export default function AdminOverview() {
  const { isDark } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const adminStats: AdminStatCardProps[] = [
    { title: 'Total Events', value: 24, description: '+3 events added this month', status: 'good', statusLabel: 'Optimal', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Active Events', value: 8, description: 'Live & accepting check-ins', status: 'good', statusLabel: 'Live', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Upcoming Events', value: 12, description: 'Scheduled in next 30 days', status: 'good', statusLabel: 'On Track', icon: <Clock className="w-5 h-5" /> },
    { title: 'Completed Events', value: 4, description: 'Archived with feedback', status: 'good', statusLabel: 'Done', icon: <Award className="w-5 h-5" /> },
    { title: 'Total Users', value: 1482, description: '+14% growth this week', status: 'good', statusLabel: 'Growing', icon: <Users className="w-5 h-5" /> },
    { title: 'Total Organizers', value: 36, description: 'Verified platform partners', status: 'good', statusLabel: 'Verified', icon: <ShieldAlert className="w-5 h-5" /> },
    { title: 'Total Volunteers', value: 142, description: 'Skill-matched roster', status: 'good', statusLabel: 'Active', icon: <UserCheck className="w-5 h-5" /> },
    { title: 'Total Registrations', value: 2840, description: 'Across all active events', status: 'good', statusLabel: '+18%', icon: <Ticket className="w-5 h-5" /> },
    { title: 'Today Registrations', value: 84, description: 'New signups past 24h', status: 'good', statusLabel: 'High', icon: <TrendingUp className="w-5 h-5" /> },
    { title: 'Pending Approvals', value: 6, description: 'Requires admin review', status: 'warning', statusLabel: 'Action Needed', icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Total Check-ins', value: 1960, description: 'Verified via QR scanner', status: 'good', statusLabel: 'Verified', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Attendance Rate', value: '84.2%', description: 'Checked-in / Total registered', status: 'good', statusLabel: 'High Target', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const quickInsights = [
    { title: 'Most Popular Event', detail: 'AI & ML Innovations Summit 2026 (420 Registered)', badge: 'Top Capacity', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { title: 'Event Filling Fast', detail: 'Global Hackathon 2026 (280/350 seats - 80% Full)', badge: '80% Full', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
    { title: 'Highest Attendance Rate', detail: 'Cyber Security Workshop (94% Check-in rate)', badge: '94% Checked In', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    { title: 'Volunteer Champion', detail: 'Kabir Mehta (14 Task Completions & Scan Lead)', badge: 'Top Star', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  ];

  const smartAlerts = [
    { severity: 'critical', title: 'Global Hackathon 2026 at 80% Capacity', message: 'Only 70 remaining seats left before registration closes.', time: '10 mins ago' },
    { severity: 'warning', title: 'Pending Organizer Verification (2 Request)', message: 'New organization accounts awaiting document review.', time: '25 mins ago' },
    { severity: 'info', title: 'Cyber Security Workshop in 24 Hours', message: 'Automated QR pass reminders dispatched to 115 registered attendees.', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <Badge variant="indigo" className="mb-2">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Platform Admin Portal
          </Badge>
          <h2 className={`text-xl font-extrabold ${textPri}`}>System Analytics & Platform Metrics</h2>
          <p className={`text-xs font-medium mt-1 ${textSub}`}>
            Executive dashboard metrics, real-time alerts, quick insights, and exportable system records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV('Admin_Metrics_Report', ['Metric', 'Value'], adminStats.map(s => [s.title, s.value]))}
            leftIcon={<Download className="w-4 h-4 text-amber-500" />}
          >
            Export Metrics CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-4 h-4 text-zinc-950 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 500);
            }}
          >
            Refresh Analytics
          </Button>
        </div>
      </div>

      {/* 12 SaaS Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <AdminStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Quick Insights Cards & Smart Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Insights Highlights */}
        <div className={`lg:col-span-7 rounded-2xl border ${cardBg} p-6 space-y-4`}>
          <h3 className={`text-base font-extrabold flex items-center gap-2 ${textPri}`}>
            <Sparkles className="w-5 h-5 text-amber-500" />
            Quick Platform Insights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickInsights.map((ins, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${textPri}`}>{ins.title}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${ins.color}`}>
                    {ins.badge}
                  </span>
                </div>
                <p className={`text-xs ${textSub}`}>{ins.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Smart Alerts */}
        <div className={`lg:col-span-5 rounded-2xl border ${cardBg} p-6 space-y-4`}>
          <h3 className={`text-base font-extrabold flex items-center gap-2 ${textPri}`}>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Severity Smart Alerts
          </h3>

          <div className="space-y-3">
            {smartAlerts.map((alt, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                  alt.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                  alt.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold leading-snug">{alt.title}</p>
                  <p className={`text-[11px] mt-0.5 ${textSub}`}>{alt.message}</p>
                </div>
                <span className={`text-[10px] ${textSub} flex-shrink-0`}>{alt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Data Tables Component (No Graphs) */}
      <AdvancedDataTable />
    </div>
  );
}
