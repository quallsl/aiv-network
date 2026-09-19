import { NextResponse } from 'next/server';
import { reviewSubmissions } from '../../../../agent/tasks/reviewSubmissions.js';
import { thumbnailAudit } from '../../../../agent/tasks/thumbnailAudit.js';
import { expirationSweep } from '../../../../agent/tasks/expirationSweep.js';
import { logAgentRun } from '../../../../agent/lib/logRun.js';

// Vercel Cron calls this with an Authorization header matching CRON_SECRET.
export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let review, thumbs, expirations;
  try {
    review = await reviewSubmissions();
    thumbs = await thumbnailAudit();
    expirations = await expirationSweep();
    await logAgentRun({ review, thumbs, expirations });
  } catch (err) {
    await logAgentRun({ review, thumbs, expirations, error: String(err) });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ review, thumbs, expirations });
}

