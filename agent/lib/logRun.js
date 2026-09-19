import { supabase } from './supabase.js';

export async function logAgentRun({ review, thumbs, expirations, error = null }) {
  const approved = review?.filter((r) => r.verdict === 'approve').length ?? 0;
  const flagged = review?.filter((r) => r.verdict === 'needs_review').length ?? 0;
  const expRemoved = expirations?.filter((e) => e.action === 'removed').length ?? 0;
  const expFlagged = expirations?.filter((e) => e.action === 'warning').length ?? 0;

  const { error: insertError } = await supabase.from('agent_runs').insert({
    reviewed_count: review?.length ?? 0,
    approved_count: approved,
    flagged_count: flagged,
    thumbnails_checked: thumbs?.checked ?? 0,
    thumbnails_fixed: thumbs?.fixed?.length ?? 0,
    expirations_flagged: expFlagged,
    expirations_removed: expRemoved,
    error
  });

  if (insertError) console.error('Failed to log agent run:', insertError);
}