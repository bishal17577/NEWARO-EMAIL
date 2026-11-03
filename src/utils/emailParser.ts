export interface ParseResult {
  validEmails: string[];
  invalidEmails: string[];
  duplicateCount: number;
  totalParsed: number;
  exceedsLimit: boolean;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function parseEmailList(rawInput: string, maxLimit = 400): ParseResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      validEmails: [],
      invalidEmails: [],
      duplicateCount: 0,
      totalParsed: 0,
      exceedsLimit: false,
    };
  }

  // Split by comma, semicolon, newline, carriage return, tabs
  const tokens = rawInput
    .split(/[\r\n,;\t]+/)
    .map(token => token.trim())
    .filter(token => token.length > 0);

  const seen = new Set<string>();
  const validEmails: string[] = [];
  const invalidEmails: string[] = [];
  let duplicateCount = 0;

  for (const token of tokens) {
    // Strip common wrapper characters like quotes or angle brackets: <user@domain.com>
    const cleanToken = token.replace(/^[<"']+|[>"']+$/g, '').trim();
    if (!cleanToken) continue;

    const lower = cleanToken.toLowerCase();

    if (EMAIL_REGEX.test(cleanToken)) {
      if (seen.has(lower)) {
        duplicateCount++;
      } else {
        seen.add(lower);
        validEmails.push(cleanToken);
      }
    } else {
      invalidEmails.push(cleanToken);
    }
  }

  return {
    validEmails,
    invalidEmails,
    duplicateCount,
    totalParsed: validEmails.length,
    exceedsLimit: validEmails.length > maxLimit,
  };
}

export function parseCsvFile(content: string, maxLimit = 400): ParseResult {
  // Try to find emails across all CSV cells
  return parseEmailList(content, maxLimit);
}
