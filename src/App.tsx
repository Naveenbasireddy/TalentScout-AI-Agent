import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { JDInput } from './components/JDInput';
import { ParsedJDDisplay } from './components/ParsedJDDisplay';
import { CandidateUpload } from './components/CandidateUpload';
import { MatchingResults } from './components/MatchingResults';
import { OutreachPanel } from './components/OutreachPanel';
import { FinalShortlist } from './components/FinalShortlist';
import { ExplainabilityPanel } from './components/ExplainabilityPanel';
import { parseJD } from './agents/jdParser';
import { matchCandidates } from './agents/matchingAgent';
import { generateOutreach, updateOutreachResponse } from './agents/outreachAgent';
import { computeFinalResults } from './lib/scoring';
import { ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import type { AppStep, Candidate, ParsedJD, MatchResult, OutreachResult, FinalResult } from './types';

function App() {
  const persistLatestJD = useCallback((jd: ParsedJD) => {
    localStorage.setItem('talentscout.latestJD', JSON.stringify({
      rawText: jd.rawText,
      role: jd.role,
      skills: jd.skills,
      experience: jd.experience,
      experienceYears: jd.experienceYears,
      createdAt: new Date().toISOString(),
    }));
  }, []);

  const persistLatestFinalResults = useCallback((finals: FinalResult[]) => {
    localStorage.setItem('talentscout.latestFinalResults', JSON.stringify({
      rows: finals.map(r => ({
        matchScore: r.matchScore,
        interestScore: r.interestScore,
        finalScore: r.finalScore,
        recommendedAction: r.recommendedAction,
        rank: r.rank,
        explanation: r.explanation,
      })),
      createdAt: new Date().toISOString(),
    }));
  }, []);

  const [step, setStep] = useState<AppStep>('input');
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isOutreach, setIsOutreach] = useState(false);
  const [isShortlist, setIsShortlist] = useState(false);
  const [parsedJD, setParsedJD] = useState<ParsedJD | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [outreachResults, setOutreachResults] = useState<OutreachResult[]>([]);
  const [finalResults, setFinalResults] = useState<FinalResult[]>([]);
  const [selectedOutreachId, setSelectedOutreachId] = useState<string | null>(null);
  const [selectedExplainId, setSelectedExplainId] = useState<string | null>(null);

  const stepIndex = (s: AppStep) =>
    ['input', 'parsed', 'candidates', 'matching', 'outreach', 'shortlist'].indexOf(s);

  const isStepVisible = (s: AppStep) => stepIndex(step) >= stepIndex(s);

  // Step 1: Analyze JD
  const handleAnalyzeJD = useCallback(async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 800));
    const parsed = parseJD(jdText);
    setParsedJD(parsed);
    setStep('parsed');
    setIsAnalyzing(false);
    persistLatestJD(parsed);
  }, [jdText, persistLatestJD]);

  // Step 2: Proceed to candidate upload
  const handleProceedToCandidates = useCallback(() => {
    setStep('candidates');
  }, []);

  // Step 3: Candidates loaded
  const handleCandidatesLoaded = useCallback((cands: Candidate[]) => {
    setCandidates(cands);
  }, []);

  // Step 4: Run matching
  const handleRunMatching = useCallback(async () => {
    if (!parsedJD || candidates.length === 0) return;
    setIsMatching(true);
    await new Promise(r => setTimeout(r, 600));
    const results = matchCandidates(candidates, parsedJD);
    setMatchResults(results);
    setStep('matching');
    setIsMatching(false);
  }, [parsedJD, candidates]);

  // Step 5: Run outreach
  const handleRunOutreach = useCallback(async () => {
    if (!parsedJD || matchResults.length === 0) return;
    setIsOutreach(true);
    await new Promise(r => setTimeout(r, 600));
    const outreach = generateOutreach(matchResults, parsedJD.role);
    setOutreachResults(outreach);
    if (outreach.length > 0) {
      setSelectedOutreachId(outreach[0].candidate.id);
    }
    setStep('outreach');
    setIsOutreach(false);
  }, [parsedJD, matchResults]);

  // Step 6: Generate shortlist
  const handleGenerateShortlist = useCallback(async () => {
    if (outreachResults.length === 0) return;
    setIsShortlist(true);
    await new Promise(r => setTimeout(r, 400));
    const finals = computeFinalResults(outreachResults);
    setFinalResults(finals);
    if (finals.length > 0) {
      setSelectedExplainId(finals[0].candidate.id);
    }
    setStep('shortlist');
    setIsShortlist(false);
    persistLatestFinalResults(finals);
  }, [outreachResults, persistLatestFinalResults]);

  const handleResponseUpdate = useCallback((candidateId: string, responseStatus: OutreachResult['responseStatus']) => {
    if (!parsedJD) return;
    setOutreachResults(prev =>
      prev.map(or => (
        or.candidate.id === candidateId
          ? updateOutreachResponse(or, parsedJD.role, responseStatus)
          : or
      ))
    );
  }, [parsedJD]);

  const handleReset = useCallback(() => {
    setStep('input');
    setJdText('');
    setParsedJD(null);
    setCandidates([]);
    setMatchResults([]);
    setOutreachResults([]);
    setFinalResults([]);
    setSelectedOutreachId(null);
    setSelectedExplainId(null);
    setIsAnalyzing(false);
    setIsMatching(false);
    setIsOutreach(false);
    setIsShortlist(false);
  }, []);

  const selectedExplainResult = finalResults.find(r => r.candidate.id === selectedExplainId) || null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <StepIndicator currentStep={step} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Step 1: JD Input - always visible until parsed */}
        {step === 'input' && (
          <JDInput
            value={jdText}
            onChange={setJdText}
            onAnalyze={handleAnalyzeJD}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Step 2: Parsed JD - visible from 'parsed' step onward */}
        {isStepVisible('parsed') && parsedJD && (
          <div className="animate-fade-in">
            <ParsedJDDisplay jd={parsedJD} />
            {step === 'parsed' && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
                <button
                  onClick={handleProceedToCandidates}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-[0.98]"
                >
                  Continue to Candidates
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Candidate Upload - visible from 'candidates' step onward */}
        {isStepVisible('candidates') && parsedJD && (
          <div className="animate-fade-in">
            <CandidateUpload candidates={candidates} onCandidatesLoaded={handleCandidatesLoaded} />
            {step === 'candidates' && candidates.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
                <button
                  onClick={handleRunMatching}
                  disabled={isMatching}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-60"
                >
                  {isMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isMatching ? 'Running Matching Agent...' : 'Run Matching Agent'}
                  {!isMatching && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Matching Results - visible from 'matching' step onward */}
        {isStepVisible('matching') && matchResults.length > 0 && (
          <div className="animate-fade-in">
            <MatchingResults results={matchResults} />
            {step === 'matching' && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
                <button
                  onClick={handleRunOutreach}
                  disabled={isOutreach}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-60"
                >
                  {isOutreach ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isOutreach ? 'Running Outreach Agent...' : 'Run Outreach Agent'}
                  {!isOutreach && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Outreach Panel - visible from 'outreach' step onward */}
        {isStepVisible('outreach') && outreachResults.length > 0 && (
          <div className="animate-fade-in">
            <OutreachPanel
              results={outreachResults}
              selectedId={selectedOutreachId}
              onSelect={setSelectedOutreachId}
              role={parsedJD?.role || 'this role'}
              onResponseUpdate={handleResponseUpdate}
            />
            {step === 'outreach' && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
                <button
                  onClick={handleGenerateShortlist}
                  disabled={isShortlist}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-60"
                >
                  {isShortlist ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isShortlist ? 'Generating Shortlist...' : 'Generate Final Shortlist'}
                  {!isShortlist && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Final Shortlist */}
        {step === 'shortlist' && finalResults.length > 0 && (
          <div className="animate-fade-in space-y-8">
            <FinalShortlist results={finalResults} />
            <ExplainabilityPanel result={selectedExplainResult} />

            {finalResults.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {finalResults.map(r => (
                  <button
                    key={r.candidate.id}
                    onClick={() => setSelectedExplainId(r.candidate.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedExplainId === r.candidate.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r.candidate.name}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start New Search
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
          TalentScout AI Agent — Intelligent Hiring Assistant
        </div>
      </footer>
    </div>
  );
}

export default App;
