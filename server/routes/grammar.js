const router = require('express').Router();
const { GrammarLesson } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.get('/', async (req, res) => {
  try { res.json(await GrammarLesson.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await GrammarLesson.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await GrammarLesson.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await GrammarLesson.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await GrammarLesson.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-explain', aiRateLimiter, async (req, res) => {
  try {
    const { topic, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a grammar expert. Explain grammar rules clearly with examples. Use markdown formatting for better readability.' },
      { role: 'user', content: `Explain the grammar topic "${topic}" in ${language || 'Spanish'}. Include: clear rules, 3+ examples, common mistakes to avoid, and practice tips.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
