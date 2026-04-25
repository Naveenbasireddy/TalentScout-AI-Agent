import type { Candidate, MatchResult, ParsedJD } from '../types';

// Bidirectional skill equivalence groups.
// All skills within a group are considered equivalent for matching.
// Each skill maps to exactly one canonical form (the first in the group).
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
  ['graphql'],
];

// Build a lookup: every skill variant -> its canonical form
const CANONICAL_MAP = new Map<string, string>();
for (const group of SKILL_GROUPS) {
  const canonical = group[0];
  for (const variant of group) {
    CANONICAL_MAP.set(variant, canonical);
  }
}

// Normalize a single skill string to its canonical lowercase form
function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim().replace(/\s+/g, ' ');
  return CANONICAL_MAP.get(lower) || lower;
}

// Normalize an array of skills, deduplicating
function normalizeSkills(skills: string[]): string[] {
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

export function matchCandidates(candidates: Candidate[], jd: ParsedJD): MatchResult[] {
  const jdSkills = normalizeSkills(jd.skills);
  const jdSkillSet = new Set(jdSkills);

  return candidates.map(candidate => {
    // Normalize candidate skills
    const candidateSkillSet = new Set(normalizeSkills(candidate.skills));

    // Compute matched and missing using proper set logic
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const jdSkill of jdSkillSet) {
      if (candidateSkillSet.has(jdSkill)) {
        matchedSkills.push(jdSkill);
      } else {
        missingSkills.push(jdSkill);
      }
    }

    // Skill match percentage
    const skillMatchPct = jdSkills.length > 0
      ? (matchedSkills.length / jdSkills.length) * 100
      : 50;

    // Experience score
    let experienceScore: number;
    if (jd.experienceYears <= 0) {
      experienceScore = 100;
    } else if (candidate.experience >= jd.experienceYears) {
      experienceScore = 100;
    } else {
      experienceScore = (candidate.experience / jd.experienceYears) * 100;
    }

    // Match Score = (skill_match * 0.7) + (experience_score * 0.3)
    const matchScore = Math.round(skillMatchPct * 0.7 + experienceScore * 0.3);

    // Build explanation
    const parts: string[] = [];
    if (matchedSkills.length > 0) {
      parts.push(`Matches ${formatSkills(matchedSkills)}.`);
    }
    if (missingSkills.length > 0) {
      parts.push(`Missing ${formatSkills(missingSkills)}.`);
    }
    if (jd.experienceYears <= 0) {
      parts.push('No experience requirement specified.');
    } else if (candidate.experience >= jd.experienceYears) {
      parts.push(`Experience meets requirement (${candidate.experience} vs ${jd.experienceYears} yrs).`);
    } else {
      parts.push(`Experience below requirement (${candidate.experience} vs ${jd.experienceYears} yrs).`);
    }
    const explanation = parts.join(' ');

    return {
      candidate,
      matchScore,
      skillScore: Math.round(skillMatchPct),
      experienceScore: Math.round(experienceScore),
      matchedSkills,
      missingSkills,
      explanation,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

function formatSkills(skills: string[]): string {
  if (skills.length <= 3) return skills.join(', ');
  return skills.slice(0, 3).join(', ') + ` +${skills.length - 3} more`;
}
