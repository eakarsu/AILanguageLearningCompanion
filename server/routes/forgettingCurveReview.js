const express = require('express');
const router = express.Router();
function review(input = {}) {
  const words = input.words || [
    { word: 'desarrollar', last_seen_days: 9, correct_rate: 0.52 },
    { word: 'aunque', last_seen_days: 2, correct_rate: 0.91 },
  ];
  return { words: words.map(w => {
    const score = Math.min(100, Number(w.last_seen_days) * 7 + (1 - Number(w.correct_rate)) * 60);
    return { ...w, review_score: Math.round(score), action: score >= 65 ? 'review_today' : 'defer' };
  }) };
}
router.get('/', (req, res) => res.json(review()));
router.post('/review', (req, res) => res.json(review(req.body || {})));
module.exports = router;
