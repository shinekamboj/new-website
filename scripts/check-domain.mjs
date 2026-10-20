import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requestedDomain = process.argv[2] || process.env.SITE_DOMAIN || 'pixelpalsarcade.com';
const domain = requestedDomain.trim().toLowerCase();
const reportPath = resolve(root, 'evidence/domain-check.md');

if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)) {
  console.error(`Invalid domain name: ${requestedDomain}`);
  process.exit(2);
}

const now = new Date().toISOString();
let result;
let source = 'RDAP lookup unavailable';
let httpStatus = null;

if (!domain.endsWith('.com')) {
  result = 'Not checked: this script currently uses the Verisign .com RDAP service.';
} else {
  const url = `https://rdap.verisign.com/com/v1/domain/${encodeURIComponent(domain)}`;
  source = url;
  try {
    const response = await fetch(url, { headers: { accept: 'application/rdap+json' } });
    httpStatus = response.status;
    if (response.ok) {
      result = 'Registered — an RDAP domain record was found.';
    } else if (response.status === 404) {
      result = 'No RDAP registration record found; the domain appears available at lookup time.';
    } else {
      result = `Could not determine availability (RDAP returned HTTP ${response.status}).`;
    }
  } catch (error) {
    result = `Could not determine availability (${error.message}).`;
  }
}

const markdown = `# Domain availability check\n\n- Domain: \`${domain}\`\n- Checked (UTC): ${now}\n- Result: ${result}\n- RDAP source: ${source}\n\nThis is a point-in-time RDAP lookup, not a reservation, purchase, or guarantee. Confirm availability with a registrar before buying.\n`;
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, markdown, 'utf8');
await writeFile(resolve(root, 'evidence/domain-check.json'), `${JSON.stringify({ domain, checkedAt: now, httpStatus, result, source }, null, 2)}\n`, 'utf8');
console.log(`${domain}: ${result}`);
console.log(`Evidence: ${reportPath}`);
