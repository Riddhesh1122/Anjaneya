import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, X, Copy, Check, Save, Mail, Award, UserCheck, HelpCircle,
  FileText, Clock, Megaphone, ShieldAlert, Calendar, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  generateEventDescription,
  assignBestVolunteer,
  generateCertificateText,
  generateAIEmail,
  generateEventFAQs,
  generateEventSchedule,
  generateEventAnnouncement,
  generateEventSummary,
  saveAIHistoryRecord,
  EventGeneratedData,
  VolunteerMatchResult,
  CertificateText,
  GeneratedEmail,
  AIScheduleItem,
  AISummaryResult
} from '../../services/aiApi';

export type GeneratorMode =
  | 'event'
  | 'volunteer'
  | 'email'
  | 'announcement'
  | 'schedule'
  | 'faq'
  | 'summary'
  | 'certificate';

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
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<GeneratorMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // States
  const [eventInput, setEventInput] = useState({ name: 'AI Innovations Summit 2026', category: 'Technology & Artificial Intelligence', audience: 'Software Engineers & AI Enthusiasts', goal: 'Demonstrate cutting-edge generative AI deployment' });
  const [generatedEvent, setGeneratedEvent] = useState<EventGeneratedData | null>(null);

  const [volunteerInput, setVolunteerInput] = useState({ skills: 'Event Management, React, Technical Support', availability: 'Weekend Evenings', experience: 'Intermediate', taskPriority: 'High' as const });
  const [volunteerResult, setVolunteerResult] = useState<VolunteerMatchResult | null>(null);

  const [emailInput, setEmailInput] = useState({ type: 'registration_confirmation' as const, recipientName: 'Alex Mercer', eventName: 'AI Summit 2026', details: 'VIP Pass with early stage access' });
  const [emailResult, setEmailResult] = useState<GeneratedEmail | null>(null);

  const [announcementInput, setAnnouncementInput] = useState({ eventName: 'Global Hackathon 2026', announcementType: 'starting' as const, notes: 'Main auditorium opening at 9:00 AM sharp' });
  const [announcementResult, setAnnouncementResult] = useState<{ title: string; body: string; priority: 'High' | 'Medium' | 'Normal' } | null>(null);

  const [scheduleInput, setScheduleInput] = useState({ eventName: 'Cyber Security Workshop', durationHours: 6, speakersCount: 4, hasBreak: true });
  const [scheduleResult, setScheduleResult] = useState<AIScheduleItem[] | null>(null);

  const [faqInput, setFaqInput] = useState({ eventName: 'Web3 & Cloud Summit', category: 'Cloud Architecture', description: 'A 2-day conference on decentralized compute' });
  const [faqResult, setFaqResult] = useState<{ question: string; answer: string }[] | null>(null);

  const [summaryInput, setSummaryInput] = useState({ eventName: 'AI Hackathon & Sprint', category: 'Artificial Intelligence', targetAudience: 'University Developers' });
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null);

  const [certInput, setCertInput] = useState({ recipientName: 'Samantha Reed', eventName: 'Global Hackathon 2026', role: 'Lead Mentor', contribution: 'Guided 15 developer teams in cloud AI solutions' });
  const [certResult, setCertResult] = useState<CertificateText | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);

    try {
      if (activeTab === 'event') {
        const res = await generateEventDescription(eventInput);
        setGeneratedEvent(res);
        saveAIHistoryRecord({ type: 'Event Description', title: eventInput.name, prompt: eventInput.goal, output: res.description });
      } else if (activeTab === 'volunteer') {
        const res = await assignBestVolunteer({ volunteerSkills: volunteerInput.skills.split(',').map(s => s.trim()), availability: volunteerInput.availability, experience: volunteerInput.experience, taskPriority: volunteerInput.taskPriority });
        setVolunteerResult(res);
        saveAIHistoryRecord({ type: 'Volunteer Match', title: res.bestVolunteer.name, prompt: volunteerInput.skills, output: `${res.confidenceScore}% match: ${res.reason}` });
      } else if (activeTab === 'email') {
        const res = await generateAIEmail(emailInput);
        setEmailResult(res);
        saveAIHistoryRecord({ type: 'Email Draft', title: res.subject, prompt: emailInput.details, output: res.body });
      } else if (activeTab === 'announcement') {
        const res = await generateEventAnnouncement(announcementInput);
        setAnnouncementResult(res);
        saveAIHistoryRecord({ type: 'Announcement', title: res.title, prompt: announcementInput.notes, output: res.body });
      } else if (activeTab === 'schedule') {
        const res = await generateEventSchedule(scheduleInput);
        setScheduleResult(res);
        saveAIHistoryRecord({ type: 'Schedule', title: scheduleInput.eventName, prompt: `${scheduleInput.durationHours} hrs schedule`, output: `${res.length} sessions generated` });
      } else if (activeTab === 'faq') {
        const res = await generateEventFAQs(faqInput);
        setFaqResult(res);
        saveAIHistoryRecord({ type: 'FAQ List', title: faqInput.eventName, prompt: faqInput.description, output: `${res.length} FAQs generated` });
      } else if (activeTab === 'summary') {
        const res = await generateEventSummary(summaryInput);
        setSummaryResult(res);
        saveAIHistoryRecord({ type: 'Risk Summary', title: summaryInput.eventName, prompt: summaryInput.category, output: res.overview });
      } else if (activeTab === 'certificate') {
        const res = await generateCertificateText(certInput);
        setCertResult(res);
        saveAIHistoryRecord({ type: 'Certificate', title: certInput.recipientName, prompt: certInput.contribution, output: res.bodyText });
      }
    } catch (e) {
      console.error('AI Generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'event', label: 'Event Description', icon: FileText },
    { id: 'volunteer', label: 'Volunteer Matcher', icon: UserCheck },
    { id: 'email', label: 'Email Writer', icon: Mail },
    { id: 'announcement', label: 'Announcement', icon: Megaphone },
    { id: 'schedule', label: 'Schedule Planner', icon: Clock },
    { id: 'faq', label: 'Smart FAQs', icon: HelpCircle },
    { id: 'summary', label: 'Risk Summary', icon: ShieldAlert },
    { id: 'certificate', label: 'Certificate', icon: Award },
  ] as const;

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-generator-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-4xl rounded-2xl border ${cardBg} my-8 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 shadow-sm shadow-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="ai-generator-modal-title" className={`text-base font-extrabold ${textPri}`}>Anjaneya AI Generator Studio</h3>
              <p className={`text-xs font-medium ${textMut}`}>Select an AI Copilot generator tool below</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Generator Studio"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textMut} hover:${textPri}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`px-6 pt-3 flex items-center gap-1.5 overflow-x-auto border-b ${isDark ? 'border-zinc-800/80' : 'border-zinc-100'} scrollbar-none`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as GeneratorMode)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                    : `border-transparent ${textMut} hover:${textPri}`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form & Output Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. EVENT DESCRIPTION */}
          {activeTab === 'event' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Event Name" value={eventInput.name} onChange={e => setEventInput({ ...eventInput, name: e.target.value })} />
              <Input label="Category" value={eventInput.category} onChange={e => setEventInput({ ...eventInput, category: e.target.value })} />
              <Input label="Target Audience" value={eventInput.audience} onChange={e => setEventInput({ ...eventInput, audience: e.target.value })} />
              <Input label="Goal / Objective" value={eventInput.goal} onChange={e => setEventInput({ ...eventInput, goal: e.target.value })} />
            </div>
          )}

          {/* 2. VOLUNTEER MATCHER */}
          {activeTab === 'volunteer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Required Skills (comma separated)" value={volunteerInput.skills} onChange={e => setVolunteerInput({ ...volunteerInput, skills: e.target.value })} />
              <Input label="Availability" value={volunteerInput.availability} onChange={e => setVolunteerInput({ ...volunteerInput, availability: e.target.value })} />
              <Input label="Experience Level" value={volunteerInput.experience} onChange={e => setVolunteerInput({ ...volunteerInput, experience: e.target.value })} />
            </div>
          )}

          {/* 3. EMAIL WRITER */}
          {activeTab === 'email' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Event Name" value={emailInput.eventName} onChange={e => setEmailInput({ ...emailInput, eventName: e.target.value })} />
              <Input label="Recipient Name" value={emailInput.recipientName} onChange={e => setEmailInput({ ...emailInput, recipientName: e.target.value })} />
              <Input label="Custom Details" value={emailInput.details} onChange={e => setEmailInput({ ...emailInput, details: e.target.value })} />
            </div>
          )}

          {/* 4. ANNOUNCEMENT */}
          {activeTab === 'announcement' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Event Name" value={announcementInput.eventName} onChange={e => setAnnouncementInput({ ...announcementInput, eventName: e.target.value })} />
              <Input label="Additional Notes" value={announcementInput.notes} onChange={e => setAnnouncementInput({ ...announcementInput, notes: e.target.value })} />
            </div>
          )}

          {/* 5. SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Event Name" value={scheduleInput.eventName} onChange={e => setScheduleInput({ ...scheduleInput, eventName: e.target.value })} />
              <Input label="Duration (Hours)" type="number" value={scheduleInput.durationHours} onChange={e => setScheduleInput({ ...scheduleInput, durationHours: Number(e.target.value) })} />
              <Input label="Speakers Count" type="number" value={scheduleInput.speakersCount} onChange={e => setScheduleInput({ ...scheduleInput, speakersCount: Number(e.target.value) })} />
            </div>
          )}

          {/* 6. FAQ */}
          {activeTab === 'faq' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Event Name" value={faqInput.eventName} onChange={e => setFaqInput({ ...faqInput, eventName: e.target.value })} />
              <Input label="Category" value={faqInput.category} onChange={e => setFaqInput({ ...faqInput, category: e.target.value })} />
            </div>
          )}

          {/* 7. SUMMARY */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Event Name" value={summaryInput.eventName} onChange={e => setSummaryInput({ ...summaryInput, eventName: e.target.value })} />
              <Input label="Target Audience" value={summaryInput.targetAudience} onChange={e => setSummaryInput({ ...summaryInput, targetAudience: e.target.value })} />
            </div>
          )}

          {/* 8. CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Recipient Name" value={certInput.recipientName} onChange={e => setCertInput({ ...certInput, recipientName: e.target.value })} />
              <Input label="Role" value={certInput.role} onChange={e => setCertInput({ ...certInput, role: e.target.value })} />
              <Input label="Contribution" value={certInput.contribution} onChange={e => setCertInput({ ...certInput, contribution: e.target.value })} />
            </div>
          )}

          <div className="flex justify-end gap-2">
            {activeTab === 'event' && (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (onSaveEventData) {
                    onSaveEventData({
                      description: eventInput.goal || 'Directly created event.',
                      title: eventInput.name,
                      category: eventInput.category,
                    } as any);
                  }
                  onClose();
                }}
                leftIcon={<Save className="w-4 h-4 text-amber-500" />}
              >
                Quick Create & Publish
              </Button>
            )}
            <Button variant="primary" size="md" isLoading={loading} onClick={handleGenerate} leftIcon={<Sparkles className="w-4 h-4 text-zinc-950" />}>
              Generate with AI
            </Button>
          </div>

          {/* OUTPUT RESULTS */}
          {generatedEvent && activeTab === 'event' && (
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-3`}>
              <div className="flex justify-between items-center">
                <Badge variant="amber">AI Generated Event</Badge>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedEvent.description)} leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (onSaveEventData) {
                        onSaveEventData({
                          ...generatedEvent,
                          title: eventInput.name,
                          category: eventInput.category,
                        } as any);
                      }
                      onClose();
                    }}
                    leftIcon={<Save className="w-3.5 h-3.5 text-zinc-950" />}
                  >
                    Save & Publish Event
                  </Button>
                </div>
              </div>
              <h4 className={`text-sm font-bold ${textPri}`}>{eventInput.name}</h4>
              <p className={`text-xs leading-relaxed ${textPri}`}>{generatedEvent.description}</p>
            </div>
          )}

          {volunteerResult && activeTab === 'volunteer' && (
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-3`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${textPri}`}>{volunteerResult.bestVolunteer.name}</span>
                <Badge variant="indigo">{volunteerResult.confidenceScore}% Match</Badge>
              </div>
              <p className={`text-xs ${textMut}`}>{volunteerResult.reason}</p>
            </div>
          )}

          {emailResult && activeTab === 'email' && (
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-3`}>
              <h4 className={`text-xs font-bold ${textPri}`}>{emailResult.subject}</h4>
              <p className={`text-xs leading-relaxed whitespace-pre-line ${textMut}`}>{emailResult.body}</p>
            </div>
          )}

          {announcementResult && activeTab === 'announcement' && (
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-3`}>
              <div className="flex justify-between items-center">
                <h4 className={`text-xs font-bold ${textPri}`}>{announcementResult.title}</h4>
                <Badge variant="rose">{announcementResult.priority}</Badge>
              </div>
              <p className={`text-xs ${textMut}`}>{announcementResult.body}</p>
            </div>
          )}

          {scheduleResult && activeTab === 'schedule' && (
            <div className="space-y-2">
              {scheduleResult.map((s, i) => (
                <div key={i} className={`p-3 rounded-lg border flex items-center justify-between text-xs ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <span className="font-mono font-bold text-amber-500">{s.time}</span>
                  <span className={`font-semibold ${textPri}`}>{s.sessionTitle}</span>
                  <Badge variant="zinc">{s.type}</Badge>
                </div>
              ))}
            </div>
          )}

          {faqResult && activeTab === 'faq' && (
            <div className="space-y-2">
              {faqResult.map((faq, i) => (
                <div key={i} className={`p-3 rounded-lg border text-xs space-y-1 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className={`font-bold ${textPri}`}>Q: {faq.question}</p>
                  <p className={textMut}>A: {faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {summaryResult && activeTab === 'summary' && (
            <div className={`p-5 rounded-xl border space-y-3 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <p className={`text-xs ${textPri}`}>{summaryResult.overview}</p>
              <div className="space-y-1">
                <p className={`text-xs font-bold ${textPri}`}>Risk Mitigations:</p>
                {summaryResult.riskAnalysis.map((r, i) => (
                  <p key={i} className={`text-xs ${textMut}`}>• {r.risk} ({r.severity}): {r.mitigation}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
