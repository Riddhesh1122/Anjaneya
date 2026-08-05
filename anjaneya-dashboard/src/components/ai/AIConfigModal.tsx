import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  X,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Check
} from 'lucide-react';
import {
  getAIConfig,
  saveAIConfig,
  testLLMConnection,
  AIConfig,
  AIProvider
} from '../../services/aiApi';

interface AIConfigModalProps {
  onClose: () => void;
}

export default function AIConfigModal({ onClose }: AIConfigModalProps) {
  const [config, setConfig] = useState<AIConfig>({
    provider: 'pollinations',
    apiKey: '',
    model: 'openai',
  });
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setConfig(getAIConfig());
  }, []);

  const handleProviderChange = (prov: AIProvider) => {
    let defaultModel = 'openai';
    if (prov === 'openai') defaultModel = 'gpt-3.5-turbo';
    if (prov === 'gemini') defaultModel = 'gemini-1.5-flash';
    if (prov === 'groq') defaultModel = 'llama-3.3-70b-versatile';
    if (prov === 'openrouter') defaultModel = 'openai/gpt-3.5-turbo';

    setConfig((prev) => ({
      ...prev,
      provider: prov,
      model: defaultModel,
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testLLMConnection(config);
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveAIConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">LLM Provider & API Settings</h3>
              <p className="text-xs text-slate-400">Connect Anjaneya AI to real LLM engines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Provider Selection */}
          <div>
            <label className="font-semibold text-slate-200 block mb-2">Select Active AI Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'pollinations', label: 'Free Engine', desc: 'No Key Req.' },
                { id: 'openai', label: 'OpenAI', desc: 'GPT-3.5 / GPT-4o' },
                { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 1.5' },
                { id: 'groq', label: 'Groq LLMs', desc: 'Llama 3.3 Ultra Fast' },
                { id: 'openrouter', label: 'OpenRouter', desc: 'Multi-Model API' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => handleProviderChange(prov.id as AIProvider)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    config.provider === prov.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-white ring-2 ring-purple-500/30'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-xs">{prov.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{prov.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key input if not pollinations */}
          {config.provider !== 'pollinations' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>{config.provider.toUpperCase()} API Key</span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder={`Enter your ${config.provider} API key...`}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Key is saved securely in your local browser session.</p>
            </div>
          )}

          {/* Model Name Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block">Model Target</label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Test Result Display Box */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-bold">{testResult.success ? 'Connection Successful!' : 'Connection Failed'}</p>
                <p className="text-[11px] opacity-90 mt-0.5">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
