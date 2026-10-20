import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = resolve(root, 'evidence');
const resultsFile = resolve(evidenceDir, 'test-results/results.json');
const startedAt = new Date();
const commandLogs = [];

await mkdir(resolve(evidenceDir, 'test-results'), { recursive: true });

function runNpm(args) {
  return new Promise((resolveRun) => {
    const npmCli = process.env.npm_execpath;
    if (!npmCli) {
      console.error('Run this through `npm run verify` so it can locate the npm CLI.');
      resolveRun(1);
      return;
    }

    const output = [];
    const child = spawn(process.execPath, [npmCli, ...args], {
      cwd: root,
      stdio: ['inherit', 'pipe', 'pipe'],
    });
    child.stdout.on('data', (chunk) => { process.stdout.write(chunk); output.push(chunk.toString()); });
    child.stderr.on('data', (chunk) => { process.stderr.write(chunk); output.push(chunk.toString()); });
    child.on('error', (error) => {
      console.error(`Could not run npm ${args.join(' ')}: ${error.message}`);
      commandLogs.push({ command: `npm ${args.join(' ')}`, code: 1, output: error.message });
      resolveRun(1);
    });
    child.on('exit', (code) => {
      const exitCode = code ?? 1;
      commandLogs.push({ command: `npm ${args.join(' ')}`, code: exitCode, output: output.join('') });
      resolveRun(exitCode);
    });
  });
}

console.log('\n[1/3] Checking the configured domain...');
const domainExit = await runNpm(['run', 'check:domain']);

console.log('\n[2/3] Building the production site...');
const buildExit = await runNpm(['run', 'build']);

console.log('\n[3/3] Running Playwright browser tests...');
const testExit = await runNpm(['run', 'test:e2e']);

let testStats = null;
try {
  const report = JSON.parse(await readFile(resultsFile, 'utf8'));
  testStats = report.stats ?? null;
} catch {
  // Keep a verification record even if Playwright could not write a JSON report.
}

let screenshots = [];
try {
  screenshots = (await readdir(resolve(evidenceDir, 'screenshots')))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort();
} catch {
  // No screenshots yet, for example if the browser could not launch.
}

const timestamp = startedAt.toISOString();
const resultSummary = testStats
  ? `${testStats.expected ?? 0} passed, ${testStats.unexpected ?? 0} failed, ${testStats.flaky ?? 0} flaky, ${testStats.skipped ?? 0} skipped`
  : `No Playwright JSON summary was available (exit code ${testExit}).`;
const buildStatus = buildExit === 0 ? 'PASS' : `FAIL (exit ${buildExit})`;
const testStatus = testExit === 0 ? 'PASS' : `FAIL (exit ${testExit})`;
const domainStatus = domainExit === 0 ? 'checked; see domain-check.md' : `check command failed (exit ${domainExit})`;

const evidenceCases = [
  ['TC-01/02', ['01-kids-desktop.png']],
  ['TC-03', ['02-grown-up-desktop.png']],
  ['TC-04', ['tc-04-search-match.png']],
  ['TC-05', ['tc-05-math-category.png']],
  ['TC-06', ['tc-06-empty-search.png', 'tc-06-search-reset.png']],
  ['TC-07', ['tc-07-math-wrong-answer.png', '03-math-game-result.png']],
  ['TC-08', ['tc-08-word-wrong-answer.png', '08-word-game-result.png']],
  ['TC-09', ['tc-09-neon-early-tap.png', '04-neon-drift-result.png']],
  ['TC-10', ['tc-10-footer-navigation.png']],
  ['TC-11', ['05-kids-mobile.png']],
  ['TC-12', ['tc-12-layout-768px.png', 'tc-12-layout-1280px.png']],
  ['TC-13', ['tc-13-keyboard-game-dialog.png']],
  ['TC-14', screenshots.filter((file) => file.startsWith('tc-14-'))],
];
const evidenceRows = evidenceCases.map(([caseID, files]) => {
  const links = files.length
    ? files.map((file) => screenshots.includes(file) ? `[\`${file}\`](screenshots/${file})` : `Missing: \`${file}\``).join(', ')
    : 'No screenshot was generated.';
  return `| ${caseID} | ${links} |`;
});

const evidenceIndex = `# Evidence index\n\nGenerated (UTC): ${timestamp}\n\n| Test case | Screenshot evidence |\n|---|---|\n${evidenceRows.join('\n')}\n\nAdditional artifacts: [domain RDAP result](domain-check.json), [verification log](test-results/verify.log), [Playwright JSON](test-results/results.json), and [HTML report](playwright-report/index.html).\n`;
await writeFile(resolve(evidenceDir, 'evidence-index.md'), evidenceIndex, 'utf8');

const screenshotsMarkdown = screenshots.length
  ? screenshots.map((file) => `- [\`${file}\`](screenshots/${file})`).join('\n')
  : '- No screenshots were generated in this run.';
const summary = `# Automated verification\n\n- Run time (UTC): ${timestamp}\n- Domain check: ${domainStatus}\n- Production build: **${buildStatus}**\n- Playwright E2E: **${testStatus}** — ${resultSummary}\n- HTML report: [Playwright report](playwright-report/index.html)\n- JSON report: [results.json](test-results/results.json)\n- Raw command output: [verify.log](test-results/verify.log)\n- Test-to-screenshot map: [evidence index](evidence-index.md)\n\n## Screenshots\n\n${screenshotsMarkdown}\n\nThe domain check is a point-in-time lookup, not a domain reservation. See [domain-check.md](domain-check.md) and [domain-check.json](domain-check.json).\n`;
await writeFile(resolve(evidenceDir, 'verification.md'), summary, 'utf8');

const commandLog = [`Pixel Pals Arcade verification — ${timestamp}`, '']
  .concat(commandLogs.map((item) => `> ${item.command} (exit ${item.code})\n${item.output.trimEnd()}`))
  .join('\n\n');
await writeFile(resolve(evidenceDir, 'test-results/verify.log'), `${commandLog}\n`, 'utf8');
await appendFile(resolve(evidenceDir, 'verification-history.jsonl'), `${JSON.stringify({ timestamp, domainExit, buildExit, testExit, testStats, screenshots })}\n`, 'utf8');

const requirementsPath = resolve(root, 'requirements.md');
const markers = /<!-- AUTO-VERIFICATION-START -->[\s\S]*?<!-- AUTO-VERIFICATION-END -->/;
const requirements = await readFile(requirementsPath, 'utf8');
const autoBlock = `<!-- AUTO-VERIFICATION-START -->\n\nLast automated run (${timestamp}): domain ${domainStatus}; build **${buildStatus}**; Playwright **${testStatus}** — ${resultSummary}.\n\nEvidence: [verification summary](evidence/verification.md), [test-to-screenshot index](evidence/evidence-index.md), [raw command log](evidence/test-results/verify.log), [HTML report](evidence/playwright-report/index.html), and [screenshots](evidence/screenshots/).\n\n<!-- AUTO-VERIFICATION-END -->`;
if (markers.test(requirements)) {
  await writeFile(requirementsPath, requirements.replace(markers, autoBlock), 'utf8');
} else {
  await writeFile(requirementsPath, `${requirements.trimEnd()}\n\n${autoBlock}\n`, 'utf8');
}

console.log(`\nVerification evidence updated: ${resolve(evidenceDir, 'verification.md')}`);
if (buildExit !== 0 || testExit !== 0) process.exitCode = 1;
