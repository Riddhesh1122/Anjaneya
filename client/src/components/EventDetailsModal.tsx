import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Ticket, Sparkles, CheckCircle2, ShieldAlert, Award, Clock } from 'lucide-react';
import EventGallerySection from './dashboard/EventGallerySection';
import EventReviewsSection from './dashboard/EventReviewsSection';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onOpenQR: (event: any) => void;
}

export default function EventDetailsModal({ isOpen, onClose, event, onOpenQR }: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
        >
          {/* Header Banner */}
          <div className="relative h-48 bg-gradient-to-r from-amber-500/20 via-slate-800 to-indigo-900/40 p-6 flex flex-col justify-end border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {event.category || 'Technology'}
              </span>
              {event.price === 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Free Admission
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">{event.title}</h2>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Date & Time</div>
                  <div className="text-xs font-semibold text-slate-200">{event.date || 'Upcoming'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Venue Location</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{event.location || 'Pune / Virtual'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Registered</div>
                  <div className="text-xs font-semibold text-slate-200">{event.attendees || 350}+ Attendees</div>
                </div>
              </div>
            </div>

            {/* Event Overview */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Event Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                {event.description || 'Join key industry leaders, developers, and innovators for hands-on sessions, networking opportunities, and live practical demonstrations.'}
              </p>
            </div>

            {/* Agenda Highlights */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Event Schedule & Highlights
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-semibold text-amber-400">10:00 AM - Keynote Address</span>
                  <span className="text-slate-400">Main Auditorium</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-semibold text-indigo-400">01:30 PM - Interactive AI Workshop</span>
                  <span className="text-slate-400">Lab Suite 4</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-semibold text-emerald-400">04:00 PM - Panel & Certificate Distribution</span>
                  <span className="text-slate-400">Expo Hall</span>
                </div>
              </div>
            </div>

            {/* Event Gallery & Memories */}
            <EventGallerySection eventId={event.id || 'e1'} eventStatus={event.status} />

            {/* Event Reviews & Ratings */}
            <EventReviewsSection eventId={event.id || 'e1'} />
          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenQR(event);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                View Digital Pass (QR Code)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
