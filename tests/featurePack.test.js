'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
delete process.env.OPENROUTER_API_KEY; delete process.env.OPENAI_API_KEY;
const fp = require('../server/featurePack');
const { createFeaturePackRouter } = require('../server/routes/featurePack');

test('validateTask requires title, defaults status open', () => {
  assert.throws(() => fp.validateTask({}), /title is required/);
  assert.equal(fp.validateTask({ title: ' X ' }).status, 'open');
});
test('filter + CSV/JSON export preserve 0/false/empty', () => {
  const rows = [{id:1,word:'hola',language:'Spanish',translation:'hello',status:'new'},{id:2,word:'gato',language:'Spanish',translation:'cat',status:'mastered'}];
  assert.equal(fp.filterRecords(rows, { search: 'hola' }).length, 1);
  assert.equal(fp.filterRecords(rows, { status: 'mastered' }).length, 1);
  assert.match(fp.toCsv(rows), /hola/);
  assert.equal(fp.toJsonExport(rows).count, rows.length);
  assert.equal(fp.toJsonExport([]).count, 0);
});
test('domain AI deterministic fallback is labelled and preserves values', () => {
  const out = fp.grammarInsight({word:'',language:'',text:''});
  assert.equal(out.aiGenerated, false);
  assert.equal(out.source, 'deterministic-fallback');
  assert.ok(out.label.includes('Deterministic fallback'));
  assert.equal(out.sections.character_count, 0); assert.equal(out.sections.is_empty, true); assert.equal(out.sections.has_translation, false);
});
test('authenticated tasks list/create/update + search/export routes', async () => {
  const express = require('express');
  const app = express(); app.use(express.json());
  const auth = (req, res, next) => req.headers.authorization ? (req.user = { id: 7 }, next()) : res.status(401).json({ error: 'no token' });
  app.use('/api/feature-pack', createFeaturePackRouter({ authenticate: auth, getRecords: async () => [{id:1,word:'hola',language:'Spanish',translation:'hello',status:'new'},{id:2,word:'gato',language:'Spanish',translation:'cat',status:'mastered'}], aiHandlers: { 'review-plan': fp.reviewPlan, 'grammar-insight': fp.grammarInsight, 'study-plan': fp.studyPlan } }));
  const srv = app.listen(0); const base = 'http://127.0.0.1:' + srv.address().port;
  try {
    assert.equal((await fetch(base + '/api/feature-pack/tasks')).status, 401);
    const H = { authorization: 'Bearer x', 'content-type': 'application/json' };
    const created = await (await fetch(base + '/api/feature-pack/tasks', { method: 'POST', headers: H, body: JSON.stringify({ title: 'T1' }) })).json();
    assert.equal(created.title, 'T1');
    const upd = await (await fetch(base + '/api/feature-pack/tasks/' + created.id, { method: 'PUT', headers: H, body: JSON.stringify({ status: 'done' }) })).json();
    assert.equal(upd.status, 'done');
    const list = await (await fetch(base + '/api/feature-pack/tasks', { headers: H })).json();
    assert.equal(list.count, 1);
    assert.equal((await (await fetch(base + '/api/feature-pack/export?format=json', { headers: H })).json()).count, [{id:1,word:'hola',language:'Spanish',translation:'hello',status:'new'},{id:2,word:'gato',language:'Spanish',translation:'cat',status:'mastered'}].length);
    const ai = await (await fetch(base + '/api/feature-pack/ai/grammar-insight', { method: 'POST', headers: H, body: JSON.stringify({ record: {word:'hola',language:'Spanish'} }) })).json();
    assert.equal(ai.aiGenerated, false);
  } finally { srv.close(); }
});
