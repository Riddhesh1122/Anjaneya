import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download, Share2, Ticket, Calendar, MapPin, User, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    category?: string;
  } | null;
  attendeeName?: string;
}

export default function QRCodeModal({ isOpen, onClose, event, attendeeName = 'Demo User' }: QRCodeModalProps) {
  if (!isOpen || !event) return null;

  const ticketId = `ANJ-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ANJANEYA_PASS_${encodeURIComponent(event.id)}_${encodeURIComponent(attendeeName)}&color=FF7A00&bgcolor=0A0F1E`;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-amber-500/10"
        >
          {/* Header Accent Gradient */}
          <div className="h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close QR Ticket Modal"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Event Pass
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-amber-500" /> Ticket ID: <span className="font-mono text-slate-200">{ticketId}</span>
            </p>

            {/* Ticket Card Body */}
            <div className="my-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />

              {/* QR Image Container */}
              <div className="relative mx-auto w-48 h-48 p-3 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center shadow-inner group-hover:border-amber-500/60 transition-colors">
                <img
                  src={qrSvgUrl}
                  alt="Event Registration QR Code"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-400 gap-2 font-mono text-xs hidden [div:has(>img[style*='display: none'])]:flex">
                  <QrCode className="w-12 h-12 text-amber-500 animate-pulse" />
                  <span>{ticketId}</span>
                </div>
              </div>

              {/* Event Metadata Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-left text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> Attendee</span>
                  <span className="font-semibold text-slate-200">{attendeeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Date & Time</span>
                  <span className="font-medium text-slate-200">{event.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Venue</span>
                  <span className="font-medium text-slate-200 truncate max-w-[180px]">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert(`Ticket Code ${ticketId} copied to clipboard!`)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                Share Pass
              </button>
              <button
                onClick={() => alert('Downloading digital pass PDF...')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Save Ticket
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
