import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Settings, Shield, Bell, Moon, Sun, Lock, Phone, Building, Key,
  CheckCircle2, AlertTriangle, LogOut, Trash2, Save, Sparkles, Award
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [bio, setBio] = useState('Full Stack Engineer & Event Lead for AI & ML Summit');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [organization, setOrganization] = useState('MIT Pune / Tech Guild');

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Notification Preferences State
  const [notifState, setNotifState] = useState({
    events: true,
    registrations: true,
    email: true,
    reminders: true,
    announcements: true,
    realtime: true,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const handleSaveSettings = () => {
    setSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 500);
  };

  const loginHistory = [
    { device: 'Chrome on Windows 11', location: 'Pune, India', ip: '192.168.1.42', time: 'Active now' },
    { device: 'Safari on iPhone 15', location: 'Pune, India', ip: '10.0.0.88', time: '2 hours ago' },
    { device: 'Firefox on macOS', location: 'Mumbai, India', ip: '172.16.0.4', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <Badge variant="indigo" className="mb-2">
            <Settings className="w-3.5 h-3.5 mr-1" /> Account & Profile Preferences
          </Badge>
          <h2 className={`text-xl font-extrabold ${textPri}`}>Settings & Profile Dashboard</h2>
          <p className={`text-xs font-medium ${textSub}`}>Manage your public profile, security, notifications, and active sessions</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          isLoading={saving}
          onClick={handleSaveSettings}
          leftIcon={<Save className="w-4 h-4 text-zinc-950" />}
        >
          Save Changes
        </Button>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold"
        >
          <CheckCircle2 className="w-4 h-4" />
          Settings successfully updated and saved!
        </motion.div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className={`lg:col-span-3 rounded-2xl border ${cardBg} p-3 space-y-1 h-fit`}>
          {[
            { id: 'profile', label: 'Public Profile', icon: User },
            { id: 'account', label: 'Account & Theme', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Sessions', icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : `${textSub} hover:${textPri} hover:bg-zinc-800/40`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className={`lg:col-span-9 rounded-2xl border ${cardBg} p-6 space-y-6`}>
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Completion Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
                    85%
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold ${textPri}`}>Profile Completion</h4>
                    <p className={`text-[11px] ${textSub}`}>Add phone number and organization to reach 100%</p>
                  </div>
                </div>
                <Badge variant="amber">High Completion</Badge>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Full Name</label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Phone Number</label>
                    <Input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>College / Organization</label>
                  <Input type="text" value={organization} onChange={e => setOrganization(e.target.value)} />
                </div>

                <div>
                  <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl border text-xs font-medium outline-none ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT & THEME TAB */}
          {activeTab === 'account' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-4">
                <h4 className={`text-sm font-extrabold ${textPri}`}>Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Current Password</label>
                    <Input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>New Password</label>
                    <Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <h4 className={`text-sm font-extrabold ${textPri}`}>Appearance & Theme</h4>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800">
                  <div>
                    <p className={`font-bold ${textPri}`}>Color Theme</p>
                    <p className={`text-[11px] ${textSub}`}>Currently active: {isDark ? 'Dark Theme' : 'Light Theme'}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleTheme}>
                    Toggle Theme
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION PREFERENCES TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h4 className={`text-sm font-extrabold ${textPri}`}>Notification Preferences</h4>

              {[
                { key: 'events', label: 'Event Notifications', desc: 'Updates for registered and saved events' },
                { key: 'registrations', label: 'Registration Updates', desc: 'Confirmations and approval status changes' },
                { key: 'email', label: 'Email Notifications', desc: 'Receive HTML ticket passes and summaries' },
                { key: 'reminders', label: '24-Hour Event Reminders', desc: 'Pre-event location and schedule alerts' },
                { key: 'realtime', label: 'Real-time Socket.IO Broadcasts', desc: 'Live capacity and check-in updates' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80">
                  <div>
                    <p className={`font-bold ${textPri}`}>{item.label}</p>
                    <p className={`text-[11px] ${textSub}`}>{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifState as any)[item.key]}
                    onChange={() =>
                      setNotifState(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))
                    }
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SECURITY & SESSIONS TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <h4 className={`text-sm font-extrabold ${textPri}`}>Active Login Sessions</h4>
                <div className="space-y-2">
                  {loginHistory.map((s, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className={`font-bold ${textPri}`}>{s.device}</p>
                        <p className={`text-[11px] ${textSub}`}>{s.location} · IP: {s.ip}</p>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {s.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-rose-400">Danger Zone</p>
                  <p className={`text-[11px] ${textSub}`}>Permanently delete account and registration records</p>
                </div>
                <Button variant="outline" size="sm" className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10">
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
