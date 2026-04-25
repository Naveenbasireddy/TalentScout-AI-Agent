import type { ParsedJD } from '../types';

// Skill detection patterns: each maps to a canonical lowercase skill name.
// ORDER MATTERS: more specific patterns must come BEFORE generic ones.
// We use a two-pass approach: first scan for multi-word/compound terms,
// then single-word terms with context awareness.

// Pass 1: Multi-word and compound skill patterns (high confidence)
const COMPOUND_PATTERNS: [RegExp, string][] = [
  // Cloud providers (multi-word first)
  [/\bamazon\s+web\s+services\b/i, 'aws'],
  [/\bgoogle\s+cloud\b/i, 'gcp'],
  [/\bmicrosoft\s+azure\b/i, 'azure'],

  // Frameworks with suffixes (specific before generic)
  [/\bspring\s+boot\b/i, 'spring'],
  [/\bruby\s+on\s+rails\b/i, 'ruby'],
  [/\bnext\.?js\b/i, 'nextjs'],
  [/\bnode\.?js\b/i, 'node'],
  [/\breact\.?js\b/i, 'react'],
  [/\bvue\.?js\b/i, 'vue'],
  [/\bangularjs\b/i, 'angular'],
  [/\bexpress\.?js\b/i, 'express'],
  [/\btailwind\s*css\b/i, 'css'],
  [/\btailwindcss\b/i, 'css'],
  [/\bapache\s+kafka\b/i, 'kafka'],
  [/\bpower\s*bi\b/i, 'powerbi'],
  [/\basp\.net\b/i, 'csharp'],
  [/\bscikit[\s-]?learn\b/i, 'machine_learning'],

  // Compound terms
  [/\bmachine\s+learning\b/i, 'machine_learning'],
  [/\bdeep\s+learning\b/i, 'machine_learning'],
  [/\bdata\s+science\b/i, 'data_science'],
  [/\bdata\s+analysis\b/i, 'data_science'],
  [/\bunit\s+test(?:ing|s)?\b/i, 'testing'],
  [/\bci\/cd\b/i, 'ci_cd'],
  [/\bgitlab\b/i, 'git'],
  [/\bgithub\s+actions\b/i, 'ci_cd'],
  [/\bgithub\b/i, 'git'],
  [/\brest\s+api\b/i, 'rest'],
  [/\brestful\b/i, 'rest'],
  [/\bhtml5\b/i, 'html'],
  [/\bcss3\b/i, 'css'],
  [/\bscss\b/i, 'css'],
  [/\bsass\b/i, 'css'],
  [/\bbootstrap\b/i, 'css'],
  [/\bcontainerization\b/i, 'docker'],
  [/\bgolang\b/i, 'go'],
  [/\breactjs\b/i, 'react'],
  [/\bvuejs\b/i, 'vue'],
  [/\bnodejs\b/i, 'node'],
  [/\bexpressjs\b/i, 'express'],
  [/\bcsharp\b/i, 'csharp'],
  [/\bj2ee\b/i, 'java'],
  [/\bk8s\b/i, 'kubernetes'],
  [/\bcicd\b/i, 'ci_cd'],
  [/\bpostgres(?:ql)?\b/i, 'sql'],
  [/\bmysql\b/i, 'sql'],
  [/\bsqlite\b/i, 'sql'],
  [/\bmssql\b/i, 'sql'],
  [/\bmongodb\b/i, 'mongodb'],
  [/\btensorflow\b/i, 'machine_learning'],
  [/\bpytorch\b/i, 'machine_learning'],
  [/\bjenkins\b/i, 'ci_cd'],
  [/\bcircleci\b/i, 'ci_cd'],
  [/\bselenium\b/i, 'testing'],
  [/\bcypress\b/i, 'testing'],
  [/\bpytest\b/i, 'testing'],
  [/\bjest\b/i, 'testing'],
  [/\btdd\b/i, 'testing'],
  [/\bscrum\b/i, 'agile'],
  [/\bkanban\b/i, 'agile'],
  [/\bterraform\b/i, 'terraform'],
  [/\b(?:elasticsearch|elastic\s+search)\b/i, 'elasticsearch'],
  [/\btableau\b/i, 'tableau'],
  [/\bfigma\b/i, 'figma'],
  [/\bgraphql\b/i, 'graphql'],
  [/\bfastapi\b/i, 'fastapi'],
  [/\bdjango\b/i, 'django'],
  [/\bflask\b/i, 'flask'],
  [/\bredis\b/i, 'redis'],
  [/\bdocker\b/i, 'docker'],
  [/\bkubernetes\b/i, 'kubernetes'],
  [/\bmongo\b/i, 'mongodb'],
  [/\btypescript\b/i, 'typescript'],
  [/\bjavascript\b/i, 'javascript'],
  [/\bpython3\b/i, 'python'],
  [/\bpython\b/i, 'python'],
  [/\bjava\b(?!script)/i, 'java'],
  [/\bspring\b/i, 'spring'],
  [/\bangular\b/i, 'angular'],
  [/\breact\b/i, 'react'],
  [/\bvue\b/i, 'vue'],
  [/\brust\b/i, 'rust'],
  [/\bdjango\b/i, 'django'],
  [/\bflask\b/i, 'flask'],
  [/\bfastapi\b/i, 'fastapi'],
  [/\bgraphql\b/i, 'graphql'],
  [/\bredis\b/i, 'redis'],
  [/\bdocker\b/i, 'docker'],
  [/\bkubernetes\b/i, 'kubernetes'],
  [/\bterraform\b/i, 'terraform'],
  [/\bswift\b/i, 'swift'],
  [/\bkotlin\b/i, 'kotlin'],
  [/\bflutter\b/i, 'flutter'],
  [/\bruby\b/i, 'ruby'],
  [/\brails\b/i, 'ruby'],
  [/\bphp\b/i, 'php'],
  [/\blaravel\b/i, 'php'],
  [/\bsap\b/i, 'sap'],
  [/\bexcel\b/i, 'excel'],
  [/\bjira\b/i, 'jira'],
  [/\bconfluence\b/i, 'jira'],
  [/\bmicroservices?\b/i, 'microservices'],
  [/\blinux\b/i, 'linux'],
  [/\bubuntu\b/i, 'linux'],
  [/\bcentos\b/i, 'linux'],
  [/\bunix\b/i, 'linux'],
  [/\bdart\b/i, 'flutter'],
  [/\bpandas\b/i, 'data_science'],
  [/\bnumpy\b/i, 'data_science'],
  [/\bjupyter\b/i, 'data_science'],
];

