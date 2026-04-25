import { Upload, Users, Database } from 'lucide-react';
import { useRef, useState } from 'react';
import { parseCSV, SAMPLE_CANDIDATES, generateSampleCSV } from '../lib/csvParser';
import type { Candidate } from '../types';

interface CandidateUploadProps {
  candidates: Candidate[];
  onCandidatesLoaded: (candidates: Candidate[]) => void;
}

export function CandidateUpload({ candidates, onCandidatesLoaded }: CandidateUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setError('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setError('No valid candidates found in CSV');
          return;
        }
        onCandidatesLoaded(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSample = () => {
    setError('');
    onCandidatesLoaded(SAMPLE_CANDIDATES);
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_candidates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Candidate Data</h2>
          <p className="text-sm text-slate-500">Upload CSV or use sample dataset</p>
        </div>
      </div>

      {candidates.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
              <Users className="w-3.5 h-3.5" />
              {candidates.length} candidates loaded
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Skills</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Exp (yrs)</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Availability</th>
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 6).map(c => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-700 text-xs">{c.email || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">{s}</span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-xs">+{c.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.experience}</td>
                    <td className="px-4 py-3 text-slate-700">{c.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.availability === 'Immediate' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {candidates.length > 6 && (
              <div className="px-4 py-2 text-xs text-slate-400 text-center border-t border-slate-100">
                Showing 6 of {candidates.length} candidates
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50/50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">Drop CSV file here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Columns: Name, Email, Skills, Experience, Location, Availability</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <div className="flex items-center gap-4 mt-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSample}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Database className="w-4 h-4" />
              Use Sample Dataset
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <Upload className="w-4 h-4" />
              Download Sample CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
