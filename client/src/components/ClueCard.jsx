import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  MapPin, 
  Microscope, 
  FileText, 
  MessageSquare, 
  Cpu, 
  Package, 
  Lock,
  Sparkles
} from 'lucide-react';

const CATEGORY_ICONS = {
  Physical: Package,
  Forensic: Microscope,
  Document: FileText,
  Testimonial: MessageSquare,
  Digital: Cpu,
};

const CATEGORY_COLORS = {
  Physical: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Forensic: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Document: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  Testimonial: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  Digital: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
};

export default function ClueCard({ clue, onDiscover }) {
  const [loading, setLoading] = useState(false);
  const Icon = CATEGORY_ICONS[clue.category] || Package;
  const colorClass = CATEGORY_COLORS[clue.category] || CATEGORY_COLORS.Physical;

  const handleInspect = async () => {
    if (clue.isDiscovered || loading) return;
    setLoading(true);
    try {
      await onDiscover(clue.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 p-5 flex flex-col justify-between ${
        clue.isDiscovered
          ? 'bg-slate-900/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${colorClass}`}>
              <Icon className="w-3 h-3" />
              {clue.category}
            </span>
            {clue.location && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                <MapPin className="w-2.5 h-2.5" />
                {clue.location}
              </span>
            )}
          </div>

          {clue.isDiscovered ? (
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              +5 PTS
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              <Lock className="w-3 h-3" />
              SEALED
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-100 text-base mb-2">
          {clue.title}
        </h4>

        {/* Body content */}
        {clue.isDiscovered ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <p>{clue.description}</p>
            </div>

            <div className="text-xs leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-amber-200/90">
              <div className="flex items-center gap-1 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Forensic Deductive Significance
              </div>
              <p>{clue.significance}</p>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center bg-slate-900/40 rounded-lg border border-dashed border-slate-800 my-2">
            <Search className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              Classified forensic material. Inspect to analyze details and earn points.
            </p>
          </div>
        )}
      </div>

      {/* Inspect button if undiscovered */}
      {!clue.isDiscovered && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={handleInspect}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Forensic Inspection in Progress...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Inspect Evidence (+5 pts)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

