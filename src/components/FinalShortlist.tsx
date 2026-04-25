import { Trophy, Download, Award, Flame, Star, ArrowRight, Crown } from 'lucide-react';
import type { FinalResult } from '../types';
import { exportResultsCSV } from '../lib/export';

interface FinalShortlistProps {
  results: FinalResult[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-500';
}

function getBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-400';
}

function getActionStyle(action: FinalResult['recommendedAction']) {
  if (action === 'Proceed to interview') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (action === 'Keep warm') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-600 border-red-200';
}

export function FinalShortlist({ results }: FinalShortlistProps) {
  const top3 = results.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Final Shortlist</h2>
            <p className="text-sm text-slate-500">Ranked candidates with AI recommendations</p>
          </div>
        </div>
        <button
          onClick={() => exportResultsCSV(results)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Top 3 Cards */}
      {top3.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">Top 3 Recommendations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {top3.map((r, i) => (
              <div
                key={r.candidate.id}
                className={`relative rounded-xl p-5 border-2 transition-all ${
                  i === 0
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-100/50'
                    : i === 1
                      ? 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 shadow-md'
                      : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md shadow-amber-100/50'
                }`}
              >
                <div className="absolute -top-3 left-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    i === 0
                      ? 'bg-emerald-500 text-white'
                      : i === 1
                        ? 'bg-slate-500 text-white'
                        : 'bg-amber-500 text-white'
                  }`}>
                    {i === 0 ? <Flame className="w-3 h-3" /> : i === 1 ? <Star className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                    #{r.rank}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-lg font-bold text-slate-900">{r.candidate.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.candidate.location} | {r.candidate.experience} yrs exp</p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Final Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(r.finalScore)}`}>
                      {r.finalScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Skill: {r.skillScore}</span>
                    <span className="text-slate-500">Exp: {r.experienceScore}</span>
                    <span className="text-slate-500">Avail: {r.availabilityScore}</span>
                    <span className="text-slate-500">Interest: {r.interestScore}</span>
                  </div>
                </div>

                {/* Matched skills preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {r.matchedSkills.slice(0, 3).map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-700 text-[10px] font-medium">{s}</span>
                  ))}
                  {r.matchedSkills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">+{r.matchedSkills.length - 3}</span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionStyle(r.recommendedAction)}`}>
                    <ArrowRight className="w-3 h-3" />
                    {r.recommendedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Ranking Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600 w-16">Rank</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Skill</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Experience</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Availability</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Interest</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Final Score</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Explanation</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr
                key={r.candidate.id}
                className={`border-b border-slate-100 last:border-0 transition-colors ${
                  r.rank <= 3 ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'
                }`}
              >
                <td className="px-4 py-3">
                  {r.rank <= 3 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {r.rank}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs pl-2">{r.rank}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{r.candidate.name}</p>
                    <p className="text-xs text-slate-400">{r.candidate.location} | {r.candidate.experience} yrs</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.skillScore)}`}>
                    {r.skillScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.experienceScore)}`}>
                    {r.experienceScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.availabilityScore)}`}>
                    {r.availabilityScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.interestScore)}`}>
                    {r.interestScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(r.finalScore)}`}
                        style={{ width: `${Math.min(r.finalScore, 100)}%` }}
                      />
                    </div>
                    <span className={`font-bold text-sm ${getScoreColor(r.finalScore)}`}>
                      {r.finalScore}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 max-w-xs leading-relaxed">{r.explanation}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionStyle(r.recommendedAction)}`}>
                    {r.recommendedAction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-xs text-slate-500">
          Final Score = (Skills x 0.4) + (Experience x 0.25) + (Availability x 0.15) + (Interest x 0.2). Availability examples: Immediate=100, 15 days=80, 30 days=60. Actions: 80+ = Proceed to interview, 50-79 = Keep warm, below 50 = Reject.
        </p>
      </div>
    </div>
  );
}
