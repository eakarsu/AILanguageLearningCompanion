const router = require('express').Router();
const { Idiom } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await Idiom.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Idiom.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Idiom.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Idiom.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Idiom.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-explain', async (req, res) => {
  try {
    const { idiom, language } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are an expert in idioms and expressions. Explain idioms in an engaging, memorable way that helps language learners.' },
      { role: 'user', content: `Explain the ${language || 'Spanish'} idiom "${idiom}". Include: 1) Literal translation, 2) Actual meaning, 3) English equivalent idiom if one exists, 4) Origin/history, 5) 2-3 example sentences showing usage, 6) Similar idioms in the language.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
