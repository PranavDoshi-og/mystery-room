import React from 'react';
import { Search, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">AI Mystery Room</p>
            <p className="text-xs text-slate-500">Autonomous Murder Mystery Engine powered by Google Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Server-side Anti-Leak Protected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>CCBP 4.0 Submission</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

