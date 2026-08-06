import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ThumbsUp, MessageSquare, Plus, CheckCircle2, ShieldCheck,
  Search, Filter, Award, CornerDownRight, X, Send
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  message: string;
  recommended: boolean;
  organizerReply?: {
    replyMessage: string;
    repliedAt: string;
    organizerName: string;
  } | null;
  isFeatured?: boolean;
  createdAt: string;
}

const initialReviews: Review[] = [
  {
    id: 'r1',
    eventId: 'e1',
    userId: 'u101',
    userName: 'Rohan Verma',
    rating: 5,
    title: 'Outstanding Keynotes & Practical AI Demos!',
    message: 'The AI Summit was extraordinarily well organized. The hands-on machine learning workshops and zero-trust security panels were world-class.',
    recommended: true,
    organizerReply: {
      replyMessage: 'Thank you Rohan! We are thrilled you enjoyed the hands-on AI workshops. Hope to see you next year!',
      repliedAt: '2 hours ago',
      organizerName: 'Aarav Sharma (Lead Organizer)',
    },
    isFeatured: true,
    createdAt: 'Yesterday',
  },
  {
    id: 'r2',
    eventId: 'e1',
    userId: 'u102',
    userName: 'Ananya Gupta',
    rating: 5,
    title: 'Top Tier Networking & Volunteer Management',
    message: 'Check-in via QR pass was instant! Great energy, amazing speakers, and seamless logistics.',
    recommended: true,
    organizerReply: null,
    isFeatured: true,
    createdAt: '2 days ago',
  },
  {
    id: 'r3',
    eventId: 'e1',
    userId: 'u103',
    userName: 'Vikram Joshi',
    rating: 4,
    title: 'Insightful Sessions & Great Agenda',
    message: 'Loved the LLM optimization panel. Would appreciate even more Q&A time during future sessions.',
    recommended: true,
    organizerReply: null,
    isFeatured: false,
    createdAt: '3 days ago',
  },
];

interface EventReviewsSectionProps {
  eventId: string;
}

export default function EventReviewsSection({ eventId }: EventReviewsSectionProps) {
  const { isDark } = useTheme();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterRating, setFilterRating] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recommended, setRecommended] = useState(true);

  // Reply Form State
  const [replyInput, setReplyInput] = useState('');

  const cardBg = isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const total = reviews.length;
  const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '5.0';
  const recPct = total > 0 ? Math.round((reviews.filter(r => r.recommended).length / total) * 100) : 100;

  const filtered = reviews.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.message.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === 'All' || (filterRating === '5' ? r.rating === 5 : r.rating >= 4);
    return matchSearch && matchRating;
  });

  const handleAddReview = () => {
    if (!title.trim() || !message.trim()) return;
    const newRev: Review = {
      id: `r-${Date.now()}`,
      eventId,
      userId: 'demo-user',
      userName: 'Aarav Sharma (You)',
      rating,
      title,
      message,
      recommended,
      isFeatured: rating === 5,
      createdAt: 'Just now',
    };
    setReviews(prev => [newRev, ...prev]);
    setShowAddModal(false);
    setTitle('');
    setMessage('');
  };

  const handleAddReply = (id: string) => {
    if (!replyInput.trim()) return;
    setReviews(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              organizerReply: {
                replyMessage: replyInput,
                repliedAt: 'Just now',
                organizerName: 'Aarav Sharma (Lead Organizer)',
              },
            }
          : r
      )
    );
    setReplyingReviewId(null);
    setReplyInput('');
  };

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-800/60">
      {/* Summary Rating Cards (NO GRAPHS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg} space-y-1`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Average Rating</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black ${textPri}`}>{avgRating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400' : 'opacity-30'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg} space-y-1`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Total Reviews</span>
          <h3 className={`text-2xl font-black ${textPri}`}>{total} Verified</h3>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg} space-y-1`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Recommendation Rate</span>
          <h3 className="text-2xl font-black text-emerald-400">{recPct}% Attendee Score</h3>
        </div>
      </div>

      {/* Reviews Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full sm:w-64 px-3.5 py-2 rounded-xl border text-xs font-medium outline-none ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4 text-zinc-950" />}
        >
          Write a Review
        </Button>
      </div>

      {/* Review Cards Stream */}
      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className={`p-5 rounded-2xl border ${cardBg} space-y-3`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-500/30">
                  {r.userName.charAt(0)}
                </div>
                <div>
                  <p className={`text-xs font-extrabold ${textPri}`}>{r.userName}</p>
                  <p className={`text-[10px] ${textSub}`}>{r.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {r.isFeatured && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Featured
                  </span>
                )}
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'opacity-30'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-extrabold ${textPri}`}>{r.title}</h4>
              <p className={`text-xs ${textSub} leading-relaxed mt-1`}>{r.message}</p>
            </div>

            {/* Organizer Reply Box */}
            {r.organizerReply ? (
              <div className={`p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 space-y-1 text-xs`}>
                <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  {r.organizerReply.organizerName}
                </div>
                <p className={`text-xs ${textPri}`}>{r.organizerReply.replyMessage}</p>
              </div>
            ) : (
              <button
                onClick={() => setReplyingReviewId(r.id)}
                className="text-[11px] font-bold text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" /> Reply as Organizer
              </button>
            )}

            {/* Reply Input Form */}
            {replyingReviewId === r.id && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type organizer response..."
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-xl border text-xs outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                />
                <Button variant="primary" size="sm" onClick={() => handleAddReply(r.id)}>
                  Post Reply
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border ${cardBg} p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className={`text-base font-extrabold ${textPri}`}>Write an Event Review</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Star Rating</label>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'opacity-30'}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. World-Class Keynotes & Workshops"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                />
              </div>

              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Detailed Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Describe your event experience..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleAddReview} leftIcon={<Send className="w-4 h-4 text-zinc-950" />}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