// Pass 2: Single-word patterns that need context guards to avoid false positives
// These are only matched if the word appears in a technical context
const SINGLE_WORD_PATTERNS: [RegExp, string, string][] = [
  // [pattern, canonical, requiredContext]
  // requiredContext: a regex that must match somewhere in the text for this skill to count
  [/\baws\b/i, 'aws', '\\b(aws|cloud|deploy|serverless|ec2|s3|lambda|iam)\\b'],
  [/\bgcp\b/i, 'gcp', '\\b(gcp|google\\s+cloud|cloud|deploy)\\b'],
  [/\bazure\b/i, 'azure', '\\b(azure|cloud|microsoft|deploy)\\b'],
  [/\bsql\b/i, 'sql', '\\b(sql|database|query|data|backend|full.stack|postgres|mysql)\\b'],
  [/\bnode\b/i, 'node', '\\b(node|javascript|js|backend|full.stack|api|express|react)\\b'],
  [/\bexpress\b/i, 'express', '\\b(express|node|javascript|js|backend|api|rest|full.stack)\\b'],
  [/\brest\b/i, 'rest', '\\b(rest\\s+api|restful|api|endpoint|http|backend|microservice)\\b'],
  [/\bgo\b/i, 'go', '\\b(golang|go\\s+lang|go\\s+dev|backend|microservice|devops)\\b'],
  [/\bhtml\b/i, 'html', '\\b(html|web|frontend|front.end|css|javascript|ui)\\b'],
  [/\bcss\b/i, 'css', '\\b(css|web|frontend|front.end|html|javascript|ui|style)\\b'],
  [/\bc\\s*#\b/i, 'csharp', '\\b(c#|csharp|\\.net|asp|backend)\\b'],
  [/\b\\.net\b/i, 'csharp', '\\b(\\.net|asp|c#|csharp|backend)\\b'],
  [/\bml\b/i, 'machine_learning', '\\b(ml|machine\\s+learning|ai|model|predict|train|data\\s+science)\\b'],
  [/\bai\b/i, 'machine_learning', '\\b(ai|artificial\\s+intelligence|machine\\s+learning|ml|model|nlp|neural)\\b'],
  [/\btesting\b/i, 'testing', '\\b(test|qa|quality|tdd|bdd|jest|pytest|selenium|cypress)\\b'],
  [/\bagile\b/i, 'agile', '\\b(agile|scrum|kanban|sprint|standup)\\b'],
  [/\bgit\b/i, 'git', '\\b(git|github|gitlab|version\\s+control|repository|commit)\\b'],
  [/\bterraform\b/i, 'terraform', '\\b(terraform|iac|infrastructure|provision)\\b'],
  [/\biac\b/i, 'terraform', '\\b(iac|infrastructure\\s+as\\s+code|terraform)\\b'],
  [/\bandroid\b/i, 'kotlin', '\\b(android|mobile|kotlin|java|app)\\b'],
  [/\bios\\s+dev/i, 'swift', '\\b(ios|swift|mobile|apple|iphone)\\b'],
  [/\bspreadsheet\b/i, 'excel', '\\b(spreadsheet|excel|data|analysis)\\b'],
  [/\bpowerbi\b/i, 'powerbi', '\\b(power\\s*bi|bi|analytics|dashboard|report)\\b'],
  [/\blambda\b/i, 'aws', '\\b(aws|lambda|serverless|cloud)\\b'],
  [/\bec2\b/i, 'aws', '\\b(aws|ec2|cloud|server|instance)\\b'],
  [/\bs3\b/i, 'aws', '\\b(aws|s3|storage|bucket|cloud)\\b'],
  [/\bes6\b/i, 'javascript', '\\b(es6|es2015|javascript|js|web|frontend)\\b'],
  [/\bes2015\b/i, 'javascript', '\\b(es6|es2015|javascript|js|web)\\b'],
  [/\bts\b/i, 'typescript', '\\b(typescript|ts|angular|react|node|frontend)\\b'],
  [/\bjs\b/i, 'javascript', '\\b(javascript|js|node|react|angular|vue|web|frontend)\\b'],
  [/\bpy\b/i, 'python', '\\b(python|py|pip|django|flask|data|script)\\b'],
];

const ROLE_PATTERNS: [RegExp, string][] = [
  [/senior\s+software\s+engineer/i, 'Senior Software Engineer'],
  [/software\s+engineer/i, 'Software Engineer'],
  [/full[\s-]?stack\s+developer/i, 'Full-Stack Developer'],
  [/front[\s-]?end\s+developer/i, 'Front-End Developer'],
  [/back[\s-]?end\s+developer/i, 'Back-End Developer'],
  [/data\s+scientist/i, 'Data Scientist'],
  [/data\s+engineer/i, 'Data Engineer'],
  [/ml\s+engineer/i, 'ML Engineer'],
  [/machine\s+learning\s+engineer/i, 'ML Engineer'],
  [/devops\s+engineer/i, 'DevOps Engineer'],
  [/cloud\s+engineer/i, 'Cloud Engineer'],
  [/product\s+manager/i, 'Product Manager'],
  [/project\s+manager/i, 'Project Manager'],
  [/engineering\s+manager/i, 'Engineering Manager'],
  [/tech\s+lead/i, 'Tech Lead'],
  [/qa\s+engineer/i, 'QA Engineer'],
  [/test\s+engineer/i, 'Test Engineer'],
  [/ui\/ux\s+designer/i, 'UI/UX Designer'],
  [/ux\s+designer/i, 'UX Designer'],
  [/system\s+admin/i, 'System Administrator'],
  [/business\s+analyst/i, 'Business Analyst'],
  [/solution\s+architect/i, 'Solution Architect'],
  [/platform\s+engineer/i, 'Platform Engineer'],
  [/site\s+reliability/i, 'SRE Engineer'],
  [/security\s+engineer/i, 'Security Engineer'],
  [/ios\s+developer/i, 'iOS Developer'],
  [/android\s+developer/i, 'Android Developer'],
  [/mobile\s+developer/i, 'Mobile Developer'],
  [/python\s+developer/i, 'Python Developer'],
  [/java\s+developer/i, 'Java Developer'],
  [/backend\s+developer/i, 'Back-End Developer'],
  [/frontend\s+developer/i, 'Front-End Developer'],
];

const EXPERIENCE_PATTERNS: RegExp[] = [
  /(\d+)\+?\s*years?\s*(of\s+)?(experience|exp)/i,
  /minimum\s+of\s+(\d+)\s*years?/i,
  /at\s+least\s+(\d+)\s*years?/i,
  /(\d+)\s*[-–]\s*(\d+)\s*years?\s*(of\s+)?experience/i,
];

export function parseJD(text: string): ParsedJD {
  const skills: string[] = [];
  const seen = new Set<string>();

  // Pass 1: Match compound/multi-word patterns first (high confidence)
  for (const [pattern, canonical] of COMPOUND_PATTERNS) {
    if (pattern.test(text) && !seen.has(canonical)) {
      seen.add(canonical);
      skills.push(canonical);
    }
  }

  // Pass 2: Match single-word patterns with context guards
  for (const [pattern, canonical, contextRegex] of SINGLE_WORD_PATTERNS) {
    if (seen.has(canonical)) continue;
    if (!pattern.test(text)) continue;
    const contextPattern = new RegExp(contextRegex, 'i');
    if (contextPattern.test(text)) {
      seen.add(canonical);
      skills.push(canonical);
    }
  }

  // Detect role
  let role = 'Software Engineer';
  for (const [pattern, roleName] of ROLE_PATTERNS) {
    if (pattern.test(text)) {
      role = roleName;
      break;
    }
  }

  // Detect experience
  let experience = 'Not specified';
  let experienceYears = 0;

  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const years = parseInt(match[1], 10);
      if (years > 0) {
        experienceYears = years;
        experience = `${years}+ years`;
        break;
      }
    }
  }

  if (experienceYears === 0) {
    const yearMatch = text.match(/(\d+)\+?\s*years?/i);
    if (yearMatch) {
      experienceYears = parseInt(yearMatch[1], 10);
      experience = `${experienceYears}+ years`;
    }
  }

  return {
    role,
    skills,
    experience,
    experienceYears,
    rawText: text,
  };
}
