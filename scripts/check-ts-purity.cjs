#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { exit } = require('node:process');

function hasJs(dir) {
  const r = spawnSync('bash', ['-lc', `find ${dir} -type f -name '*.js' -print -quit`], { encoding: 'utf8' });
  return r.stdout.trim().length > 0;
}

const dirs = ['cards', 'shared'];
const offenders = dirs.filter(hasJs);
if (offenders.length) {
  console.error('Error: .js files found in these dirs:', offenders.join(', '));
  spawnSync('bash', ['-lc', `for d in ${offenders.join(' ')}; do find "$d" -type f -name '*.js' -print; done`], { stdio: 'inherit' });
  exit(1);
}
console.log('TS purity check passed: no .js files in cards/ or shared/');
