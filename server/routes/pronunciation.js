const router = require('express').Router();
const { Pronunciation } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await Pronunciation.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Pronunciation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Pronunciation.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Pronunciation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Pronunciation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-guide', async (req, res) => {
  try {
    const { word, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a pronunciation expert. Help language learners pronounce words correctly with detailed, easy-to-follow guides.' },
      { role: 'user', content: `Provide a detailed pronunciation guide for "${word}" in ${language || 'Spanish'}. Include: 1) IPA transcription, 2) Syllable breakdown, 3) Step-by-step mouth/tongue position, 4) Common mistakes English speakers make, 5) Similar-sounding words to practice, 6) Tips for improving pronunciation.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
