import { Check } from 'lucide-react';
import type { AppStep } from '../types';

const STEPS: { key: AppStep; label: string }[] = [
  { key: 'input', label: 'JD Input' },
  { key: 'parsed', label: 'Parse JD' },
  { key: 'candidates', label: 'Candidates' },
  { key: 'matching', label: 'Matching' },
  { key: 'outreach', label: 'Outreach' },
  { key: 'shortlist', label: 'Shortlist' },
];

interface StepIndicatorProps {
  currentStep: AppStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/30'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${
                  isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${
                  i < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
