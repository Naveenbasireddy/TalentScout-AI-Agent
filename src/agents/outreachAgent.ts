import type { ChatMessage, MatchResult, OutreachResult } from '../types';

function buildOutreachEmail(role: string, result: MatchResult): { subject: string; body: string } {
  const { candidate, matchedSkills, missingSkills } = result;
  const matchedLine = matchedSkills.length > 0
    ? `We noticed your experience in ${matchedSkills.slice(0, 4).join(', ')}.`
    : 'Your profile looks relevant for this opportunity.';
  const gapLine = missingSkills.length > 0
    ? `If you also have exposure to ${missingSkills.slice(0, 2).join(' and ')}, that would be a plus.`
    : 'Your current skill set appears to align well with the role requirements.';

  const subject = `Opportunity: ${role} role at our team`;
  const body = [
    `Hi ${candidate.name},`,
    '',
    `I am reaching out regarding an open ${role} role.`,
    matchedLine,
    gapLine,
    `Based on initial screening, your profile match score is ${result.matchScore}/100.`,
    '',
    'If interested, please reply with one of: Interested / Maybe / Not Interested, and your earliest joining availability.',
    '',
    'Best regards,',
    'TalentScout Recruitment Team',
  ].join('\n');

  return { subject, body };
}

export function getAvailabilityScore(availability: string): number {
  const normalized = availability.trim().toLowerCase();
  if (!normalized) return 60;
  if (normalized.includes('immediate')) return 100;
  if (normalized.includes('15')) return 80;
  if (normalized.includes('2 week') || normalized.includes('two week')) return 75;
  if (normalized.includes('30') || normalized.includes('1 month')) return 60;
  if (normalized.includes('45') || normalized.includes('60')) return 40;
  return 60;
}

export function getInterestFromResponse(responseStatus: OutreachResult['responseStatus']): {
  interestLevel: OutreachResult['interestLevel'];
  interestScore: number;
} {
  if (responseStatus === 'interested') return { interestLevel: 'interested', interestScore: 100 };
  if (responseStatus === 'maybe') return { interestLevel: 'maybe', interestScore: 60 };
  if (responseStatus === 'not_interested') return { interestLevel: 'not_interested', interestScore: 0 };
  return { interestLevel: 'maybe', interestScore: 40 };
}

function buildConversation(
  role: string,
  result: MatchResult,
  responseStatus: OutreachResult['responseStatus'],
): ChatMessage[] {
  const now = Date.now();
  const email = buildOutreachEmail(role, result);
  const responseText = responseStatus === 'interested'
    ? 'Interested. Please share interview slots.'
    : responseStatus === 'maybe'
      ? 'Maybe interested. Need more details on compensation and role scope.'
      : responseStatus === 'not_interested'
        ? 'Not interested at the moment.'
        : 'Awaiting candidate response.';

  const conversation: ChatMessage[] = [
    {
      sender: 'agent',
      text: `Outreach email prepared: "${email.subject}"`,
      timestamp: now,
    },
    {
      sender: 'candidate',
      text: responseText,
      timestamp: now + 2000,
    },
  ];

  return conversation;
}

export function generateOutreach(matchResults: MatchResult[], role: string): OutreachResult[] {
  return matchResults.map(result => {
    const { candidate } = result;
    const responseStatus: OutreachResult['responseStatus'] = 'no_response';
    const { interestLevel, interestScore } = getInterestFromResponse(responseStatus);
    const { subject, body } = buildOutreachEmail(role, result);

    return {
      candidate,
      matchResult: result,
      conversation: buildConversation(role, result, responseStatus),
      outreachEmailSubject: subject,
      outreachEmailBody: body,
      responseStatus,
      interestLevel,
      interestScore,
      availabilityScore: getAvailabilityScore(candidate.availability),
    };
  });
}

export function updateOutreachResponse(
  outreach: OutreachResult,
  role: string,
  responseStatus: OutreachResult['responseStatus'],
): OutreachResult {
  const { interestLevel, interestScore } = getInterestFromResponse(responseStatus);
  return {
    ...outreach,
    responseStatus,
    interestLevel,
    interestScore,
    conversation: buildConversation(role, outreach.matchResult, responseStatus),
  };
}