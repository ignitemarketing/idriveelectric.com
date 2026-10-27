// Fails when a check step in a workflow could be skipped by an earlier failure.
// Setup steps (actions/checkout) stay fail-fast; every other step needs an
// `if:` containing `!cancelled()` or `always()`.
// Usage: node check-run-through.mjs <workflow.yml>...
import { readFileSync } from 'node:fs';

const indentOf = (line) => line.search(/\S/);
const problems = [];

for (const file of process.argv.slice(2)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const steps = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*steps:\s*$/.test(lines[i])) continue;
    const parent = indentOf(lines[i]);
    let stepIndent = -1;
    for (i++; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || /^\s*#/.test(line)) continue;
      const indent = indentOf(line);
      if (indent <= parent) { i--; break; }
      if (stepIndent === -1) stepIndent = indent;
      if (indent === stepIndent && line.trim().startsWith('- ')) steps.push([line]);
      else steps[steps.length - 1].push(line);
    }
  }
  if (!steps.length) problems.push(`${file}: no steps found`);
  for (const step of steps) {
    const text = step.join('\n');
    if (/uses:\s*actions\/checkout@/.test(text)) continue;
    const name = (text.match(/name:\s*(.+)/) || [, step[0].trim()])[1];
    const cond = (text.match(/^[\s-]*if:\s*(.+)$/m) || [])[1] || '';
    if (!/!cancelled\(\)|always\(\)/.test(cond)) {
      problems.push(`${file}: step "${name}" has no !cancelled()/always() condition`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(p);
  process.exit(1);
}
console.log('every check step runs after an earlier failure');
