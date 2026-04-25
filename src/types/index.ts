export interface ParsedJD {
  role: string;
  skills: string[];
  experience: string;
  experienceYears: number;
  rawText: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  availability: string;
}

export interface MatchResult {
  candidate: Candidate;
  matchScore: number;
  skillScore: number;
  experienceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface OutreachResult {
  candidate: Candidate;
  matchResult: MatchResult;
  conversation: ChatMessage[];
  outreachEmailSubject: string;
  outreachEmailBody: string;
  responseStatus: 'no_response' | 'interested' | 'maybe' | 'not_interested';
  interestLevel: 'interested' | 'maybe' | 'not_interested';
  interestScore: number;
  availabilityScore: number;
}

export interface ChatMessage {
  sender: 'agent' | 'candidate';
  text: string;
  timestamp: number;
}

export interface FinalResult {
  rank: number;
  candidate: Candidate;
  skillScore: number;
  experienceScore: number;
  availabilityScore: number;
  matchScore: number;
  interestScore: number;
  finalScore: number;
  explanation: string;
  recommendedAction: 'Proceed to interview' | 'Keep warm' | 'Reject';
  conversation: ChatMessage[];
  matchedSkills: string[];
  missingSkills: string[];
}

export type AppStep = 'input' | 'parsed' | 'candidates' | 'matching' | 'outreach' | 'shortlist';
