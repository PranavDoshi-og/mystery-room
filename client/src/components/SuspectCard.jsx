import React from 'react';
import { UserCheck, Shield, Clock, FileText } from 'lucide-react';

export default function SuspectCard({ suspect, isSelected, onSelect, selectable = false }) {
  return (
    <div
      onClick={() => selectable && onSelect && onSelect(suspect.id)}
      className={`group relative rounded-xl border transition-all duration-300 p-5 flex flex-col justify-between ${
        selectable
          ? 'cursor-pointer hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
          : ''
      } ${
        isSelected
          ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900/90'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
            {suspect.role}
          </span>
          {isSelected && (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              ACCUSED
            </span>
          )}
        </div>

        {/* Suspect Info */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg border transition-colors ${
            isSelected
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-800 text-amber-400 border-slate-700 group-hover:border-amber-500/50'
          }`}>
            {suspect.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-400 transition-colors">
              {suspect.name}
            </h3>
            <p className="text-xs text-slate-400">{suspect.role}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-3 text-xs text-slate-300/90 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-mono text-[11px]">
            <FileText className="w-3 h-3 text-amber-500" />
            <span>BACKGROUND</span>
          </div>
          <p>{suspect.bio}</p>
        </div>

        {/* Alibi */}
        <div className="text-xs text-slate-300/90 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>STATED ALIBI</span>
          </div>
          <p className="italic text-slate-300">"{suspect.alibi}"</p>
        </div>
      </div>

      {selectable && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all ${
              isSelected
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isSelected ? '✓ Suspect Selected' : 'Select for Accusation'}
          </button>
        </div>
      )}
    </div>
  );
}
