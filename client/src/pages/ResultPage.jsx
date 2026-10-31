import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Gavel, 
  FileText, 
  UserCheck, 
  Key,
  ExternalLink
} from 'lucide-react';
import { caseApi } from '../api/caseApi';
import DifficultyBadge from '../components/DifficultyBadge';

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await caseApi.getResult(id);
        if (res.success && res.result) {
          setResult(res.result);

          // If correct, launch victory confetti
          if (res.result.accusation?.isCorrect) {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
            });
          }
        } else {
          throw new Error(res.message || 'Failed to load case results');
        }
      } catch (err) {
        console.error('Failed to load result:', err);
        setError(err.response?.data?.message || err.message || 'Could not load case result');
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Search className="w-10 h-10 text-amber-400 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-100">Unsealing Case Verdict...</h3>
        <p className="text-xs text-slate-400 font-mono mt-1">Reviewing forensic records</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Verdict Unavailable</h3>
        <p className="text-xs text-slate-400 mb-6">{error || 'This case has not been solved yet.'}</p>
        <Link
          to={`/case/${id}`}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs font-mono inline-block"
        >
          Return to Investigation Room
        </Link>
      </div>
    );
  }

  const isSolved = result.accusation?.isCorrect;
  const culprit = result.suspects?.find(s => s.id === result.culpritId);
  const accused = result.suspects?.find(s => s.id === result.accusation?.accusedSuspectId);
  const scoring = result.scoring || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-10">
      {/* Verdict Hero Banner */}
      <div className={`relative p-8 md:p-12 rounded-3xl border text-center overflow-hidden shadow-2xl ${
        isSolved
          ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border-emerald-500/50 shadow-emerald-500/10'
          : 'bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-950 border-rose-500/50 shadow-rose-500/10'
      }`}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono mb-6">
          <DifficultyBadge difficulty={result.difficulty} />
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">OFFICIAL VERDICT FILE</span>
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center border shadow-xl ${
          isSolved
            ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-400'
            : 'bg-rose-500/15 border-rose-400/50 text-rose-400'
        }`}>
          {isSolved ? (
            <Trophy className="w-10 h-10 animate-bounce" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 mb-3">
          {isSolved ? 'GUILTY AS CHARGED!' : 'WRONGFUL ACCUSATION'}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-6">
          {isSolved
            ? `Outstanding detective work! You correctly identified ${culprit?.name || 'the culprit'} as the perpetrator.`
            : `The evidence did not support your accusation against ${accused?.name || 'the suspect'}. The true culprit eluded capture.`}
        </p>

        {/* Large Score Callout */}
        <div className="inline-block p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-xs font-mono text-slate-400 block mb-1">FINAL DETECTIVE SCORE</span>
          <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
            isSolved ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {scoring.finalScore ?? 0} PTS
          </span>
        </div>
      </div>

      {/* Score Breakdown Table */}
      <section className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <span>Score Breakdown & Audit Trail</span>
          <span className="text-xs font-mono text-slate-500">(Calculated Authoritatively on Backend)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Base Difficulty Score */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">
              BASE ACCUSATION ({result.difficulty})
            </span>
            <span className={`text-2xl font-bold font-mono ${isSolved ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isSolved ? `+${scoring.basePoints}` : '0'} PTS
            </span>
            <p className="text-[11px] font-mono text-slate-500 mt-2">
              {isSolved ? 'Correct suspect identified' : 'Wrong suspect selected'}
            </p>
          </div>

          {/* Clues Bonus */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">
              EVIDENCE BONUS ({scoring.cluesDiscoveredCount} clues)
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              +{scoring.cluesBonus ?? 0} PTS
            </span>
            <p className="text-[11px] font-mono text-slate-500 mt-2">
              +5 pts per discovered clue
            </p>
          </div>

          {/* Hints Penalty */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">
              HINT DEDUCTIONS ({scoring.hintsUsedCount} hints)
            </span>
            <span className="text-2xl font-bold font-mono text-rose-400">
              -{scoring.hintsPenalty ?? 0} PTS
            </span>
            <p className="text-[11px] font-mono text-slate-500 mt-2">
              -10 pts penalty per hint used
            </p>
          </div>

          {/* Net Score */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30">
            <span className="text-xs font-mono text-slate-400 block mb-1">
              NET FINAL SCORE
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {scoring.finalScore ?? 0} PTS
            </span>
            <p className="text-[11px] font-mono text-slate-500 mt-2">
              Minimum floor: 0 pts
            </p>
          </div>
        </div>
      </section>

      {/* The Unveiling: Culprit & Full Solution */}
      <section className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">The Unveiling: The Truth Revealed</h2>
            <p className="text-xs text-slate-400 font-mono">The complete chronological crime narrative</p>
          </div>
        </div>

        {/* Culprit Card */}
        {culprit && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center font-mono font-bold text-xl">
                  {culprit.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    THE PERPETRATOR
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">{culprit.name}</h3>
                  <p className="text-xs text-slate-400">{culprit.role}</p>
                </div>
              </div>

              {/* Accusation recap badge */}
              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">YOUR INDICTMENT</span>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded inline-block ${
                  isSolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {result.accusation?.accusedSuspectName || 'Unknown'} {isSolved ? '(MATCH)' : '(WRONG)'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2 pt-2 border-t border-slate-900">
              <p><strong className="text-slate-400">Fabricated Alibi:</strong> <span className="italic">"{culprit.alibi}"</span></p>
              <p><strong className="text-slate-400">Background:</strong> {culprit.bio}</p>
            </div>
          </div>
        )}

        {/* How the Crime was Executed */}
        {result.solutionSummary && (
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>How the Crime Occurred</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {result.solutionSummary}
            </p>
          </div>
        )}

        {/* Deductive Proof */}
        {result.howCluesRevealCulprit && (
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>The Forensic Smoking Gun</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {result.howCluesRevealCulprit}
            </p>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/create"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Solve Another Mystery</span>
        </Link>

        <Link
          to={`/case/${id}`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <span>Review Case Dossier Clues</span>
        </Link>
      </div>
    </div>
  );
}
