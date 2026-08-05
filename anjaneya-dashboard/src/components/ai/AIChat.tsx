import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Trash2,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Check,
  Sparkles,
  User,
  Calendar,
  HelpCircle,
  Award,
  MapPin,
  Clock,
  ListTodo,
  Settings
} from 'lucide-react';
import { askAIAssistant, ChatMessage } from '../../services/aiApi';
import AIConfigModal from './AIConfigModal';

interface AIChatProps {
  onClose: () => void;
}

const suggestedQuestions = [
  { label: 'What events are happening today?', icon: Calendar },
  { label: 'Show hackathons this week.', icon: Sparkles },
  { label: 'Recommend an event for me.', icon: Award },
  { label: 'How do I register?', icon: HelpCircle },
  { label: 'How do I become a volunteer?', icon: User },
  { label: 'Show my assigned tasks.', icon: ListTodo },
  { label: 'When is my next event?', icon: Clock },
  { label: 'Where is the venue?', icon: MapPin },
];

export default function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: '👋 Hi! I am **Anjaneya AI**, your intelligent Event & Volunteer assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const responseText = await askAIAssistant(newHistory);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Conversation cleared! How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Markdown Renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;

      if (content.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-purple-200 mt-2 mb-1">
            {content.replace('### ', '')}
          </h4>
        );
      }

      const isBullet = content.trim().startsWith('- ') || content.trim().startsWith('* ');
      if (isBullet) {
        content = content.replace(/^[-*]\s+/, '');
      }

      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-0.5 text-slate-200">
            <span className="text-purple-400 mt-1">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 text-slate-200 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`fixed z-50 flex flex-col bg-slate-900/95 border border-purple-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'inset-4 sm:inset-10 w-auto h-auto'
            : 'bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[440px] h-[600px] max-h-[82vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Anjaneya AI</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  Assistant
                </span>
              </div>
              <p className="text-xs text-slate-400">Connected to Real LLM Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfig(true)}
              title="LLM API Settings"
              className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              title="Clear Chat"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Minimize' : 'Maximize'}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
          {suggestedQuestions.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(q.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-200 transition-all whitespace-nowrap cursor-pointer"
              >
                <Icon className="w-3 h-3 text-purple-400" />
                <span>{q.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`group relative max-w-[85%] p-3.5 rounded-2xl shadow-lg border transition-all ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/30 rounded-br-none'
                    : 'bg-gradient-to-br from-white/10 to-white/[0.03] text-slate-200 border-white/10 backdrop-blur-md rounded-bl-none'
                }`}
              >
                {renderMarkdown(msg.text)}

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 w-24">
              <Bot className="w-4 h-4 text-purple-400 animate-spin" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about events, tasks, recommendations..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfig && <AIConfigModal onClose={() => setShowConfig(false)} />}
      </AnimatePresence>
    </>
  );
}
