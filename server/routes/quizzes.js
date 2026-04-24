const router = require('express').Router();
const { Quiz } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await Quiz.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Quiz.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Quiz.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Quiz.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Quiz.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-generate', async (req, res) => {
  try {
    const { topic, language, level } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a quiz generator for language learning. Create engaging multiple-choice questions that test vocabulary, grammar, and comprehension.' },
      { role: 'user', content: `Create a ${level || 'beginner'} level quiz about "${topic}" for ${language || 'Spanish'} learners. Include 5 multiple-choice questions with 4 options each. Mark the correct answer. Add explanations for each answer.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
