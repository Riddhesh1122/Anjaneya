import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Search, Download, FileText, Filter, CheckCircle2,
  Clock, AlertTriangle, ShieldCheck, Terminal, Users, Key
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { exportToCSV, exportToPDF } from '../utils/exportReports';

interface AuditLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: 'Authentication' | 'Event' | 'Registration' | 'Attendance' | 'Volunteer' | 'Certificate' | 'System';
  resource: string;
  ipAddress: string;
  createdAt: string;
}

const mockAuditLogs: AuditLogItem[] = [
  { id: 'al-1', userName: 'Aarav Sharma', userRole: 'organizer', action: 'LOGIN_SUCCESS', module: 'Authentication', resource: 'JWT HMAC Session', ipAddress: '192.168.1.42', createdAt: '10 mins ago' },
  { id: 'al-2', userName: 'Aarav Sharma', userRole: 'organizer', action: 'EVENT_CREATED', module: 'Event', resource: 'AI & ML Summit 2026', ipAddress: '192.168.1.42', createdAt: '25 mins ago' },
  { id: 'al-3', userName: 'Priya Patel', userRole: 'attendee', action: 'REGISTRATION_SUBMITTED', module: 'Registration', resource: 'Registration Pass #ANJ-82K', ipAddress: '10.0.0.12', createdAt: '45 mins ago' },
  { id: 'al-4', userName: 'Kabir Mehta', userRole: 'volunteer', action: 'QR_CHECKIN_VERIFIED', module: 'Attendance', resource: 'Attendee Check-in Gate 1', ipAddress: '192.168.1.88', createdAt: '1 hour ago' },
  { id: 'al-5', userName: 'Aarav Sharma', userRole: 'organizer', action: 'CERTIFICATE_DISPATCHED', module: 'Certificate', resource: 'AI Certificate Batch #4', ipAddress: '192.168.1.42', createdAt: '2 hours ago' },
  { id: 'al-6', userName: 'System Admin', userRole: 'admin', action: 'SECURITY_AUDIT_HEALTHY', module: 'System', resource: 'Nodemailer & Socket Engine', ipAddress: '127.0.0.1', createdAt: '3 hours ago' },
];

export default function AuditLogsPage() {
  const { isDark } = useTheme();
  const [logs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const modules = ['All', 'Authentication', 'Event', 'Registration', 'Attendance', 'Volunteer', 'Certificate', 'System'];

  const filteredLogs = logs.filter(l => {
    const matchSearch = l.userName.toLowerCase().includes(search.toLowerCase()) ||
                        l.action.toLowerCase().includes(search.toLowerCase()) ||
                        l.resource.toLowerCase().includes(search.toLowerCase());
    const matchMod = selectedModule === 'All' || l.module === selectedModule;
    return matchSearch && matchMod;
  });

  const handleExportCSV = () => {
    exportToCSV(
      'Security_Audit_Logs',
      ['User', 'Role', 'Action', 'Module', 'Resource', 'IP Address', 'Timestamp'],
      filteredLogs.map(l => [l.userName, l.userRole, l.action, l.module, l.resource, l.ipAddress, l.createdAt])
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      'Security Audit Log Report',
      ['User', 'Role', 'Action', 'Module', 'Resource', 'IP Address', 'Timestamp'],
      filteredLogs.map(l => [l.userName, l.userRole, l.action, l.module, l.resource, l.ipAddress, l.createdAt])
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <Badge variant="indigo" className="mb-2">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Admin Security Portal
          </Badge>
          <h2 className={`text-xl font-extrabold ${textPri}`}>System Audit Logs & Security Stream</h2>
          <p className={`text-xs font-medium ${textSub}`}>
            Immutable platform audit trail tracking authentication, registrations, attendance, and administrative operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4 text-amber-500" />}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF} leftIcon={<FileText className="w-4 h-4 text-zinc-950" />}>
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit logs..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>
        </div>

        {/* Module Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/40">
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                selectedModule === mod ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table Component */}
      <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'} font-extrabold uppercase tracking-wider`}>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Resource Target</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {filteredLogs.map(l => (
                <tr key={l.id} className={isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}>
                  <td className="py-3.5 px-4">
                    <p className={`font-extrabold ${textPri}`}>{l.userName}</p>
                    <p className="text-[10px] text-amber-500 font-bold uppercase">{l.userRole}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-amber-400">{l.action}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {l.module}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-semibold ${textSub}`}>{l.resource}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{l.ipAddress}</td>
                  <td className={`py-3.5 px-4 ${textSub}`}>{l.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
