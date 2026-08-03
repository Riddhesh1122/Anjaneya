import React from 'react';
import { motion } from 'framer-motion';

const ConfirmModal: React.FC<{ open: boolean; title?: string; message?: string; onConfirm: () => void; onCancel: () => void }> = ({ open, title = 'Confirm', message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border border-slate-200 px-3 py-2 text-sm">Cancel</button>
          <button onClick={onConfirm} className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
