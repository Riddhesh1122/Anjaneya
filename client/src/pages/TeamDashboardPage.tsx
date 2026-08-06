import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Key, Copy, CheckCircle2, AlertTriangle, ShieldCheck,
  UserCheck, Trash2, Send, Award, Clock, ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import CreateJoinTeamModal from '../components/CreateJoinTeamModal';

interface Member {
  userId: string;
  name: string;
  email: string;
  role: 'Leader' | 'Member';
  joinedAt: string;
}

interface Team {
  id: string;
  teamName: string;
  description: string;
  eventId: string;
  eventTitle: string;
  leaderId: string;
  leaderName: string;
  inviteCode: string;
  minTeamSize: number;
  maxTeamSize: number;
  members: Member[];
  status: 'Forming' | 'Submitted' | 'Approved' | 'Rejected';
  createdAt: string;
}

const initialTeams: Team[] = [
  {
    id: 't1',
    teamName: 'CyberShield Innovators',
    description: 'AI & Zero Trust Security Research Team',
    eventId: 'e1',
    eventTitle: 'AI & ML Innovations Summit 2026',
    leaderId: 'demo-user',
    leaderName: 'Aarav Sharma (You)',
    inviteCode: 'TEAM-X9P2',
    minTeamSize: 2,
    maxTeamSize: 4,
    members: [
      { userId: 'demo-user', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Leader', joinedAt: 'Aug 4' },
      { userId: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: 'Member', joinedAt: 'Aug 4' },
      { userId: 'u3', name: 'Rohan Verma', email: 'rohan@example.com', role: 'Member', joinedAt: 'Aug 5' },
    ],
    status: 'Approved',
    createdAt: 'Aug 4',
  },
  {
    id: 't2',
    teamName: 'Neural Net Hackers',
    description: 'Generative AI & LLM Automation Project',
    eventId: 'e2',
    eventTitle: 'Global Hackathon 2026',
    leaderId: 'u4',
    leaderName: 'Kabir Mehta',
    inviteCode: 'TEAM-K8W4',
    minTeamSize: 2,
    maxTeamSize: 5,
    members: [
      { userId: 'u4', name: 'Kabir Mehta', email: 'kabir@example.com', role: 'Leader', joinedAt: 'Aug 3' },
      { userId: 'demo-user', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Member', joinedAt: 'Aug 4' },
      { userId: 'u5', name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Member', joinedAt: 'Aug 5' },
    ],
    status: 'Submitted',
    createdAt: 'Aug 3',
  },
];

export default function TeamDashboardPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const submitTeam = (id: string) => {
    setSubmittingId(id);
    setTimeout(() => {
      setTeams(prev =>
        prev.map(t => (t.id === id ? { ...t, status: 'Submitted' } : t))
      );
      setSubmittingId(null);
    }, 600);
  };

  const updateStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setTeams(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Submitted':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <Badge variant="indigo" className="mb-2">
            <Users className="w-3.5 h-3.5 mr-1" /> Team Registration System
          </Badge>
          <h2 className={`text-xl font-extrabold ${textPri}`}>My Teams & Collaborations</h2>
          <p className={`text-xs font-medium ${textSub}`}>
            Create teams, invite members via 6-character codes, manage rosters, and submit team registrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModal(true)}
            leftIcon={<Plus className="w-4 h-4 text-zinc-950" />}
          >
            Create or Join Team
          </Button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => {
          const isLeader = team.leaderId === 'demo-user' || team.members[0].name.includes('Aarav');

          return (
            <motion.div
              key={team.id}
              whileHover={{ y: -3 }}
              className={`p-6 rounded-2xl border ${cardBg} space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Header & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{team.eventTitle}</span>
                    <h3 className={`text-lg font-black ${textPri}`}>{team.teamName}</h3>
                    <p className={`text-xs ${textSub}`}>{team.description}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusBadge(team.status)}`}>
                    {team.status}
                  </span>
                </div>

                {/* Invite Code Box */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Team Invite Code</span>
                    <p className="text-sm font-mono font-black text-amber-400 tracking-widest">{team.inviteCode}</p>
                  </div>

                  <button
                    onClick={() => copyInviteCode(team.inviteCode)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-500" />
                    {copiedCode === team.inviteCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                {/* Member Roster */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-extrabold ${textPri}`}>
                      Team Members ({team.members.length} / {team.maxTeamSize})
                    </span>
                    <span className={`text-[10px] font-bold ${textSub}`}>Min required: {team.minTeamSize}</span>
                  </div>

                  <div className="space-y-2">
                    {team.members.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-[11px] flex items-center justify-center border border-amber-500/30">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-bold ${textPri}`}>{m.name}</p>
                            <p className={`text-[10px] ${textSub}`}>{m.email}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          m.role === 'Leader' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="pt-4 border-t border-zinc-800/40 flex items-center justify-between gap-2">
                {isLeader ? (
                  <>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Team Leader
                    </span>

                    {team.status === 'Forming' && (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={submittingId === team.id}
                        onClick={() => submitTeam(team.id)}
                        leftIcon={<Send className="w-3.5 h-3.5 text-zinc-950" />}
                      >
                        Submit Registration
                      </Button>
                    )}

                    {team.status === 'Submitted' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateStatus(team.id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/25"
                        >
                          Approve (Organizer)
                        </button>
                        <button
                          onClick={() => updateStatus(team.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold cursor-pointer hover:bg-rose-500/25"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-500" /> Member Role
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateJoinTeamModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setTeams(prev => [
              {
                id: `t-${Date.now()}`,
                teamName: 'New AI Taskforce',
                description: 'Newly Created Team',
                eventId: 'e1',
                eventTitle: 'AI Innovations Summit 2026',
                leaderId: 'demo-user',
                leaderName: 'Aarav Sharma (You)',
                inviteCode: 'TEAM-Z4M8',
                minTeamSize: 2,
                maxTeamSize: 5,
                members: [{ userId: 'demo-user', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Leader', joinedAt: 'Just now' }],
                status: 'Forming',
                createdAt: 'Just now',
              },
              ...prev,
            ]);
          }}
        />
      )}
    </div>
  );
}
