import { MessageSquare, Bot, User, Mail, Send } from 'lucide-react';
import type { OutreachResult } from '../types';

interface OutreachPanelProps {
  results: OutreachResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  role: string;
  onResponseUpdate: (candidateId: string, responseStatus: OutreachResult['responseStatus']) => void;
}

function getResponseLabel(status: OutreachResult['responseStatus']): string {
  if (status === 'interested') return 'Interested';
  if (status === 'maybe') return 'Maybe';
  if (status === 'not_interested') return 'Not Interested';
  return 'Awaiting Reply';
}

export function OutreachPanel({ results, selectedId, onSelect, role, onResponseUpdate }: OutreachPanelProps) {
  const selected = results.find(r => r.candidate.id === selectedId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Outreach Simulation</h2>
          <p className="text-sm text-slate-500">Send outreach emails, capture replies, and update ranking signals</p>
        </div>
      </div>

      <div className="flex gap-6" style={{ minHeight: 360 }}>
        {/* Candidate List */}
        <div className="w-56 shrink-0 space-y-1.5 overflow-y-auto max-h-[400px]">
          {results.map(r => {
            const levelColor = r.interestLevel === 'interested'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : r.interestLevel === 'maybe'
                ? 'bg-amber-50 text-amber-700 border-amber-100'
                : 'bg-red-50 text-red-600 border-red-100';

            const levelLabel = getResponseLabel(r.responseStatus);

            return (
              <button
                key={r.candidate.id}
                onClick={() => onSelect(r.candidate.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                  selectedId === r.candidate.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium truncate">{r.candidate.name}</div>
                <div className={`text-[10px] mt-0.5 ${selectedId === r.candidate.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {r.candidate.email || 'No email in CSV'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${levelColor}`}>
                    {levelLabel}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    selectedId === r.candidate.id ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    Interest: {r.interestScore}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Panel */}
        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{selected.candidate.name}</p>
                    <p className="text-xs text-slate-500">
                      {selected.candidate.email || 'No email provided'} | Match: {selected.matchResult.matchScore}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selected.interestLevel === 'interested'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selected.interestLevel === 'maybe'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                }`}>
                  {getResponseLabel(selected.responseStatus)} ({selected.interestScore})
                </span>
              </div>

              <div className="px-4 py-3 border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={!selected.candidate.email}
                    onClick={() => {
                      const mailto = `mailto:${encodeURIComponent(selected.candidate.email)}?subject=${encodeURIComponent(selected.outreachEmailSubject)}&body=${encodeURIComponent(selected.outreachEmailBody)}`;
                      window.location.href = mailto;
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send Job Email
                  </button>
                  <span className="text-xs text-slate-500">
                    Role: {role} | Availability score: {selected.availabilityScore}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Mark candidate response:</span>
                  <button onClick={() => onResponseUpdate(selected.candidate.id, 'interested')} className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">Interested</button>
                  <button onClick={() => onResponseUpdate(selected.candidate.id, 'maybe')} className="px-2 py-1 rounded text-xs bg-amber-50 text-amber-700 border border-amber-100">Maybe</button>
                  <button onClick={() => onResponseUpdate(selected.candidate.id, 'not_interested')} className="px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-100">Not Interested</button>
                  <button onClick={() => onResponseUpdate(selected.candidate.id, 'no_response')} className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">No Response</button>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px]">
                {selected.conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.sender === 'agent' ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'agent' ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      {msg.sender === 'agent' ? (
                        <Bot className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'agent'
                        ? 'bg-slate-100 text-slate-800 rounded-tl-md'
                        : 'bg-emerald-600 text-white rounded-tr-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Select a candidate to view conversation
            </div>
          )}
        </div>
      </div>

      {/* Scoring explanation */}
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          Email is sent through your local mail client (`mailto`). Final ranking now updates based on response status + availability.
        </p>
      </div>
    </div>
  );
}
