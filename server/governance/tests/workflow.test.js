'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../domain');

test('domain workflow accepts a grounded reviewable case', () => {
  const evaluation = evaluate({
  learner: { id: 'l1', consent: { version: 'c1', grantedAt: '2026-01-01' }, isMinor: false },
  goal: { currentLevel: 'A1', targetLevel: 'A2' },
  curriculum: [{ id: 'lesson1', version: 'v1', level: 'A1', rightsBasis: 'licensed',
    accessibilityChecked: true, safetyReviewVersion: 'safe-1' }],
  sessions: [{ lessonId: 'lesson1', attempts: [{ mode: 'text', score: 0.8, feedbackConfidence: 0.9, evidenceRef: 'rubric:1' }] }],
  spacedReview: [{ id: 'card1', intervalDays: 3, dueAt: '2026-07-21T00:00:00Z' }],
  validation: { datasetVersion: 'eval-1', rubricVersion: 'rubric-1', feedbackAccuracy: 0.94,
    safetyPassRate: 1, accessibilityPassRate: 1, pronunciationMae: 0.06, p95LatencyMs: 180, outcomeDelta: 0.1 },
  controls: { learnerCanOptOut: true, feedbackCorrectionEnabled: true }
});
  assert.deepEqual(evaluation.errors, []);
  assert.equal(evaluation.result.decision, 'reviewable');
  assert.ok(Array.isArray(evaluation.assumptions));
  assert.equal(typeof evaluation.uncertainty, 'object');
});

test('domain workflow fails closed on incomplete or unsafe input', () => {
  const evaluation = evaluate({ learner: { id: 'minor', isMinor: true, consent: {} }, goal: { currentLevel: 'C1', targetLevel: 'A1' }, curriculum: [], sessions: [], spacedReview: [] });
  assert.ok(evaluation.errors.length > 0);
  assert.notEqual(evaluation.result.decision, 'reviewable');
});
