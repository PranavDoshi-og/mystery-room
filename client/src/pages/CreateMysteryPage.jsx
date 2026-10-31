import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { caseApi } from '../api/caseApi';

const PRESETS = [
  {
    icon: '🏛️',
    title: 'The Midnight Museum Heist',
    premise: 'The legendary Egyptian Star of Cairo diamond is stolen from a locked glass vitrine during the annual benefactor gala. The museum was under lockdown with only 4 VIPs and the curator inside.'
  },
  {
    icon: '❄️',
    title: 'Express Train in the Blizzard',
    premise: 'A passenger train halts inside a snowbound alpine tunnel. A reclusive international diplomat is found dead in his private first-class cabin with a single puncture wound.'
  },
  {
    icon: '🏰',
    title: 'Cyberpunk Penthouse Poisoning',
    premise: 'A neuro-tech CEO collapses during an exclusive product reveal on the 88th-floor neon sky-terrace. The security logs reveal the elevator access was disabled by an insider.'
  },
  {
    icon: '🎭',
    title: 'Curtains Down at the Grand Opera',
    premise: 'During the climactic final act of Carmen, the lead tenor drops dead on stage. The prop goblet had been swapped for real poison right before the curtain rose.'
  }
];

const LOADING_MESSAGES = [
  "Consulting Scotland Yard archives...",
  "Synthesizing forensic timeline and alibis...",
  "Scattering clues and planting red herrings...",
  "Locking the culprit dossier in the secure vault...",
  "Finalizing detective case briefing..."
];

export default function CreateMysteryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [premise, setPremise] = useState(
    'A wealthy tech investor is poisoned during a stormy dinner party at a secluded cliffside estate.'
  );
  const [difficulty, setDifficulty] = useState(searchParams.get('diff') || 'Medium');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  // Cycle loading messages
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!premise.trim()) {
      setError('Please provide a mystery premise or choose a preset.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await caseApi.createCase({ premise: premise.trim(), difficulty });
      if (res.success && res.case?._id) {
        navigate(`/case/${res.case._id}`);
      } else {
        throw new Error(res.message || 'Failed to generate case');
      }
    } catch (err) {
      console.error('Case generation failed:', err);
      setError(err.response?.data?.message || err.message || 'Case generation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CASE COMMISSION DESK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 mb-3 tracking-tight">
          Commission a New Mystery
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Provide your premise or choose from classic detective scenarios. Gemini will construct a fully deductive mystery case file.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        /* Atmospheric Loading Dossier */
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <Search className="w-10 h-10 animate-spin" />
          </div>

          <h3 className="text-2xl font-bold text-slate-100 mb-2">
            Generating Case File...
          </h3>

          <p className="text-sm font-mono text-amber-400 h-6 transition-all duration-300">
            {LOADING_MESSAGES[loadingStep]}
          </p>

          <div className="mt-8 max-w-xs mx-auto bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse w-3/4 rounded-full" />
          </div>

          <p className="text-xs text-slate-500 font-mono mt-6">
            Difficulty: <strong className="text-slate-300">{difficulty}</strong> • Powered by Gemini AI
          </p>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Step 1: Premise */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Incident Premise / Crime Scenario
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Describe the setting, the victim, or the inciting crime incident:
            </p>
            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              rows={4}
              placeholder="e.g. A wealthy wine collector is poisoned during a cellar tasting behind closed steel vault doors..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none font-sans"
            />

            {/* Presets */}
            <div className="mt-4">
              <span className="text-xs font-mono text-slate-400 block mb-2">
                Or pick a classic detective scenario:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPremise(p.premise)}
                    className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{p.icon}</span>
                      <span className="font-bold text-slate-200 text-xs group-hover:text-amber-400 transition-colors">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {p.premise}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Difficulty Selection */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Select Investigation Difficulty
            </label>
            <p className="text-xs text-slate-400 mb-4">
              Determines suspect complexity, clue count, and base victory bounty:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Easy */}
              <div
                onClick={() => setDifficulty('Easy')}
                className={`cursor-pointer p-5 rounded-xl border text-left transition-all ${
                  difficulty === 'Easy'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Easy
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">+100 pts</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>• 3 Suspects</p>
                  <p>• 5 Forensic Clues</p>
                  <p>• 2 Hints Available</p>
                </div>
              </div>

              {/* Medium */}
              <div
                onClick={() => setDifficulty('Medium')}
                className={`cursor-pointer p-5 rounded-xl border text-left transition-all ${
                  difficulty === 'Medium'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    Medium
                  </span>
                  <span className="font-mono text-xs text-amber-400 font-bold">+150 pts</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>• 4 Suspects</p>
                  <p>• 7 Forensic Clues</p>
                  <p>• 3 Hints Available</p>
                </div>
              </div>

              {/* Hard */}
              <div
                onClick={() => setDifficulty('Hard')}
                className={`cursor-pointer p-5 rounded-xl border text-left transition-all ${
                  difficulty === 'Hard'
                    ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/40'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Hard
                  </span>
                  <span className="font-mono text-xs text-rose-400 font-bold">+200 pts</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>• 5 Suspects</p>
                  <p>• 9 Forensic Clues</p>
                  <p>• 3 Hints Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 inline-flex items-center justify-center gap-3"
            >
              <Search className="w-5 h-5" />
              <span>Generate Case Dossier</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
