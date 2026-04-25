import { Brain, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              TalentScout AI Agent
            </h1>
            <p className="text-emerald-400 font-medium text-lg mt-1">
              Intelligent Hiring Assistant
            </p>
          </div>
        </div>
        <p className="text-slate-400 max-w-2xl text-base leading-relaxed mt-4">
          Parse job descriptions, match candidates with explainable scoring, simulate outreach conversations, and generate a ranked shortlist — all powered by AI agents.
        </p>
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>3 AI Agents</span>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <span className="text-sm text-slate-400">JD Parser + Matching + Outreach</span>
          <div className="w-px h-4 bg-slate-600" />
          <span className="text-sm text-slate-400">Explainable Scoring</span>
        </div>
      </div>
    </header>
  );
}
