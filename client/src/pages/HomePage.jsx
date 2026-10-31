import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  Gavel, 
  HelpCircle, 
  Award, 
  ArrowRight,
  Flame,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';
import { caseApi } from '../api/caseApi';

export default function HomePage() {
  const [recentCases, setRecentCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    caseApi.getRecentCases()
      .then(res => setRecentCases(res.cases || []))
      .catch(() => setRecentCases([]))
      .finally(() => setLoadingCases(false));
  }, []);

  return (
    <div className="flex flex-col gap-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>AUTONOMOUS DETECTIVE EXPERIENCE POWERED BY GEMINI 2.5</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight mb-6">
          Every Mystery is Generated Live. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            Can You Crack the Case?
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Step into the detective's shoes. Interrogate suspects, inspect crime scenes for forensic clues, balance hints against your score, and formally indict the culprit.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Open A New Case</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-base border border-slate-800 transition-colors flex items-center justify-center gap-2 font-mono text-sm"
          >
            <span>Detective Manual</span>
          </a>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Procedural AI Storytelling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini generates intricate, logically consistent murder mysteries complete with victim backgrounds, suspect alibis, and forensic evidence trails.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Zero-Leak Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The true culprit identity and full solution remain locked on the backend server until you formally submit your accusation. Inspect element won't spoil the mystery!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Deductive Scoring System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn +5 points for every discovered clue. Solve the crime for up to 200 base points. But beware: each hint costs a -10 point penalty!
            </p>
          </div>
        </div>
      </section>

      {/* Difficulty Breakdown Table */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100">Select Your Investigation Tier</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">Calibrated suspects, clues, hints, and scoring stakes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Easy */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DifficultyBadge difficulty="Easy" size="lg" />
                <span className="text-xl font-bold text-emerald-400 font-mono">100 PTS</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">Casual Sleuth</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3 Suspects in Lineup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5 Forensic Clues to Uncover</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2 Deductive Hints (-10 pts each)</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?diff=Easy"
              className="mt-6 w-full py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold text-center block transition-colors"
            >
              Play Easy Mode
            </Link>
          </div>

          {/* Medium */}
          <div className="relative p-6 rounded-2xl bg-slate-900/80 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-0.5 rounded-full bg-amber-500 text-slate-950">
              RECOMMENDED
            </span>
            <div>
              <div className="flex items-center justify-between mb-4">
                <DifficultyBadge difficulty="Medium" size="lg" />
                <span className="text-xl font-bold text-amber-400 font-mono">150 PTS</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">Detective Inspector</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>4 Suspects in Lineup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>7 Forensic Clues to Uncover</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>3 Deductive Hints (-10 pts each)</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?diff=Medium"
              className="mt-6 w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold text-center block transition-all shadow-md shadow-amber-500/20"
            >
              Play Medium Mode
            </Link>
          </div>

          {/* Hard */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DifficultyBadge difficulty="Hard" size="lg" />
                <span className="text-xl font-bold text-rose-400 font-mono">200 PTS</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">Master Sleuth</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>5 Suspects in Lineup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>9 Forensic Clues & Red Herrings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>3 Deductive Hints (-10 pts each)</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?diff=Hard"
              className="mt-6 w-full py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold text-center block transition-colors"
            >
              Play Hard Mode
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 w-full py-8 border-t border-slate-800/80">
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-10">Investigation Protocol</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-2xl font-mono font-bold text-amber-500">01</span>
            <h4 className="font-bold text-slate-100 mt-2 mb-1">Set the Crime Scene</h4>
            <p className="text-xs text-slate-400">Enter any premise or choose a classic preset. Gemini generates the case.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-2xl font-mono font-bold text-amber-500">02</span>
            <h4 className="font-bold text-slate-100 mt-2 mb-1">Inspect Clues</h4>
            <p className="text-xs text-slate-400">Discover evidence cards (+5 pts each) to unlock forensic details and cross-check alibis.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-2xl font-mono font-bold text-amber-500">03</span>
            <h4 className="font-bold text-slate-100 mt-2 mb-1">Use Hints Wisely</h4>
            <p className="text-xs text-slate-400">Request subtle deductive guidance when stuck. Each hint reduces your score by 10 pts.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-2xl font-mono font-bold text-amber-500">04</span>
            <h4 className="font-bold text-slate-100 mt-2 mb-1">Formally Indict</h4>
            <p className="text-xs text-slate-400">Name the culprit. The server evaluates your verdict and reveals the complete solution!</p>
          </div>
        </div>
      </section>

      {/* Recent Case Archives */}
      {recentCases.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 w-full pb-8">
          <div className="flex items-center gap-2 mb-6">
            <FolderOpen className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-100">Recent Scotland Yard Case Archives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCases.slice(0, 4).map(c => (
              <Link
                key={c._id}
                to={c.status === 'completed' ? `/case/${c._id}/result` : `/case/${c._id}`}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DifficultyBadge difficulty={c.difficulty} />
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      c.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">{c.title}</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

