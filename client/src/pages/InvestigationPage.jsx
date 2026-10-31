import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Gavel, 
  HelpCircle, 
  ShieldAlert, 
  MapPin, 
  User, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileQuestion,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { caseApi } from '../api/caseApi';
import DifficultyBadge from '../components/DifficultyBadge';
import SuspectCard from '../components/SuspectCard';
import ClueCard from '../components/ClueCard';
import HintModal from '../components/HintModal';
import AccusationModal from '../components/AccusationModal';

const BASE_POINTS_BY_DIFF = {
  Easy: 100,
  Medium: 150,
  Hard: 200
};

export default function InvestigationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isAccuseModalOpen, setIsAccuseModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Story toggle
  const [storyExpanded, setStoryExpanded] = useState(true);

  // Fetch case data
  const fetchCase = async () => {
    try {
      const res = await caseApi.getCase(id);
      if (res.success && res.case) {
        // If already completed, redirect to results
        if (res.case.status === 'completed') {
          navigate(`/case/${id}/result`, { replace: true });
          return;
        }
        setCaseData(res.case);
      } else {
        throw new Error(res.message || 'Failed to load case');
      }
    } catch (err) {
      console.error('Error fetching case:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  // Flash notification
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Discover clue handler
  const handleDiscoverClue = async (clueId) => {
    try {
      const res = await caseApi.discoverClue(id, clueId);
      if (res.success && res.case) {
        setCaseData(res.case);
        showNotification('🔍 Clue inspected and forensic evidence recorded! (+5 pts)');
      }
    } catch (err) {
      console.error('Error inspecting clue:', err);
      alert(err.response?.data?.message || 'Failed to inspect clue');
    }
  };

  // Request hint handler
  const handleRequestHint = async () => {
    setActionLoading(true);
    try {
      const res = await caseApi.requestHint(id);
      if (res.success && res.case) {
        setCaseData(res.case);
        setIsHintModalOpen(false);
        showNotification('💡 Deductive hint unlocked! (-10 pts penalty)');
      }
    } catch (err) {
      console.error('Error requesting hint:', err);
      alert(err.response?.data?.message || 'Failed to request hint');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit accusation handler
  const handleSubmitAccusation = async ({ accusedSuspectId, motiveNotes }) => {
    setActionLoading(true);
    try {
      const res = await caseApi.submitAccusation(id, { accusedSuspectId, motiveNotes });
      if (res.success && res.result) {
        navigate(`/case/${id}/result`);
      }
    } catch (err) {
      console.error('Error submitting accusation:', err);
      alert(err.response?.data?.message || 'Failed to submit accusation');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Search className="w-10 h-10 text-amber-400 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-100">Accessing Case Dossier...</h3>
        <p className="text-xs text-slate-400 font-mono mt-1">Decrypting evidence files</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Case File Inaccessible</h3>
        <p className="text-xs text-slate-400 mb-6">{error || 'Could not locate case file.'}</p>
        <Link
          to="/create"
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs font-mono inline-block"
        >
          Open New Case
        </Link>
      </div>
    );
  }

  // Derived stats
  const totalClues = caseData.clues?.length || 0;
  const discoveredCluesCount = caseData.clues?.filter(c => c.isDiscovered).length || 0;
  const clueProgressPercent = totalClues > 0 ? Math.round((discoveredCluesCount / totalClues) * 100) : 0;

  const totalHints = caseData.hints?.length || 0;
  const usedHints = caseData.hints?.filter(h => h.isUsed) || [];
  const hintsRemaining = totalHints - usedHints.length;

  const basePoints = BASE_POINTS_BY_DIFF[caseData.difficulty] || 150;
  const projectedScore = Math.max(0, basePoints + (discoveredCluesCount * 5) - (usedHints.length * 10));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-xl animate-in fade-in slide-in-from-top-4">
          {notification}
        </div>
      )}

      {/* Case Header Dossier Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DifficultyBadge difficulty={caseData.difficulty} size="sm" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ACTIVE INVESTIGATION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {caseData.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              CASE REF: #{caseData._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAccuseModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm font-mono flex items-center gap-2 transition-all shadow-lg shadow-rose-600/25 active:scale-95"
            >
              <Gavel className="w-4 h-4" />
              <span>Make Accusation</span>
            </button>
          </div>
        </div>

        {/* Live Detective Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          {/* Clues Found */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">CLUES UNCOVERED</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-amber-400">
                {discoveredCluesCount} / {totalClues}
              </span>
              <span className="text-xs font-mono text-slate-400">{clueProgressPercent}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${clueProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Hints Remaining */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">HINTS AVAILABLE</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-blue-400">
                {hintsRemaining} / {totalHints}
              </span>
              <button
                onClick={() => setIsHintModalOpen(true)}
                disabled={hintsRemaining <= 0}
                className="text-[11px] font-mono font-semibold text-amber-400 hover:text-amber-300 disabled:text-slate-600 transition-colors"
              >
                + Request Hint
              </button>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-2">-10 pts per unlock</p>
          </div>

          {/* Clue Bounty Bonus */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">CLUE BOUNTY</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              +{discoveredCluesCount * 5} PTS
            </span>
            <p className="text-[10px] font-mono text-slate-500 mt-2">+5 pts per discovery</p>
          </div>

          {/* Projected Score */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">MAX VICTORY REWARD</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {projectedScore} PTS
            </span>
            <p className="text-[10px] font-mono text-slate-500 mt-2">Floored at 0 min</p>
          </div>
        </div>
      </div>

      {/* Incident Dossier / Story Briefing */}
      <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div 
          onClick={() => setStoryExpanded(!storyExpanded)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileQuestion className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              Case Briefing & Crime Scene
            </h2>
          </div>
          <button className="text-slate-400 group-hover:text-slate-200">
            {storyExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {storyExpanded && (
          <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-4 text-sm text-slate-300 leading-relaxed animate-in fade-in duration-200">
            <p className="whitespace-pre-line">{caseData.story}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Victim Card */}
              {caseData.victim && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>THE VICTIM: {caseData.victim.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{caseData.victim.description}</p>
                </div>
              )}

              {/* Crime Scene */}
              {caseData.crimeScene && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>CRIME SCENE LOCATION</span>
                  </div>
                  <p className="text-xs text-slate-400">{caseData.crimeScene}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Suspects Lineup */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Suspects Lineup</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {caseData.suspects?.length} Persons of Interest
              </span>
            </h2>
            <p className="text-xs text-slate-400">Review biographies and cross-examine stated alibis against physical clues.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {caseData.suspects?.map(suspect => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
            />
          ))}
        </div>
      </section>

      {/* Clues & Forensic Evidence */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Forensic Evidence & Clues</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {discoveredCluesCount} of {totalClues} Analyzed
              </span>
            </h2>
            <p className="text-xs text-slate-400">Inspect evidence to reveal forensic relevance and earn +5 points per clue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseData.clues?.map(clue => (
            <ClueCard
              key={clue.id}
              clue={clue}
              onDiscover={handleDiscoverClue}
            />
          ))}
        </div>
      </section>

      {/* Deductive Hints Section */}
      <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Deductive Hint Dossier</h3>
              <p className="text-xs text-slate-400 font-mono">
                {usedHints.length} Unlocked • {hintsRemaining} Remaining (-10 pts each)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHintModalOpen(true)}
            disabled={hintsRemaining <= 0}
            className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-semibold transition-all disabled:opacity-40"
          >
            {hintsRemaining > 0 ? '+ Request Hint' : 'No Hints Left'}
          </button>
        </div>

        {usedHints.length === 0 ? (
          <div className="py-6 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No hints requested yet. Solve the mystery without hints for maximum score!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {usedHints.map(hint => (
              <div
                key={hint.id}
                className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-200 leading-relaxed"
              >
                <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px] font-bold uppercase mb-1">
                  <span>HINT #{hint.order}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-rose-400">-10 PTS INCURRED</span>
                </div>
                <p>{hint.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Bottom Bar for Accusation */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-100 text-sm">Ready to Crack the Case?</h4>
          <p className="text-xs text-slate-400 font-mono">
            {discoveredCluesCount} of {totalClues} clues discovered • Current projection: {projectedScore} pts
          </p>
        </div>

        <button
          onClick={() => setIsAccuseModalOpen(true)}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 active:scale-95"
        >
          <Gavel className="w-4 h-4" />
          <span>Formally Accuse Suspect</span>
        </button>
      </div>

      {/* Modals */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        onConfirm={handleRequestHint}
        hintsRemaining={hintsRemaining}
        loading={actionLoading}
      />

      <AccusationModal
        isOpen={isAccuseModalOpen}
        onClose={() => setIsAccuseModalOpen(false)}
        suspects={caseData.suspects || []}
        onSubmit={handleSubmitAccusation}
        loading={actionLoading}
      />
    </div>
  );
}
