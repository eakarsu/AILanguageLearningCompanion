const router = require('express').Router();
const { Translation } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await Translation.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Translation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Translation.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Translation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Translation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are an expert translator and language teacher. Provide translations with context, alternative translations, and learning insights.' },
      { role: 'user', content: `Translate the following from ${sourceLanguage || 'English'} to ${targetLanguage || 'Spanish'}:\n\n"${text}"\n\nProvide: 1) Direct translation, 2) Alternative translations if applicable, 3) Grammar notes about the translation, 4) Cultural context or usage tips.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
