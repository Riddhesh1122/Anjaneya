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
  Settings,
  Square,
  History,
  Plus,
  Search
} from 'lucide-react';
import {
  streamAIAssistant,
  ChatMessage,
  ChatSession,
  getChatSessions,
  saveChatSession,
  deleteChatSession
} from '../../services/aiApi';
import AIConfigModal from './AIConfigModal';

interface AIChatProps {
  onClose: () => void;
}

const suggestedQuestions = [
  { label: 'What events are happening today?', icon: Calendar },
  { label: 'Show hackathons this week.', icon: Sparkles },
  { label: 'Recommend an event for me.', icon: Award },
  { label: 'How do I register for events?', icon: HelpCircle },
  { label: 'How do I become a volunteer?', icon: User },
  { label: 'Show my assigned tasks.', icon: ListTodo },
  { label: 'When is my next event?', icon: Clock },
  { label: 'Where is the event venue?', icon: MapPin },
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
  const [showHistory, setShowHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setChatSessions(getChatSessions());
  }, []);

  // Save conversation session automatically
  useEffect(() => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || 'AI Event Assistant Chat';
      const sessionTitle = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;
      const updated = saveChatSession({
        id: currentSessionId,
        title: sessionTitle,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages,
      });
      setChatSessions(updated);
    }
  }, [messages, currentSessionId]);

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '▌',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, assistantMsg]);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamAIAssistant(
        updatedHistory,
        (chunkText) => {
          setMessages(prev =>
            prev.map(m => (m.id === assistantMsgId ? { ...m, text: chunkText + '▌' } : m))
          );
        },
        controller.signal
      );
    } catch (e) {
      console.error(e);
    } finally {
      setMessages(prev =>
        prev.map(m => (m.id === assistantMsgId ? { ...m, text: m.text.replace(/▌$/, '') } : m))
      );
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: '👋 New conversation started! How can **Anjaneya AI** assist your event planning today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowHistory(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updated = deleteChatSession(sessionId);
    setChatSessions(updated);
    if (sessionId === currentSessionId) {
      handleNewChat();
    }
  };

  // Markdown Renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;

      if (content.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-amber-400 mt-2 mb-1">
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
            <strong key={pIdx} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-0.5 text-zinc-200">
            <span className="text-amber-500 mt-1">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 text-zinc-200 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  const filteredSessions = chatSessions.filter(s =>
    s.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`fixed z-50 flex flex-col bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'inset-4 sm:inset-10 w-auto h-auto'
            : 'bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[450px] h-[620px] max-h-[85vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20 font-black">
              <Bot className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Anjaneya AI</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  Real-Time Copilot
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Multi-LLM · Database Integrated</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              title="Chat History"
              aria-label="Toggle conversation history"
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={handleNewChat}
              title="New Chat"
              aria-label="Start new chat"
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfig(true)}
              title="LLM Settings"
              aria-label="LLM Settings"
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Minimize' : 'Maximize'}
              aria-label="Toggle modal size"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer hidden sm:block"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close"
              aria-label="Close chat modal"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History Sidebar Drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-900 border-b border-zinc-800 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-zinc-200 uppercase tracking-wider">Past Conversations</span>
                <button
                  onClick={handleNewChat}
                  className="text-xs text-amber-500 font-bold hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Start New Chat
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  placeholder="Search past conversations..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {filteredSessions.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-3">No chat history found</p>
                ) : (
                  filteredSessions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        s.id === currentSessionId ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400' : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <span className="truncate flex-1 font-medium">{s.title}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[10px] text-zinc-500">{s.updatedAt}</span>
                        <button
                          onClick={e => handleDeleteSession(e, s.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Delete session"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Quick Question Chips */}
        <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {suggestedQuestions.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(q.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-amber-500/20 border border-zinc-700/80 hover:border-amber-500/40 text-xs text-zinc-300 hover:text-amber-400 transition-all whitespace-nowrap cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
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
              <div className="flex items-start gap-2.5 max-w-[90%]">
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 text-xs font-black flex-shrink-0 mt-1 shadow-sm shadow-amber-500/20">
                    A
                  </div>
                )}
                
                <div
                  className={`group relative p-4 rounded-2xl shadow-lg border transition-all ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-zinc-950 font-semibold border-amber-400 rounded-br-none'
                      : 'bg-zinc-900 text-zinc-100 border-zinc-800 backdrop-blur-md rounded-bl-none'
                  }`}
                >
                  {renderMarkdown(msg.text)}

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
              </div>

              <span className="text-[10px] text-zinc-500 mt-1 px-1 font-medium">{msg.timestamp}</span>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* Input & Stop Streaming Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about events, tasks, recommendations..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          
          {isTyping ? (
            <motion.button
              type="button"
              onClick={handleStopStream}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Stop generating"
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5 text-xs font-bold"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim()}
              aria-label="Send message to AI assistant"
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-amber-500/25 font-bold"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          )}
        </form>
      </motion.div>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfig && <AIConfigModal onClose={() => setShowConfig(false)} />}
      </AnimatePresence>
    </>
  );
}
