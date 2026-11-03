export interface SpamIssue {
  severity: 'high' | 'medium' | 'low';
  message: string;
  fix: string;
}

export interface DeliverabilityReport {
  score: number; // 0 to 100
  status: 'excellent' | 'good' | 'warning' | 'high_risk';
  issues: SpamIssue[];
  recommendations: string[];
}

const SPAM_TRIGGER_WORDS = [
  'urgent', 'act now', 'make money', 'free money', '100% free',
  'risk-free', 'buy direct', 'order now', 'double your', 'guarantee',
  'winner', 'cash bonus', 'no catch', 'credit card required', 'congratulations'
];

export function analyzeDeliverability(subject: string, bodyText: string): DeliverabilityReport {
  const issues: SpamIssue[] = [];
  let score = 100;

  const subjectLower = (subject || '').toLowerCase();
  const bodyLower = (bodyText || '').toLowerCase();

  // 1. Check ALL-CAPS in subject
  const uppercaseLetters = (subject || '').replace(/[^a-zA-Z]/g, '');
  if (uppercaseLetters.length > 5) {
    const uppercaseRatio = (subject.match(/[A-Z]/g)?.length || 0) / uppercaseLetters.length;
    if (uppercaseRatio > 0.45) {
      score -= 25;
      issues.push({
        severity: 'high',
        message: 'Subject line contains too many ALL-CAPS words (e.g. "URGENT", "DIRECTIVE").',
        fix: 'Use Title Case or sentence case instead of ALL-CAPS to avoid Gmail spam filters.',
      });
    }
  }

  // 2. Check for spam trigger words in subject
  for (const word of SPAM_TRIGGER_WORDS) {
    if (subjectLower.includes(word)) {
      score -= 15;
      issues.push({
        severity: 'high',
        message: `Subject line contains spam trigger phrase "${word}".`,
        fix: `Replace "${word}" with professional corporate terms like "Priority Update", "Executive Memo", or "Strategic Brief".`,
      });
      break;
    }
  }

  // 3. Check for alarm emojis in subject
  if (/[🚨⚠️🔥💥💸‼️]/.test(subject)) {
    score -= 15;
    issues.push({
      severity: 'medium',
      message: 'Subject line has high-frequency alarm emojis (🚨, ⚠️, ‼️) commonly flagged by spam filters.',
      fix: 'Remove alarm emojis or replace with clean business symbols (e.g. ·, -, or plain text).',
    });
  }

  // 4. Excessive punctuation
  if (/[!?]{2,}/.test(subject) || /[!?]{3,}/.test(bodyText)) {
    score -= 10;
    issues.push({
      severity: 'medium',
      message: 'Multiple consecutive exclamation points or question marks found.',
      fix: 'Limit punctuation to a single period or question mark.',
    });
  }

  // 5. Short subject line
  if (subject.trim().length < 8) {
    score -= 10;
    issues.push({
      severity: 'low',
      message: 'Subject line is very short.',
      fix: 'Provide a descriptive subject line between 25 and 60 characters.',
    });
  }

  // Determine status
  let status: DeliverabilityReport['status'] = 'excellent';
  if (score < 50) status = 'high_risk';
  else if (score < 75) status = 'warning';
  else if (score < 90) status = 'good';

  const recommendations = [
    'Plain-text alternative MIME multipart is automatically attached by NEWARO backend.',
    'Ask key recipients to add "newaronp@gmail.com" to their Google Contacts or click "Not Spam" once to train Gmail heuristics.',
    'Always use personal worker/brand names in {{name}} for authentic engagement.',
    'Ensure email volume is paced (chunk interval set to 200-300ms).',
  ];

  return {
    score: Math.max(10, Math.min(100, score)),
    status,
    issues,
    recommendations,
  };
}

export function autoOptimizeSpam(subject: string): string {
  let cleaned = subject;

  // Remove alarm emojis
  cleaned = cleaned.replace(/[🚨⚠️🔥💥💸‼️]/g, '').trim();

  // Replace common all caps trigger words
  cleaned = cleaned
    .replace(/\bURGENT BOSS DIRECTIVE\b/gi, 'Executive Office Memo')
    .replace(/\bURGENT\b/gi, 'Priority')
    .replace(/\bDIRECTIVE\b/gi, 'Directive')
    .replace(/\bACTION REQUIRED\b/gi, 'Project Update')
    .replace(/\bMANDATORY\b/gi, 'Important');

  // Collapse double exclamation or punctuation
  cleaned = cleaned.replace(/[!?]{2,}/g, '.').replace(/\s{2,}/g, ' ').trim();

  return cleaned;
}
