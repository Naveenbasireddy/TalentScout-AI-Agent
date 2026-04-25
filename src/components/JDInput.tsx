import { FileText, Sparkles } from 'lucide-react';

interface JDInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function JDInput({ value, onChange, onAnalyze, isAnalyzing }: JDInputProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Job Description Input</h2>
          <p className="text-sm text-slate-500">Paste a job description for AI analysis</p>
        </div>
      </div>

      <textarea
        className="w-full h-56 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all placeholder:text-slate-400"
        placeholder="Paste your job description here...&#10;&#10;Example: We are looking for a Senior Python Developer with 5+ years of experience in Flask, SQL, Docker, and AWS. The ideal candidate should have experience building REST APIs and working in agile teams..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-slate-400">{value.length} characters</span>
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isAnalyzing}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-500/20 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze JD'}
        </button>
      </div>
    </div>
  );
}
