// OpenAI-compatible Groq caller with the same return shape as lib/anthropic.js.
async function callGroq({ model, system, user, maxTokens = 400, timeoutMs = 8000, apiKey = process.env.GROQ_API_KEY }) {
  if (!apiKey) throw new Error('no_api_key');
  const body = { model, max_tokens: maxTokens, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] };
  if (/gpt-oss/.test(model)) body.reasoning_effort = 'low';
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', signal: ctrl.signal,
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey },
        body: JSON.stringify(body),
      });
      if (res.status === 429 && attempt < 3) {
        const wait = Math.min(Number(res.headers.get('retry-after')) || 2, 15);
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      if (!res.ok) throw new Error('model_http_' + res.status + ': ' + (await res.text().catch(() => '')).slice(0, 200));
      const data = await res.json();
      const u = data.usage || {};
      return {
        text: (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '',
        usage: { input_tokens: u.prompt_tokens || 0, output_tokens: u.completion_tokens || 0 },
      };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('model_rate_limited');
}

module.exports = { callGroq };
