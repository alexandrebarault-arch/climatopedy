import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', 'tests/numerical/unit/*.test.ts', 'tests/numerical/properties/*.test.ts', 'tests/numerical/golden/goldenMaster.test.ts', 'tests/numerical/runnerCommands.test.ts', 'tests/siteGoldenMaster.test.ts'], { stdio: 'inherit', shell: false });
process.exit(result.status ?? 1);
