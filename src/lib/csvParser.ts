import Papa from 'papaparse';
import type { Candidate } from '../types';

let idCounter = 0;

// Same canonical map as matchingAgent.ts - keep in sync
const SKILL_GROUPS: string[][] = [
  ['python', 'python3'],
  ['javascript', 'js', 'es6', 'es2015'],
  ['typescript', 'ts'],
  ['react', 'reactjs', 'react.js'],
  ['angular', 'angularjs'],
  ['vue', 'vuejs', 'vue.js'],
  ['node', 'nodejs', 'node.js'],
  ['java'],
  ['spring', 'spring boot'],
  ['go', 'golang'],
  ['rust'],
  ['csharp', 'c#', '.net', 'asp.net'],
  ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mssql'],
  ['mongodb', 'mongo'],
  ['redis'],
  ['docker', 'containerization'],
  ['kubernetes', 'k8s'],
  ['aws', 'amazon web services'],
  ['gcp', 'google cloud'],
  ['azure', 'microsoft azure'],
  ['flask'],
  ['django'],
  ['fastapi'],
  ['express', 'expressjs', 'express.js'],
  ['graphql'],
  ['rest', 'rest api', 'restful'],
  ['git', 'github', 'gitlab'],
  ['ci_cd', 'ci/cd', 'cicd', 'jenkins', 'github actions', 'circleci'],
  ['machine_learning', 'ml', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'ai'],
  ['data_science', 'pandas', 'numpy', 'jupyter', 'data analysis'],
  ['agile', 'scrum', 'kanban'],
  ['testing', 'jest', 'pytest', 'cypress', 'selenium', 'unit test', 'tdd'],
  ['html', 'html5'],
  ['css', 'css3', 'scss', 'sass', 'tailwind', 'tailwindcss', 'bootstrap'],
  ['figma'],
  ['nextjs', 'next.js'],
  ['kafka', 'apache kafka'],
  ['elasticsearch'],
  ['terraform', 'iac'],
  ['linux', 'ubuntu', 'centos', 'unix'],
  ['swift', 'ios'],
  ['kotlin', 'android'],
  ['flutter', 'dart'],
  ['ruby', 'rails', 'ruby on rails'],
  ['php', 'laravel'],
  ['sap'],
  ['tableau'],
  ['powerbi', 'power bi'],
  ['excel', 'spreadsheet'],
  ['jira', 'confluence'],
  ['microservices'],
];

const CANONICAL_MAP = new Map<string, string>();
for (const group of SKILL_GROUPS) {
  const canonical = group[0];
  for (const variant of group) {
    CANONICAL_MAP.set(variant, canonical);
  }
}

function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim().replace(/\s+/g, ' ');
  return CANONICAL_MAP.get(lower) || lower;
}

function splitSkillsField(rawSkills: string): string[] {
  const raw = rawSkills.trim();
  if (!raw) return [];

  // Standard CSV format: comma/semicolon/pipe/slash separated skills.
  const separated = raw.split(/[,;|\/]+/).map(s => s.trim()).filter(Boolean);
  if (separated.length > 1) return separated;

  // Fallback for space-separated datasets: "Python Flask SQL".
  // Match longest known skill phrase first (e.g. "machine learning", "rest api").
  const words = raw
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  const parsed: string[] = [];
  const maxPhraseWords = 3;
  let index = 0;

  while (index < words.length) {
    let matched = false;

    for (let size = Math.min(maxPhraseWords, words.length - index); size >= 1; size--) {
      const phrase = words.slice(index, index + size).join(' ');
      if (CANONICAL_MAP.has(phrase)) {
        parsed.push(phrase);
        index += size;
        matched = true;
        break;
      }
    }

    if (!matched) {
      parsed.push(words[index]);
      index += 1;
    }
  }

  return parsed;
}

function normalizeSkillsArray(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const skill of skills) {
    const canonical = normalizeSkill(skill);
    if (!seen.has(canonical)) {
      seen.add(canonical);
      result.push(canonical);
    }
  }
  return result;
}

export function parseCSV(text: string): Candidate[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase(),
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`CSV parsing failed: ${result.errors[0].message}`);
  }

  return result.data
    .filter(row => row.name && row.name.trim())
    .map(row => ({
      id: `c-${++idCounter}-${Date.now()}`,
      name: (row.name || '').trim(),
      email: (row.email || row.emailid || row['email id'] || row.mail || row.mailid || row['mail id'] || '').trim(),
      skills: normalizeSkillsArray(splitSkillsField(row.skills || '')),
      experience: parseInt(row.experience || '0', 10) || 0,
      location: (row.location || '').trim(),
      availability: (row.availability || 'Available').trim(),
    }));
}

// Sample candidates with skills already in canonical form
export const SAMPLE_CANDIDATES: Candidate[] = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', skills: ['python', 'flask', 'sql', 'docker', 'aws'], experience: 5, location: 'Bangalore', availability: 'Immediate' },
  { id: 's2', name: 'Priya Patel', email: 'priya.patel@example.com', skills: ['python', 'django', 'react', 'sql', 'redis'], experience: 4, location: 'Mumbai', availability: '2 weeks' },
  { id: 's3', name: 'Alex Chen', email: 'alex.chen@example.com', skills: ['java', 'spring', 'kubernetes', 'aws', 'sql'], experience: 7, location: 'San Francisco', availability: '1 month' },
  { id: 's4', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', skills: ['python', 'machine_learning', 'sql', 'data_science'], experience: 3, location: 'New York', availability: 'Immediate' },
  { id: 's5', name: 'David Kim', email: 'david.kim@example.com', skills: ['javascript', 'react', 'node', 'mongodb', 'docker'], experience: 6, location: 'Seoul', availability: '2 weeks' },
  { id: 's6', name: 'Emily Davis', email: 'emily.davis@example.com', skills: ['python', 'fastapi', 'docker', 'aws', 'ci_cd'], experience: 4, location: 'London', availability: 'Immediate' },
  { id: 's7', name: 'Michael Brown', email: 'michael.brown@example.com', skills: ['csharp', 'azure', 'sql', 'docker'], experience: 8, location: 'Chicago', availability: '1 month' },
  { id: 's8', name: 'Aisha Khan', email: 'aisha.khan@example.com', skills: ['python', 'django', 'aws', 'sql', 'redis'], experience: 5, location: 'Dubai', availability: 'Immediate' },
  { id: 's9', name: 'James Wilson', email: 'james.wilson@example.com', skills: ['go', 'docker', 'kubernetes', 'aws', 'microservices'], experience: 6, location: 'Austin', availability: '2 weeks' },
  { id: 's10', name: 'Lisa Wang', email: 'lisa.wang@example.com', skills: ['python', 'data_science', 'sql', 'tableau', 'excel'], experience: 2, location: 'Shanghai', availability: '1 month' },
  { id: 's11', name: 'Carlos Martinez', email: 'carlos.martinez@example.com', skills: ['react', 'typescript', 'node', 'graphql', 'docker'], experience: 5, location: 'Mexico City', availability: 'Immediate' },
  { id: 's12', name: 'Fatima Al-Rashid', email: 'fatima.rashid@example.com', skills: ['python', 'flask', 'sql', 'docker', 'git'], experience: 3, location: 'Riyadh', availability: '2 weeks' },
];

export function generateSampleCSV(): string {
  const header = 'Name,Email,Skills,Experience,Location,Availability';
  const rows = SAMPLE_CANDIDATES.map(c =>
    `${c.name},${c.email},"${c.skills.join(', ')}",${c.experience},${c.location},${c.availability}`
  );
  return [header, ...rows].join('\n');
}
