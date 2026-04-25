import { Target, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import type { ParsedJD } from '../types';

interface ParsedJDDisplayProps {
  jd: ParsedJD;
}

export function ParsedJDDisplay({ jd }: ParsedJDDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Parsed Job Description</h2>
          <p className="text-sm text-slate-500">AI-extracted requirements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{jd.role}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{jd.experience}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills ({jd.skills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jd.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100"
              >
                {skill}
              </span>
            ))}
            {jd.skills.length === 0 && (
              <span className="text-sm text-slate-400">No skills detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
