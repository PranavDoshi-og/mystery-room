import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, ShieldCheck, FolderGit2, AlertCircle } from 'lucide-react';
import { caseApi } from '../api/caseApi';

export default function Navbar() {
  const location = useLocation();
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    caseApi.checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300">
            <Search className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-slate-100 group-hover:text-amber-400 transition-colors">
                AI Mystery Room
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wider">CRIME CASE FILES</p>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Server status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${apiOnline === true ? 'bg-emerald-400 animate-pulse' : apiOnline === false ? 'bg-rose-500' : 'bg-amber-400'}`} />
            <span className="text-slate-400">
              {apiOnline === true ? 'SYSTEM ONLINE' : apiOnline === false ? 'API OFFLINE' : 'CHECKING...'}
            </span>
          </div>

          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Case</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
