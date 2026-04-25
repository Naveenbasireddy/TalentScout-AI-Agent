import type { FinalResult } from '../types';

export function exportResultsCSV(results: FinalResult[]): void {
  const header = 'Rank,Name,Email,Skill Score,Experience Score,Availability Score,Match Score,Interest Score,Final Score,Recommended Action,Matched Skills,Missing Skills,Explanation';
  const rows = results.map(r =>
    [
      r.rank,
      `"${r.candidate.name}"`,
      `"${r.candidate.email || ''}"`,
      r.skillScore,
      r.experienceScore,
      r.availabilityScore,
      r.matchScore,
      r.interestScore,
      r.finalScore,
      `"${r.recommendedAction}"`,
      `"${r.matchedSkills.join(', ')}"`,
      `"${r.missingSkills.join(', ')}"`,
      `"${r.explanation}"`,
    ].join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'talentscout_results.csv';
  link.click();
  URL.revokeObjectURL(url);
}
