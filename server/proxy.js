const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const NLParse = require('../nlparse.js');
const { loadUnits } = require('../lib/units.js');
const { callAnthropic } = require('../lib/anthropic.js');
const { makeRulesParser } = require('../lib/rules.js');

const MODEL = process.env.MODEL || 'claude-haiku-5-5';

function createParser({ callModel, units, rules = null, now = Date.now, limit = 10, windowMs = 60000 }) {
  const hits = new Map();
  const system = NLParse.buildSystem(units);
  return async function parse(ip, rawText) {
    const text = NLParse.sanitizeInput(rawText);
    if (!text) return { status: 400, body: { error: 'empty_input' } };
    if (rules) {
      const r = rules(text);
      const rv = r.parsed ? NLParse.validate(r.parsed, units) : { ok: false };
      if (rv.ok) return { status: 200, body: { parsed: rv.parsed, source: 'rules' } };
    }
    const t = now();
    const recent = (hits.get(ip) || []).filter((x) => t - x < windowMs);
    if (recent.length >= limit) return { status: 429, body: { error: 'rate_limited' } };
    recent.push(t);
    hits.set(ip, recent);
    let out;
    try {
      out = await callModel({ model: MODEL, system, user: NLParse.wrapUser(text) });
    } catch (e) {
      return { status: 502, body: { error: 'model_unavailable' } };
    }
    const v = NLParse.validate(NLParse.parseModelOutput(typeof out === 'string' ? out : out && out.text), units);
    if (v.ok) return { status: 200, body: { parsed: v.parsed } };
    if (v.refuse) return { status: 200, body: { refused: true } };
    return { status: 422, body: { error: 'invalid_model_output' } };
  };
}

const STATIC = {
  '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'],
  '/script.js': ['script.js', 'text/javascript'], '/nlparse.js': ['nlparse.js', 'text/javascript'],
  '/styles.css': ['styles.css', 'text/css'], '/bg.png': ['bg.png', 'image/png'],
};

function start(port = Number(process.env.PORT) || 8080) {
  const units = loadUnits();
  const parse = createParser({ callModel: callAnthropic, units, rules: makeRulesParser(units) });
  const server = http.createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    if (req.method === 'POST' && url === '/api/parse') {
      let body = '';
      req.on('data', (c) => { body += c; if (body.length > 1024) req.destroy(); });
      req.on('end', async () => {
        let text = '';
        try { text = JSON.parse(body).text; } catch (e) { /* empty */ }
        const r = await parse(req.socket.remoteAddress || 'x', text);
        res.writeHead(r.status, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r.body));
      });
      return;
    }
    const f = req.method === 'GET' && STATIC[url];
    if (!f) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': f[1] });
    fs.createReadStream(path.join(__dirname, '..', f[0])).pipe(res);
  });
  server.listen(port, '127.0.0.1', () => console.log('http://127.0.0.1:' + port + '  (add ?ai=1 for the ask box)'));
  return server;
}

if (require.main === module) start();
module.exports = { createParser, start };
