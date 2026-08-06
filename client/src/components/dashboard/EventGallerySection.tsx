import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Upload, X, ChevronLeft, ChevronRight, Maximize2,
  Sparkles, Award, Trash2, Plus, Camera, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

interface EventGallerySectionProps {
  eventId: string;
  eventStatus?: string;
}

const initialPhotos = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', caption: 'Keynote Session & Opening Ceremony' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80', caption: 'AI Machine Learning Workshop' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', caption: 'Collaborative Hackathon Coding Session' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', caption: 'Zero-Trust Security Panel Q&A' },
  { id: 'p5', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', caption: 'Networking & Industry Leaders Summit' },
  { id: 'p6', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80', caption: 'Award Ceremony & Certificate Distribution' },
];

export default function EventGallerySection({ eventId, eventStatus }: EventGallerySectionProps) {
  const { isDark } = useTheme();
  const [photos, setPhotos] = useState(initialPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [newCaption, setNewCaption] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const handleNextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  const handleUploadPhoto = () => {
    if (!uploadedPreview) return;
    setPhotos(prev => [
      {
        id: `p-${Date.now()}`,
        url: uploadedPreview,
        caption: newCaption || 'Event Highlight Photo',
      },
      ...prev,
    ]);
    setShowUploadModal(false);
    setUploadedPreview(null);
    setNewCaption('');
  };

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-800/60">
      {/* Memories Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-violet-500/15 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-sm font-extrabold ${textPri}`}>Event Gallery & Memories</h4>
            <p className={`text-xs ${textSub}`}>{photos.length} HD photos and key highlights captured</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          leftIcon={<Camera className="w-4 h-4 text-amber-500" />}
        >
          Add Photos
        </Button>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((p, idx) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setLightboxIndex(idx)}
            className="group relative h-36 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer"
          >
            <img
              src={p.url}
              alt={p.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <p className="text-[11px] font-bold text-white truncate">{p.caption}</p>
              <span className="text-[9px] font-semibold text-amber-400 flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Click to enlarge
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-800/80 text-white cursor-pointer hover:bg-zinc-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-800/80 text-white cursor-pointer hover:bg-zinc-700"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-3xl max-h-[80vh] text-center space-y-3">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption}
                className="max-h-[70vh] rounded-2xl mx-auto object-contain border border-zinc-800 shadow-2xl"
              />
              <p className="text-sm font-extrabold text-white">{photos[lightboxIndex].caption}</p>
              <span className="text-xs text-zinc-400 font-mono">
                Photo {lightboxIndex + 1} of {photos.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organizer Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border ${cardBg} p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className={`text-base font-extrabold ${textPri}`}>Upload Event Photo</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Photo URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={uploadedPreview || ''}
                  onChange={e => setUploadedPreview(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                />
              </div>

              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Keynote Q&A Session"
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleUploadPhoto} leftIcon={<Upload className="w-4 h-4 text-zinc-950" />}>Upload Photo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
