import React, { useState } from 'react';
import { Gavel, AlertOctagon, X, UserCheck, CheckCircle } from 'lucide-react';
import SuspectCard from './SuspectCard';

export default function AccusationModal({ 
  isOpen, 
  onClose, 
  suspects = [], 
  onSubmit, 
  loading 
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [motiveNotes, setMotiveNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) {
      setError('Please select a suspect before indicting.');
      return;
    }
    setError('');
    onSubmit({ accusedSuspectId: selectedId, motiveNotes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 p-6 md:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Submit Formal Accusation</h3>
            <p className="text-xs text-slate-400 font-mono">
              Indict the primary suspect and seal the case file
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Suspect */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
              1. Select Culprit to Accuse ({suspects.length} Suspects in Lineup)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {suspects.map(suspect => {
                const isSelected = selectedId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => {
                      setSelectedId(suspect.id);
                      setError('');
                    }}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {suspect.role}
                      </span>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm">{suspect.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 italic">
                      "{suspect.alibi}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Motive / Reasoning Notes */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Detective's Theory & Supporting Clues (Optional)
            </label>
            <textarea
              value={motiveNotes}
              onChange={(e) => setMotiveNotes(e.target.value)}
              placeholder="e.g. Vincent Vance had security clearance to loop the cameras, and the cashmere thread found on the balcony matched his jacket..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none font-sans"
            />
          </div>

          {/* Critical Warning */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200/90 leading-relaxed">
              <strong className="block text-rose-300 font-bold mb-1">Irreversible Decision</strong>
              Once submitted, your accusation is locked. The backend will evaluate your verdict, calculate your score, and reveal the full truth.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 font-mono text-xs pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors font-semibold"
            >
              Cancel & Continue Investigating
            </button>
            <button
              type="submit"
              disabled={loading || !selectedId}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Accusation...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  <span>Formally Indict Suspect</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

