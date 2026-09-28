import { spawnSync } from 'node:child_process';

const fast = spawnSync('npm', ['run', 'harness:fast'], { stdio: 'inherit', shell: true });
if (fast.status !== 0) process.exit(fast.status ?? 1);
const report = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/reportNumericalImpact.ts'], { stdio: 'inherit', shell: false });
if (report.status !== 0) process.exit(report.status ?? 1);
const full = spawnSync(process.execPath, ['--import', 'tsx', '--test', 'tests/numerical/**/*.test.ts'], { stdio: 'inherit', shell: false });
process.exit(full.status ?? 1);
