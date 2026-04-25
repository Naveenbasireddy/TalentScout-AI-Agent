import type { FinalResult, OutreachResult } from '../types';

export function computeFinalResults(outreachResults: OutreachResult[]): FinalResult[] {
  const results = outreachResults.map(or => {
    const skillScore = or.matchResult.skillScore;
    const experienceScore = or.matchResult.experienceScore;
    const availabilityScore = or.availabilityScore;

    // Final score weighted across all major hiring dimensions.
    // Skills 40%, Experience 25%, Availability 15%, Candidate Interest 20%.
    const finalScore = Math.round(
      skillScore * 0.4 +
      experienceScore * 0.25 +
      availabilityScore * 0.15 +
      or.interestScore * 0.2
    );

    // Recommended action based on final score
    let recommendedAction: FinalResult['recommendedAction'];
    if (finalScore >= 80) {
      recommendedAction = 'Proceed to interview';
    } else if (finalScore >= 50) {
      recommendedAction = 'Keep warm';
    } else {
      recommendedAction = 'Reject';
    }

    return {
      rank: 0,
      candidate: or.candidate,
      skillScore,
      experienceScore,
      availabilityScore,
      matchScore: or.matchResult.matchScore,
      interestScore: or.interestScore,
      finalScore,
      explanation: or.matchResult.explanation,
      recommendedAction,
      conversation: or.conversation,
      matchedSkills: or.matchResult.matchedSkills,
      missingSkills: or.matchResult.missingSkills,
    };
  });

  // Sort by final score descending
  results.sort((a, b) => b.finalScore - a.finalScore);
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}