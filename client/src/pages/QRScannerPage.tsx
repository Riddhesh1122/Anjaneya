import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Camera, Flashlight, CheckCircle2, XCircle, AlertTriangle,
  RotateCcw, History, ShieldCheck, Ticket, User, Calendar, MapPin, Search, ArrowRight, Award
} from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface ScanHistoryRecord {
  id: string;
  token: string;
  attendeeName: string;
  eventName: string;
  status: 'success' | 'duplicate' | 'invalid';
  timestamp: string;
}

export default function QRScannerPage() {
  const { isDark } = useTheme();
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashlightOn, setFlashlightOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      if (!isCameraActive) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access error or device lacks camera:', err);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, facingMode]);

  const triggerAudioFeedback = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(success ? 880 : 300, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleProcessScan = async (tokenToVerify?: string) => {
    const token = tokenToVerify || manualToken;
    if (!token.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      const response = await axios.post('/api/registrations/checkin', { qrToken: token.trim() });
      const data = response.data;

      if (data.success || data.registration) {
        const reg = data.registration || data;
        const resultPayload = {
          attendeeName: reg.attendeeId?.name || 'Attendee',
          email: reg.attendeeId?.email || 'user@example.com',
          eventTitle: reg.eventId?.title || 'AI Innovations Summit 2026',
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketId: `ANJ-${reg._id ? reg._id.substring(0, 6).toUpperCase() : 'TICKET'}`,
          isCertificateEligible: true,
        };

        setScanResult(resultPayload);
        triggerAudioFeedback(true);

        const newRecord: ScanHistoryRecord = {
          id: Date.now().toString(),
          token: token.substring(0, 10) + '...',
          attendeeName: resultPayload.attendeeName,
          eventName: resultPayload.eventTitle,
          status: 'success',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setScanHistory(prev => [newRecord, ...prev.slice(0, 9)]);
        setManualToken('');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid or Duplicate Check-in Rejected';
      setErrorMsg(msg);
      triggerAudioFeedback(false);

      const isDup = msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already');
      const newRecord: ScanHistoryRecord = {
        id: Date.now().toString(),
        token: token.substring(0, 10) + '...',
        attendeeName: 'Unknown Attendee',
        eventName: 'Platform Event',
        status: isDup ? 'duplicate' : 'invalid',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setScanHistory(prev => [newRecord, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const surfaceBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${textPri}`}>
              QR Attendance Scanner
            </h1>
          </div>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${textSub}`}>
            Scan attendee passes or enter signed QR tokens for live check-in verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
            leftIcon={<RotateCcw className="w-4 h-4 text-amber-500" />}
          >
            Switch Camera
          </Button>
          <Button
            variant={flashlightOn ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFlashlightOn(!flashlightOn)}
            leftIcon={<Flashlight className="w-4 h-4" />}
          >
            {flashlightOn ? 'Torch On' : 'Torch Off'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport & Manual Input */}
        <div className="lg:col-span-7 space-y-6">
          {/* Camera Viewport Card */}
          <div className={`rounded-2xl border ${surfaceBg} overflow-hidden p-4 relative flex flex-col items-center justify-center min-h-[340px]`}>
            <div className="relative w-full max-w-md aspect-square rounded-2xl bg-black overflow-hidden border-2 border-amber-500/40 shadow-2xl flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-amber-500/60 rounded-xl m-10 pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-amber-500 animate-pulse shadow-lg shadow-amber-500" />
              </div>

              {/* Top Camera Status Tag */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-extrabold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Camera Ready
              </div>
            </div>

            {/* Manual QR Input Fallback */}
            <div className="w-full mt-4 space-y-2">
              <label className={`text-xs font-extrabold uppercase tracking-wider ${textSub}`}>
                Manual QR Token / Ticket ID Entry
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessScan();
                }}
                className="flex gap-2"
              >
                <Input
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value)}
                  placeholder="Paste QR token payload or ticket string..."
                  aria-label="Manual QR Token"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  disabled={!manualToken.trim()}
                  leftIcon={<Search className="w-4 h-4 text-zinc-950" />}
                >
                  Verify
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Result Drawer & History Table */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scan Result Card */}
          <div className={`rounded-2xl border ${surfaceBg} p-6 space-y-4`}>
            <h3 className={`text-base font-extrabold flex items-center gap-2 ${textPri}`}>
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Scan Verification Result
            </h3>

            {scanResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Check-in Confirmed & Verified!
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className={textSub}>Attendee:</span>
                    <span className={`font-extrabold ${textPri}`}>{scanResult.attendeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSub}>Event:</span>
                    <span className={`font-extrabold truncate max-w-[200px] ${textPri}`}>{scanResult.eventTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSub}>Check-in Time:</span>
                    <span className="font-mono text-amber-400 font-bold">{scanResult.checkInTime}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20">
                    <span className={textSub}>Certificate Eligibility:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                      <Award className="w-3 h-3" /> Eligible
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : errorMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-rose-400 text-xs"
              >
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  <XCircle className="w-5 h-5" />
                  Scan Rejected
                </div>
                <p className="font-semibold">{errorMsg}</p>
              </motion.div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500 space-y-2">
                <QrCode className="w-10 h-10 mx-auto text-zinc-600 animate-pulse" />
                <p>Point camera at attendee QR pass or enter ticket token above</p>
              </div>
            )}
          </div>

          {/* Recent Scan History */}
          <div className={`rounded-2xl border ${surfaceBg} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-extrabold flex items-center gap-2 ${textPri}`}>
                <History className="w-4 h-4 text-amber-500" />
                Scan History Log
              </h3>
              <span className={`text-xs font-bold ${textSub}`}>{scanHistory.length} recorded</span>
            </div>

            <div className="divide-y divide-zinc-800/40 max-h-56 overflow-y-auto">
              {scanHistory.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">No recent check-ins recorded</p>
              ) : (
                scanHistory.map(rec => (
                  <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className={`font-extrabold ${textPri}`}>{rec.attendeeName}</p>
                      <p className={`text-[10px] ${textSub}`}>{rec.eventName} · {rec.timestamp}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      rec.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      rec.status === 'duplicate' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      {rec.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
