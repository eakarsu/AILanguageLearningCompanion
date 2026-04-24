const router = require('express').Router();
const { CulturalNote } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await CulturalNote.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await CulturalNote.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await CulturalNote.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await CulturalNote.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await CulturalNote.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-explore', async (req, res) => {
  try {
    const { topic, country, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a cultural expert and language teacher. Share fascinating cultural insights that help language learners understand the context behind the language.' },
      { role: 'user', content: `Tell me about "${topic}" in ${country || 'Spanish-speaking countries'} culture. Include: 1) Cultural significance, 2) How it relates to the ${language || 'Spanish'} language, 3) Common customs or traditions, 4) Fun facts, 5) Useful phrases related to this topic.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
