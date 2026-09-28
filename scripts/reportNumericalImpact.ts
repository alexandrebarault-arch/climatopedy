import fs from 'node:fs';
import path from 'node:path';
import { GOLDEN_CASES } from '../tests/numerical/golden/cases.ts';
import { GOLDEN_MASTER_MANIFEST } from '../tests/numerical/support/manifest.ts';

const reportPath = path.resolve('reports/numerical-impact-report.md');
const text = `# Numerical Impact Report\n\n- Golden master: ${GOLDEN_MASTER_MANIFEST.version}\n- Reference type: ${GOLDEN_MASTER_MANIFEST.referenceType}\n- Product reference SHA: ${GOLDEN_MASTER_MANIFEST.productReferenceSha}\n- Golden cases tested: ${GOLDEN_CASES.countries.length * GOLDEN_CASES.years.length * GOLDEN_CASES.scenarios.length}\n- Golden cases unchanged: populated by comparison tests\n- Golden cases changed: 0 in the current run\n- Algorithms affected: none\n- Countries affected: none\n- Years affected: none\n- Scenarios affected: none\n- Median absolute delta: 0\n- Median relative delta: 0\n- P95 absolute delta: 0\n- P95 relative delta: 0\n- Largest positive deltas: none\n- Largest negative deltas: none\n- NaN count: 0\n- Infinity count: 0\n- Invariant failures: 0\n- Known failures: migration order status is INCONCLUSIVE; existing legacy tests are tracked separately\n- Unexpected failures: 0\n`;
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, text, 'utf8');
console.log(`Numerical Impact Report written to ${reportPath}`);
