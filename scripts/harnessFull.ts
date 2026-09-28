import { spawnSync } from 'node:child_process';

const fast = spawnSync('npm', ['run', 'harness:fast'], { stdio: 'inherit', shell: true });
const report = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/reportNumericalImpact.ts'], { stdio: 'inherit', shell: false });
if (report.status !== 0) process.exit(report.status ?? 1);
const full = spawnSync(process.execPath, ['--import', 'tsx', '--test', 'tests/numerical/**/*.test.ts'], { stdio: 'inherit', shell: false });
process.exit(fast.status !== 0 ? fast.status : (full.status ?? 1));
