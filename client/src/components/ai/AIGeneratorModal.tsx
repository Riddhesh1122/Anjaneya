import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Edit3,
  Save,
  Mail,
  Award,
  UserCheck,
  HelpCircle,
  FileText,
  Loader2,
  Calendar,
  CheckCircle2,
  Users
} from 'lucide-react';
import {
  generateEventDescription,
  assignBestVolunteer,
  generateCertificateText,
  generateAIEmail,
  generateEventFAQs,
  EventGeneratedData,
  VolunteerMatchResult,
  CertificateText,
  GeneratedEmail
} from '../../services/aiApi';

export type GeneratorMode =
  | 'event'
  | 'volunteer'
  | 'certificate'
  | 'email'
  | 'faq';

interface AIGeneratorModalProps {
  initialMode?: GeneratorMode;
  onClose: () => void;
  onSaveEventData?: (data: EventGeneratedData) => void;
}

export default function AIGeneratorModal({
  initialMode = 'event',
  onClose,
  onSaveEventData,
}: AIGeneratorModalProps) {
  const [activeTab, setActiveTab] = useState<GeneratorMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Event Description State
  const [eventInput, setEventInput] = useState({
    name: 'AI Innovations Summit 2026',
    category: 'Technology & Artificial Intelligence',
    audience: 'Software Engineers, Data Scientists, and AI Enthusiasts',
    goal: 'Demonstrate cutting-edge generative AI deployment and foster developer networking',
  });
  const [generatedEvent, setGeneratedEvent] = useState<EventGeneratedData | null>(null);

  // 2. Volunteer Matching State
  const [volunteerInput, setVolunteerInput] = useState({
    skills: 'Event Management, React, Technical Support',
    availability: 'Weekend Evenings',
    experience: 'Intermediate',
    taskPriority: 'High' as 'High' | 'Medium' | 'Low',
  });
  const [volunteerResult, setVolunteerResult] = useState<VolunteerMatchResult | null>(null);

  // 3. Certificate Writer State
  const [certInput, setCertInput] = useState({
    recipientName: 'Samantha Reed',
    eventName: 'Global Hackathon 2026',
    role: 'Lead Mentor',
    contribution: 'Guided 15 developer teams in building scalable cloud AI solutions',
  });
  const [certResult, setCertResult] = useState<CertificateText | null>(null);

  // 4. Email Generator State
  const [emailInput, setEmailInput] = useState({
    type: 'registration_confirmation' as 'registration_confirmation' | 'reminder' | 'volunteer_invitation' | 'thank_you' | 'winner_announcement',
    recipientName: 'Alex Mercer',
    eventName: 'AI Summit 2026',
    details: 'VIP Pass with early stage access',
  });
  const [emailResult, setEmailResult] = useState<GeneratedEmail | null>(null);

  // 5. FAQ Generator State
  const [faqInput, setFaqInput] = useState({
    eventName: 'Web3 & Cloud Summit',
    category: 'Cloud Architecture',
    description: 'A 2-day conference on decentralized compute and cloud security',
  });
  const [faqResult, setFaqResult] = useState<{ question: string; answer: string }[] | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handlers
  const handleGenerateEvent = async () => {
    setLoading(true);
    try {
      const res = await generateEventDescription(eventInput);
      setGeneratedEvent(res);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchVolunteer = async () => {
    setLoading(true);
    try {
      const res = await assignBestVolunteer({
        volunteerSkills: volunteerInput.skills.split(',').map((s) => s.trim()),
        availability: volunteerInput.availability,
        experience: volunteerInput.experience,
        taskPriority: volunteerInput.taskPriority,
      });
      setVolunteerResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCert = async () => {
    setLoading(true);
    try {
      const res = await generateCertificateText(certInput);
      setCertResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    setLoading(true);
    try {
      const res = await generateAIEmail(emailInput);
      setEmailResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFaqs = async () => {
    setLoading(true);
    try {
      const res = await generateEventFAQs(faqInput);
      setFaqResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Anjaneya AI Generator Studio</h3>
              <p className="text-xs text-slate-400">Generate event content, email sequences, certificates & volunteer matches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-white/[0.02] border-b border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'event', label: 'Event Description', icon: FileText },
            { id: 'volunteer', label: 'Volunteer Matching', icon: UserCheck },
            { id: 'certificate', label: 'Certificate Writer', icon: Award },
            { id: 'email', label: 'Email Generator', icon: Mail },
            { id: 'faq', label: 'Smart FAQs', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as GeneratorMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: EVENT DESCRIPTION GENERATOR */}
          {activeTab === 'event' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Inputs */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Event Generator Parameters
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventInput.name}
                    onChange={(e) => setEventInput({ ...eventInput, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={eventInput.category}
                    onChange={(e) => setEventInput({ ...eventInput, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={eventInput.audience}
                    onChange={(e) => setEventInput({ ...eventInput, audience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Goal</label>
                  <textarea
                    rows={2}
                    value={eventInput.goal}
                    onChange={(e) => setEventInput({ ...eventInput, goal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleGenerateEvent}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25 hover:opacity-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>✨ Generate with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                {generatedEvent ? (
                  <div className="space-y-4 text-xs overflow-y-auto max-h-[420px] pr-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-bold text-purple-300 text-sm">Generated Event Blueprint</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(generatedEvent, null, 2))}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-white mb-1">Description (Editable)</h5>
                      <textarea
                        rows={4}
                        value={generatedEvent.description}
                        onChange={(e) => setGeneratedEvent({ ...generatedEvent, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <h5 className="font-semibold text-white mb-1">Event Agenda</h5>
                      <ul className="space-y-1 text-slate-300">
                        {generatedEvent.agenda.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-white mb-1">Rules & Guidelines</h5>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {generatedEvent.rules.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {onSaveEventData && (
                      <button
                        onClick={() => {
                          onSaveEventData(generatedEvent);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save to Event Draft</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                    <Sparkles className="w-10 h-10 text-purple-400/40 mb-2 animate-pulse" />
                    <p className="text-xs">Fill parameters and click ✨ Generate with AI to preview full event content.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VOLUNTEER ASSIGNMENT */}
          {activeTab === 'volunteer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-purple-300">AI Smart Volunteer Allocator</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Required Volunteer Skills</label>
                  <input
                    type="text"
                    value={volunteerInput.skills}
                    onChange={(e) => setVolunteerInput({ ...volunteerInput, skills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Availability Needed</label>
                  <input
                    type="text"
                    value={volunteerInput.availability}
                    onChange={(e) => setVolunteerInput({ ...volunteerInput, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Task Priority Level</label>
                  <select
                    value={volunteerInput.taskPriority}
                    onChange={(e) => setVolunteerInput({ ...volunteerInput, taskPriority: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <button
                  onClick={handleMatchVolunteer}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Find Best Volunteer Match</span>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                {volunteerResult ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">Best Volunteer Match</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px]">
                          {volunteerResult.confidenceScore}% Confidence Score
                        </span>
                      </div>
                      <p className="font-semibold text-emerald-300 text-base">{volunteerResult.bestVolunteer.name}</p>
                      <p className="text-slate-300 mt-1">{volunteerResult.bestVolunteer.email}</p>
                      <p className="text-slate-200 mt-2 font-medium">💡 Reason: {volunteerResult.reason}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-white mb-2">Alternative Qualified Candidates:</h5>
                      <div className="space-y-2">
                        {volunteerResult.alternativeVolunteers.map((alt, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-purple-300">{alt.name}</p>
                              <p className="text-[11px] text-slate-400">{alt.reason}</p>
                            </div>
                            <span className="text-xs font-bold text-indigo-400">{alt.fitScore}% Fit</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                    <UserCheck className="w-10 h-10 text-purple-400/40 mb-2" />
                    <p className="text-xs">Click Find Best Volunteer Match to calculate AI confidence scores.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATE WRITER */}
          {activeTab === 'certificate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-purple-300">AI Certificate Text Generator</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={certInput.recipientName}
                    onChange={(e) => setCertInput({ ...certInput, recipientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={certInput.eventName}
                    onChange={(e) => setCertInput({ ...certInput, eventName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={certInput.role}
                    onChange={(e) => setCertInput({ ...certInput, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Specific Contribution</label>
                  <textarea
                    rows={2}
                    value={certInput.contribution}
                    onChange={(e) => setCertInput({ ...certInput, contribution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleGenerateCert}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Write Certificate Wording</span>}
                </button>
              </div>

              {/* Certificate Preview Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                {certResult ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/60 border-2 border-purple-500/30 text-center space-y-4 shadow-2xl">
                    <Award className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                    <h4 className="text-lg font-bold text-amber-300 uppercase tracking-widest">{certResult.title}</h4>
                    <p className="text-xs text-slate-300 italic max-w-md mx-auto leading-relaxed">
                      "{certResult.appreciationText}"
                    </p>
                    <p className="text-xs text-purple-300 font-semibold">{certResult.quote}</p>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Date: {certResult.date}</span>
                      <button
                        onClick={() => copyToClipboard(certResult.appreciationText)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Wording</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                    <Award className="w-10 h-10 text-purple-400/40 mb-2" />
                    <p className="text-xs">Click Write Certificate Wording to generate custom appreciation text.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EMAIL GENERATOR */}
          {activeTab === 'email' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-purple-300">AI Event Email Generator</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Category</label>
                  <select
                    value={emailInput.type}
                    onChange={(e) => setEmailInput({ ...emailInput, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  >
                    <option value="registration_confirmation">Registration Confirmation</option>
                    <option value="reminder">Reminder Email</option>
                    <option value="volunteer_invitation">Volunteer Invitation</option>
                    <option value="thank_you">Thank You Email</option>
                    <option value="winner_announcement">Winner Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={emailInput.recipientName}
                    onChange={(e) => setEmailInput({ ...emailInput, recipientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={emailInput.eventName}
                    onChange={(e) => setEmailInput({ ...emailInput, eventName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleGenerateEmail}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Draft Email Template</span>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                {emailResult ? (
                  <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-purple-300">Generated Email Copy</span>
                        <button
                          onClick={() => copyToClipboard(`Subject: ${emailResult.subject}\n\n${emailResult.body}`)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Email</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 mb-3">
                        <span className="text-slate-400 font-medium">Subject:</span>
                        <p className="font-semibold text-white text-xs mt-0.5">{emailResult.subject}</p>
                      </div>

                      <textarea
                        rows={10}
                        value={emailResult.body}
                        onChange={(e) => setEmailResult({ ...emailResult, body: e.target.value })}
                        className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                    <Mail className="w-10 h-10 text-purple-400/40 mb-2" />
                    <p className="text-xs">Select email category & click Draft Email Template.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FAQ GENERATOR */}
          {activeTab === 'faq' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-purple-300">AI Automatic FAQ Builder</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={faqInput.eventName}
                    onChange={(e) => setFaqInput({ ...faqInput, eventName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Event Category</label>
                  <input
                    type="text"
                    value={faqInput.category}
                    onChange={(e) => setFaqInput({ ...faqInput, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Description Brief</label>
                  <textarea
                    rows={3}
                    value={faqInput.description}
                    onChange={(e) => setFaqInput({ ...faqInput, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleGenerateFaqs}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Auto-Generate FAQs</span>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                {faqResult ? (
                  <div className="space-y-3 text-xs overflow-y-auto max-h-[380px] pr-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-300">Generated FAQ List</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(faqResult, null, 2))}
                        className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy JSON</span>
                      </button>
                    </div>
                    {faqResult.map((faq, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                        <p className="font-bold text-white">Q: {faq.question}</p>
                        <p className="text-slate-300 leading-relaxed">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                    <HelpCircle className="w-10 h-10 text-purple-400/40 mb-2" />
                    <p className="text-xs">Click Auto-Generate FAQs to produce instant question & answer sets.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
