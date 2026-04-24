const router = require('express').Router();
const { WritingExercise } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await WritingExercise.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await WritingExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await WritingExercise.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await WritingExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await WritingExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-review', async (req, res) => {
  try {
    const { text, language, prompt } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: `You are a ${language || 'Spanish'} writing tutor. Review the student's writing and provide detailed, constructive feedback. Use markdown formatting.` },
      { role: 'user', content: `The writing prompt was: "${prompt}"\n\nThe student wrote:\n"${text}"\n\nPlease review this ${language || 'Spanish'} writing. Provide: 1) Overall assessment, 2) Grammar corrections with explanations, 3) Vocabulary suggestions, 4) Style improvements, 5) A corrected version of the text.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
