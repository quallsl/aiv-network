import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function reviewFilmSubmission(film) {
  const prompt = `You are reviewing a film submission for an AVOD streaming platform before it goes live.

Title: ${film.title || '(missing)'}
Synopsis: ${film.description || '(missing)'}

Check for:
1. Missing or placeholder title/description
2. Synopsis under 20 words or clearly incomplete
3. Obvious content-policy red flags (hate speech, explicit content described in the description, copyright red flags like "official trailer" for a studio film)

Respond ONLY with JSON, no other text: {"verdict":"approve"|"needs_review","reason":"<one sentence>"}`;

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = msg.content.find((b) => b.type === 'text')?.text || '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { verdict: 'needs_review', reason: 'Could not parse AI response — flagged for manual check.' };
  }
}
