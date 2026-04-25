import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import type { MatchResult } from '../types';

interface MatchingResultsProps {
  results: MatchResult[];
}

function getScoreColor(value: number): string {
  if (value >= 80) return 'text-emerald-700';
  if (value >= 50) return 'text-amber-700';
  return 'text-red-600';
}

function getBarColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 50) return 'bg-amber-500';
  return 'bg-red-400';
}

export function MatchingResults({ results }: MatchingResultsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Matching Results</h2>
          <p className="text-sm text-slate-500">Candidate-to-JD match analysis by Matching Agent</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">#</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Candidate</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Match Score</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Skill Match</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Exp Match</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Matched Skills</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Missing Skills</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.candidate.id}
                className={`border-b border-slate-100 last:border-0 transition-colors ${
                  i < 3 ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'
                }`}
              >
                <td className="px-4 py-3">
                  {i < 3 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {i + 1}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">{i + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{r.candidate.name}</p>
                    <p className="text-xs text-slate-400">{r.candidate.experience} yrs | {r.candidate.location}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ScoreBar value={r.matchScore} />
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.skillScore)}`}>{r.skillScore}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${getScoreColor(r.experienceScore)}`}>{r.experienceScore}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {r.matchedSkills.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs border border-emerald-100">
                        {s}
                      </span>
                    ))}
                    {r.matchedSkills.length === 0 && <span className="text-xs text-slate-400">None</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {r.missingSkills.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-xs border border-red-100">
                        {s}
                      </span>
                    ))}
                    {r.missingSkills.length === 0 && (
                      <span className="text-xs text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> All matched
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
        <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500">
          Match Score = (Skill Match % x 0.7) + (Experience Score % x 0.3). Skill Match = matched skills / total JD skills. Experience Score = 100% if met, else proportional. Top 3 highlighted.
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${getBarColor(value)} transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className={`text-xs font-semibold ${getScoreColor(value)} w-10 text-right`}>{value}</span>
    </div>
  );
}
