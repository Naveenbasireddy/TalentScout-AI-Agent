import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Briefcase, Gauge } from 'lucide-react';
import type { FinalResult } from '../types';

interface ExplainabilityPanelProps {
  result: FinalResult | null;
}

export function ExplainabilityPanel({ result }: ExplainabilityPanelProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Explainability Panel</h2>
            <p className="text-sm text-slate-500">Select a candidate to see why they matched</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 text-center py-8">Click on a candidate in the shortlist to view detailed reasoning</p>
      </div>
    );
  }

  const confidence = result.finalScore >= 80 ? 'High' : result.finalScore >= 50 ? 'Medium' : 'Low';
  const confidenceColor = result.finalScore >= 80 ? 'text-emerald-600' : result.finalScore >= 50 ? 'text-amber-600' : 'text-red-500';
  const confidenceBg = result.finalScore >= 80 ? 'bg-emerald-50 border-emerald-200' : result.finalScore >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
  const confidencePercent = result.finalScore >= 80 ? 90 : result.finalScore >= 50 ? 60 : 25;

  const skillMatchPct = result.matchedSkills.length + result.missingSkills.length > 0
    ? Math.round((result.matchedSkills.length / (result.matchedSkills.length + result.missingSkills.length)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Why {result.candidate.name}?</h2>
          <p className="text-sm text-slate-500">Detailed match reasoning and AI analysis</p>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-6 ${confidenceBg}`}>
        <Gauge className={`w-5 h-5 ${confidenceColor}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-bold ${confidenceColor}`}>Confidence: {confidence}</span>
            <span className={`text-xs font-semibold ${confidenceColor}`}>{confidencePercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                result.finalScore >= 80 ? 'bg-emerald-500' : result.finalScore >= 50 ? 'bg-amber-500' : 'bg-red-400'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Matched Skills */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Matched Skills</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              {result.matchedSkills.length}/{result.matchedSkills.length + result.missingSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSkills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                {s}
              </span>
            ))}
            {result.matchedSkills.length === 0 && <span className="text-xs text-slate-400">No skills matched</span>}
          </div>
          {skillMatchPct > 0 && (
            <div className="mt-2 text-xs text-emerald-600 font-medium">
              Skill coverage: {skillMatchPct}%
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Missing Skills ({result.missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-red-100 text-red-600 text-xs font-medium border border-red-200">
                {s}
              </span>
            ))}
            {result.missingSkills.length === 0 && <span className="text-xs text-emerald-500 font-medium">All required skills matched!</span>}
          </div>
        </div>

        {/* Experience Fit */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Experience Fit</span>
          </div>
          <p className="text-sm text-slate-600">
            {result.explanation.includes('meets requirement')
              ? `${result.candidate.name} meets the experience requirement.`
              : result.explanation.includes('below requirement')
                ? `${result.candidate.name} is below the experience requirement.`
                : 'No specific experience requirement.'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Score Breakdown</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600">Match Score</span>
                <span className="font-semibold text-slate-900">{result.matchScore}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.matchScore >= 70 ? 'bg-emerald-500' : result.matchScore >= 40 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(result.matchScore, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">Weight: 60%</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600">Interest Score</span>
                <span className="font-semibold text-slate-900">{result.interestScore}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.interestScore >= 70 ? 'bg-emerald-500' : result.interestScore >= 40 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${result.interestScore}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">Weight: 40%</div>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Final Score</span>
              <span className={`text-2xl font-bold ${confidenceColor}`}>{result.finalScore}</span>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">AI Explanation</span>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">{result.explanation}</p>
        </div>

        {/* Recruiter Recommendation */}
        <div className={`p-4 rounded-xl border ${
          result.recommendedAction === 'Proceed to interview'
            ? 'bg-emerald-50/50 border-emerald-200'
            : result.recommendedAction === 'Keep warm'
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-red-50/50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-4 h-4 ${
              result.recommendedAction === 'Proceed to interview' ? 'text-emerald-600' : result.recommendedAction === 'Keep warm' ? 'text-amber-600' : 'text-red-500'
            }`} />
            <span className={`text-sm font-semibold ${
              result.recommendedAction === 'Proceed to interview' ? 'text-emerald-700' : result.recommendedAction === 'Keep warm' ? 'text-amber-700' : 'text-red-600'
            }`}>Recruiter Recommendation</span>
          </div>
          <p className={`text-sm leading-relaxed ${
            result.recommendedAction === 'Proceed to interview' ? 'text-emerald-800' : result.recommendedAction === 'Keep warm' ? 'text-amber-800' : 'text-red-700'
          }`}>
            {result.recommendedAction === 'Proceed to interview'
              ? `Strong candidate — schedule a technical interview promptly. ${result.candidate.name} matches ${result.matchedSkills.length} of ${result.matchedSkills.length + result.missingSkills.length} required skills and meets experience requirements.`
              : result.recommendedAction === 'Keep warm'
                ? `Potential fit with some gaps. ${result.candidate.name} matches ${result.matchedSkills.length} of ${result.matchedSkills.length + result.missingSkills.length} skills.${result.missingSkills.length > 0 ? ` Consider a screening call to assess ${result.missingSkills.slice(0, 2).join(' and ')} capabilities.` : ''}`
                : `Below threshold for this role. ${result.candidate.name} only matches ${result.matchedSkills.length} of ${result.matchedSkills.length + result.missingSkills.length} required skills.${result.missingSkills.length > 0 ? ` Missing critical: ${result.missingSkills.slice(0, 3).join(', ')}.` : ''} Keep on file for future roles.`}
          </p>
        </div>
      </div>
    </div>
  );
}
