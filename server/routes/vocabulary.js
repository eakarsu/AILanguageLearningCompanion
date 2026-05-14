const router = require('express').Router();
const { Vocabulary } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const { count, rows } = await Vocabulary.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
      return res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
    }
    const items = await Vocabulary.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Vocabulary.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await Vocabulary.create(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Vocabulary.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Vocabulary.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-generate', aiRateLimiter, async (req, res) => {
  try {
    const { word, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a language learning assistant. Provide vocabulary help with translations, example sentences, and pronunciation guides. Respond in a structured, educational way.' },
      { role: 'user', content: `Give me detailed vocabulary information for the word "${word}" in ${language || 'Spanish'}. Include: translation to English, part of speech, pronunciation guide, 2 example sentences, synonyms, and usage tips.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
