import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Trash2, Copy, Check, Download, History } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import {
  getAIHistory,
  toggleFavoriteAIHistory,
  deleteAIHistoryRecord,
  AIHistoryRecord
} from '../../services/aiApi';

export default function AIHistoryPanel() {
  const { isDark } = useTheme();
  const [history, setHistory] = useState<AIHistoryRecord[]>(getAIHistory());
  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleFav = (id: string) => {
    setHistory(toggleFavoriteAIHistory(id));
  };

  const handleDelete = (id: string) => {
    setHistory(deleteAIHistoryRecord(id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `anjaneya_ai_history_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const filtered = history.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    const matchFav = filterFav ? item.isFavorite : true;
    return matchSearch && matchFav;
  });

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-4">
      {/* Search & Export header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textMut}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past AI prompts & generations..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterFav ? 'primary' : 'outline'}
            size="sm"
            leftIcon={<Star className={`w-3.5 h-3.5 ${filterFav ? 'fill-zinc-950' : ''}`} />}
            onClick={() => setFilterFav(!filterFav)}
          >
            {filterFav ? 'Starred Only' : 'Filter Starred'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJSON}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* History Items */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<History className="w-6 h-6 text-amber-500" />}
          title="No AI History Records"
          description={search ? `No records found matching "${search}".` : 'Your AI prompt history will be saved here automatically.'}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`p-4 rounded-xl border ${cardBg} space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber">{item.type}</Badge>
                    <h4 className={`text-xs font-bold ${textPri}`}>{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFav(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.isFavorite ? 'text-amber-500' : textMut
                      }`}
                      title={item.isFavorite ? 'Unstar' : 'Star'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, item.output)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textMut} hover:${textPri}`}
                      title="Copy output"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className={`text-xs font-medium ${textMut}`}>
                  Prompt: <span className={textPri}>"{item.prompt}"</span>
                </p>

                <div className={`p-3 rounded-lg text-xs leading-relaxed ${isDark ? 'bg-zinc-950/70 text-zinc-300 border border-zinc-800/80' : 'bg-zinc-50 text-zinc-700 border border-zinc-200'}`}>
                  {item.output}
                </div>

                <div className={`text-[10px] text-right ${textMut}`}>
                  {item.timestamp}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
