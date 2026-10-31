import React from 'react';
import { HelpCircle, AlertTriangle, X } from 'lucide-react';

export default function HintModal({ isOpen, onClose, onConfirm, hintsRemaining, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Request Deductive Hint</h3>
            <p className="text-xs text-slate-400 font-mono">{hintsRemaining} hint{hintsRemaining !== 1 ? 's' : ''} currently remaining</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200/90 leading-relaxed">
              <strong className="block text-rose-300 font-bold mb-1">Score Penalty Notice (-10 Points)</strong>
              Unlocking this hint will deduct <strong>10 points</strong> from your final detective score. Hints provide guidance without revealing the culprit directly.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Decrypting Hint...</span>
              </>
            ) : (
              <span>Confirm & Unlock Hint (-10 pts)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
