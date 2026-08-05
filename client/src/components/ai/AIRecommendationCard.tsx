import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { RecommendedEvent } from '../../services/aiApi';

interface AIRecommendationCardProps {
  event: RecommendedEvent;
  onRegister?: (eventId: string) => void;
}

export default function AIRecommendationCard({ event, onRegister }: AIRecommendationCardProps) {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered(true);
    if (onRegister) onRegister(event.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative rounded-3xl bg-gradient-to-br from-white/10 via-white/[0.03] to-purple-950/20 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden group"
    >
      {/* Glow highlight background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />

      <div>
        {/* Header: Match Tag & Category */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{event.matchPercent}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {event.title}
        </h3>

        {/* AI "Why Recommended" Box */}
        <div className="mb-4 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
          <p className="font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Why AI Recommended:
          </p>
          <p className="text-slate-300 leading-relaxed">{event.matchReason}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{event.description}</p>

        {/* Skills matched tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.skillsMatched.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-lg text-[11px] bg-white/5 text-slate-300 border border-white/10"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{event.attendeesCount} attendees registered</span>
          </div>
        </div>

        <motion.button
          onClick={handleRegister}
          disabled={isRegistered}
          whileTap={{ scale: 0.96 }}
          className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isRegistered
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-purple-500/25'
          }`}
        >
          {isRegistered ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registered & Ticket Saved!</span>
            </>
          ) : (
            <>
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
