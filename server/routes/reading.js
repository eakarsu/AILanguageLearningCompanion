const router = require('express').Router();
const { ReadingPassage } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await ReadingPassage.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await ReadingPassage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await ReadingPassage.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await ReadingPassage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await ReadingPassage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-comprehension', async (req, res) => {
  try {
    const { passage, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a reading comprehension assistant for language learners. Help students understand texts and improve their reading skills.' },
      { role: 'user', content: `Analyze this ${language || 'Spanish'} passage:\n\n"${passage}"\n\nProvide: 1) English translation, 2) Key vocabulary with definitions, 3) Grammar structures used, 4) 3 comprehension questions with answers, 5) Cultural context if relevant.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
