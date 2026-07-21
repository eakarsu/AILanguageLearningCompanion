'use strict';
const LEVELS = ['A1','A2','B1','B2','C1','C2'];
function evaluate(input = {}) {
  const errors = [], learner = input.learner || {}, goal = input.goal || {};
  if (!learner.id || !learner.consent?.version || !learner.consent?.grantedAt || learner.consent?.revokedAt) errors.push('active versioned learner consent required');
  if (learner.isMinor && (!learner.guardianConsent?.version || learner.directMessaging === true)) errors.push('minor requires guardian consent and restricted messaging');
  if (!LEVELS.includes(goal.currentLevel) || !LEVELS.includes(goal.targetLevel) || LEVELS.indexOf(goal.targetLevel) < LEVELS.indexOf(goal.currentLevel)) errors.push('valid progressive CEFR goal required');
  const lessons = input.curriculum || [], lessonIds = new Set();
  if (!lessons.length) errors.push('versioned curriculum required');
  for (const lesson of lessons) {
    lessonIds.add(String(lesson.id));
    if (!lesson.id || !lesson.version || !LEVELS.includes(lesson.level) || !lesson.rightsBasis || !lesson.accessibilityChecked || !lesson.safetyReviewVersion) errors.push(`lesson ${lesson.id || '?'} lacks level, rights, version, safety, or accessibility review`);
    if (LEVELS.indexOf(lesson.level) > LEVELS.indexOf(goal.targetLevel)) errors.push(`lesson ${lesson.id} exceeds target level`);
  }
  let attempts = 0, supported = 0;
  for (const session of input.sessions || []) for (const attempt of session.attempts || []) {
    attempts += 1;
    if (!lessonIds.has(String(session.lessonId)) || !['speech','text','listening','reading'].includes(attempt.mode)) errors.push('attempt references unknown lesson or mode');
    if (!(Number(attempt.score) >= 0 && Number(attempt.score) <= 1) || !(Number(attempt.feedbackConfidence) >= 0 && Number(attempt.feedbackConfidence) <= 1)) errors.push('score/confidence outside [0,1]');
    if (attempt.evidenceRef) supported += 1; else errors.push('feedback evidence required');
    if (attempt.pronunciationScore != null && !attempt.speechServiceVersion) errors.push('pronunciation score requires service version');
  }
  for (const card of input.spacedReview || []) {
    if (!card.id || !Number.isInteger(card.intervalDays) || card.intervalDays < 1 || Number.isNaN(Date.parse(card.dueAt))) errors.push(`review card ${card.id || '?'} invalid`);
  }
  const validation = input.validation || {};
  if (!validation.datasetVersion || !validation.rubricVersion ||
      !(validation.feedbackAccuracy >= 0 && validation.feedbackAccuracy <= 1) ||
      !(validation.safetyPassRate >= 0 && validation.safetyPassRate <= 1) ||
      validation.safetyPassRate < 1 || validation.accessibilityPassRate !== 1 ||
      !Number.isFinite(Number(validation.pronunciationMae)) ||
      !(validation.p95LatencyMs > 0) || !Number.isFinite(Number(validation.outcomeDelta))) {
    errors.push('versioned feedback, pronunciation, safety, accessibility, latency, and outcome validation required');
  }
  if (input.controls?.learnerCanOptOut !== true || input.controls?.feedbackCorrectionEnabled !== true) {
    errors.push('learner control and feedback correction are required');
  }
  return { errors, result: { level: goal.currentLevel, target: goal.targetLevel, lessonCount: lessons.length,
    feedbackEvidenceCoverage: attempts ? supported / attempts : 1, reviewDue: (input.spacedReview || []).map((c) => c.id),
    validation, decision: errors.length ? 'revise' : 'reviewable' },
    assumptions: ['CEFR alignment and pronunciation rubrics require qualified language-instruction review'],
    uncertainty: { learningOutcomeCausalityUnproven: true, speechBiasEvaluationRequired: true, instructorControlRequired: true } };
}
module.exports = { evaluate };
