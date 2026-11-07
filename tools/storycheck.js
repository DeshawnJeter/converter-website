const REQUIRED = ['{value}', '{from}', '{to}'];

function check(t) {
  const p = [];
  if (typeof t !== 'string') return ['not_a_string'];
  for (const r of REQUIRED) if (!t.includes(r)) p.push('missing_' + r);
  const noStrong = t.replace(/<strong>[^<>]*<\/strong>/g, '');
  if (/[<>]/.test(noStrong)) p.push('markup_other_than_strong');
  if (/\d/.test(t)) p.push('contains_digit');
  if (/https?:|www\.|\.com\b/i.test(t)) p.push('contains_url');
  if (/[{}]/.test(t.replace(/\{(value|from|to)\}/g, ''))) p.push('unknown_placeholder');
  if (t.length < 40 || t.length > 320) p.push('bad_length');
  if (!t.trim().endsWith('?')) p.push('must_end_with_question');
  return p;
}

module.exports = { check };
