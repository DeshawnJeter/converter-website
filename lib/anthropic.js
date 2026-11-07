async function callAnthropic({ model, system, user, maxTokens = 200, timeoutMs = 4000, temperature, apiKey = process.env.ANTHROPIC_API_KEY }) {
  if (!apiKey) throw new Error('no_api_key');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: maxTokens, temperature, system, messages: [{ role: 'user', content: user }] }),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 200);
      throw new Error('model_http_' + res.status + (detail ? ': ' + detail : ''));
    }
    const data = await res.json();
    return { text: (data.content && data.content[0] && data.content[0].text) || '', usage: data.usage || null };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { callAnthropic };
