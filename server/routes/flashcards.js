const router = require('express').Router();
const { Flashcard, sequelize } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

function parseAIJson(text) {
  try { return JSON.parse(text); } catch (e) {}
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
  try { return JSON.parse(stripped); } catch (e) {}
  const start = text.indexOf('{'); const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) { try { return JSON.parse(text.slice(start, end + 1)); } catch (e) {} }
  return null;
}

// Ensure nextReviewDate column exists
async function ensureReviewDateColumn() {
  try {
    await sequelize.query('ALTER TABLE "Flashcards" ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMP DEFAULT NOW()');
    await sequelize.query('ALTER TABLE "Flashcards" ADD COLUMN IF NOT EXISTS interval_days INTEGER DEFAULT 1');
    await sequelize.query('ALTER TABLE "Flashcards" ADD COLUMN IF NOT EXISTS user_id INTEGER');
    await sequelize.query('ALTER TABLE "Flashcards" ADD COLUMN IF NOT EXISTS example_sentence TEXT');
  } catch (e) {
    // Columns may already exist
  }
}

ensureReviewDateColumn();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.page || req.query.limit) {
      const { count, rows } = await Flashcard.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']] });
      return res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
    }
    res.json(await Flashcard.findAll({ order: [['createdAt', 'DESC']] }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/due-today', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const where = {
      nextReviewDate: { [Op.lte]: new Date() }
    };
    if (userId) where.userId = userId;
    const cards = await Flashcard.findAll({ where, order: [['nextReviewDate', 'ASC']] });
    res.json(cards);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Flashcard.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Flashcard.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Flashcard.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Flashcard.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Spaced repetition review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { correct } = req.body;
    const card = await Flashcard.findByPk(req.params.id);
    if (!card) return res.status(404).json({ error: 'Not found' });

    const prevInterval = card.intervalDays || 1;
    let newInterval;
    const updates = { timesReviewed: (card.timesReviewed || 0) + 1 };

    if (correct) {
      newInterval = Math.max(1, prevInterval * 2);
      updates.timesCorrect = (card.timesCorrect || 0) + 1;
    } else {
      newInterval = 1;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    updates.intervalDays = newInterval;
    updates.nextReviewDate = nextReview;

    await card.update(updates);
    res.json({ nextReviewDate: nextReview, interval_days: newInterval });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Generate - structured JSON -> bulk insert
router.post('/ai-generate', aiRateLimiter, auth, async (req, res) => {
  try {
    const { topic, language, count, level } = req.body;
    const userId = req.user?.id;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a flashcard generator for language learning. Return only valid JSON.' },
      { role: 'user', content: `Generate ${count || 5} flashcards for ${language || 'Spanish'} at ${level || 'beginner'} level about the topic "${topic}". Return JSON: { flashcards: [{front, back, example_sentence, difficulty}] }` }
    ]);

    const parsed = parseAIJson(content);
    if (parsed && Array.isArray(parsed.flashcards)) {
      const cards = await Flashcard.bulkCreate(parsed.flashcards.map(fc => ({
        front: fc.front,
        back: fc.back,
        exampleSentence: fc.example_sentence || '',
        difficulty: fc.difficulty || level || 'beginner',
        language: language || 'Spanish',
        category: topic,
        userId,
        nextReviewDate: new Date(),
        intervalDays: 1
      })));
      return res.json({ flashcards: cards, count: cards.length });
    }
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
