import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function getRuns() {
  const { data } = await supabase
    .from('agent_runs')
    .select('*')
    .order('ran_at', { ascending: false })
    .limit(20);
  return data ?? [];
}

async function getQueue() {
  const { data } = await supabase
    .from('films')
    .select('id, title, status, review_note, reviewed_at')
    .in('status', ['needs_review', 'awaiting_curation'])
    .order('reviewed_at', { ascending: false });
  return data ?? [];
}

export default async function AgentActivityPage() {
  const [runs, queue] = await Promise.all([getRuns(), getQueue()]);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '48px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Agent activity</h1>
      <p style={{ color: '#999', marginBottom: '40px' }}>
        Everything below is a log — nothing here requires action unless a film is waiting on you.
      </p>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#e50914' }}>
          Waiting on you ({queue.length})
        </h2>
        {queue.length === 0 ? (
          <p style={{ color: '#666' }}>Nothing waiting.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#999', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '8px 0' }}>Title</th>
                <th style={{ padding: '8px 0' }}>Status</th>
                <th style={{ padding: '8px 0' }}>Agent note</th>
                <th style={{ padding: '8px 0' }}>Reviewed at</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 0' }}>{f.title || '(untitled)'}</td>
                  <td style={{ padding: '10px 0' }}>
                    <span
                      style={{
                        color: f.status === 'needs_review' ? '#e50914' : '#4fa89a',
                        fontWeight: 600
                      }}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 0', color: '#ccc' }}>{f.review_note || '—'}</td>
                  <td style={{ padding: '10px 0', color: '#666' }}>
                    {f.reviewed_at ? new Date(f.reviewed_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Run history</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#999', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '8px 0' }}>Ran at</th>
              <th style={{ padding: '8px 0' }}>Reviewed</th>
              <th style={{ padding: '8px 0' }}>Approved</th>
              <th style={{ padding: '8px 0' }}>Flagged</th>
              <th style={{ padding: '8px 0' }}>Thumbs fixed</th>
              <th style={{ padding: '8px 0' }}>Expired</th>
              <th style={{ padding: '8px 0' }}>Error</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '10px 0' }}>{new Date(r.ran_at).toLocaleString()}</td>
                <td style={{ padding: '10px 0' }}>{r.reviewed_count}</td>
                <td style={{ padding: '10px 0' }}>{r.approved_count}</td>
                <td style={{ padding: '10px 0' }}>{r.flagged_count}</td>
                <td style={{ padding: '10px 0' }}>
                  {r.thumbnails_fixed}/{r.thumbnails_checked}
                </td>
                <td style={{ padding: '10px 0' }}>{r.expirations_removed}</td>
                <td style={{ padding: '10px 0', color: r.error ? '#e50914' : '#666' }}>{r.error || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}