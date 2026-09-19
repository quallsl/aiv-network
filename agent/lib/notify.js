export async function notifySlack(text) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log('[notify:slack-disabled]', text);
    return;
  }
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}
