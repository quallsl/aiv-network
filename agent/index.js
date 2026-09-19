import { reviewSubmissions } from './tasks/reviewSubmissions.js';
import { thumbnailAudit } from './tasks/thumbnailAudit.js';
import { expirationSweep } from './tasks/expirationSweep.js';
import { logAgentRun } from './lib/logRun.js';

const dryRun = process.argv.includes('--dry-run');

async function run() {
  console.log(`Starting AIV agent run (dryRun=${dryRun})`);

  const review = await reviewSubmissions({ dryRun });
  console.log('Submission review:', review);

  const thumbs = await thumbnailAudit({ dryRun });
  console.log('Thumbnail audit:', thumbs);

  const expirations = await expirationSweep({ dryRun });
  console.log('Expiration sweep:', expirations);

  if (!dryRun) await logAgentRun({ review, thumbs, expirations });

  console.log('Agent run complete.');
}

run().catch(async (err) => {
  console.error('Agent run failed:', err);
  if (!dryRun) await logAgentRun({ error: String(err) });
  process.exit(1);
});




