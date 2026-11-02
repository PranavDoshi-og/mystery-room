import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Settings, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';
import { caseApi, getBaseUrl } from '../api/caseApi';

export default function Navbar() {
  const location = useLocation();
  const [apiOnline, setApiOnline] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [configMessage, setConfigMessage] = useState(null);

  const checkStatus = () => {
    setApiOnline(null);
    caseApi.checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  };

  useEffect(() => {
    checkStatus();
    setInputUrl(getBaseUrl());
  }, [location.pathname]);

  const handleSaveUrl = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setTesting(true);
    setConfigMessage(null);

    try {
      const clean = caseApi.setApiUrl(inputUrl);
      setInputUrl(clean);
      const res = await caseApi.checkHealth(clean);
      if (res && res.status === 'ok') {
        setApiOnline(true);
        setConfigMessage({ type: 'success', text: 'Connected successfully to backend!' });
        setTimeout(() => setIsConfigOpen(false), 1200);
      } else {
        throw new Error('Health check returned invalid response');
      }
    } catch (err) {
      setApiOnline(false);
      setConfigMessage({
        type: 'error',
        text: `Could not connect: ${err.message}. If using Render free tier, wait ~45s for cold start.`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    caseApi.resetApiUrl();
    const defaultUrl = getBaseUrl();
    setInputUrl(defaultUrl);
    checkStatus();
    setConfigMessage({ type: 'info', text: 'Reset to default build URL.' });
  };

  return (
    <>
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
            {/* Status Pill & Settings Trigger */}
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono transition-colors"
              title="Click to configure backend API URL"
            >
              <span className={`w-2 h-2 rounded-full ${apiOnline === true ? 'bg-emerald-400 animate-pulse' : apiOnline === false ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'}`} />
              <span className={apiOnline === true ? 'text-emerald-400 font-semibold' : apiOnline === false ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                {apiOnline === true ? 'SYSTEM ONLINE' : apiOnline === false ? 'API OFFLINE' : 'CHECKING...'}
              </span>
              <Settings className="w-3 h-3 text-slate-500 hover:text-slate-300 ml-0.5" />
            </button>

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

      {/* Backend API Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Backend API Connection</h3>
                <p className="text-xs text-slate-400 font-mono">Connect this website to your deployed Render/Railway server</p>
              </div>
            </div>

            {configMessage && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-start gap-2 ${
                configMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' :
                configMessage.type === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' :
                'bg-blue-500/10 border border-blue-500/30 text-blue-300'
              }`}>
                {configMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{configMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Render / Backend API URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://mystery-room.onrender.com/api"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Paste your Render Web Service URL here (e.g. <code>https://your-app.onrender.com/api</code>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                <p className="text-slate-300 font-bold">ℹ️ Render Free Tier Tip:</p>
                <p>Render puts free web services to sleep. If it takes ~45 seconds on first request, wait a moment and click "Test & Connect" again!</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={testing}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Testing Health...</span>
                      </>
                    ) : (
                      <span>Test & Connect</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
