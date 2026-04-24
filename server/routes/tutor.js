const router = require('express').Router();
const { TutorSession } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await TutorSession.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await TutorSession.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await TutorSession.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await TutorSession.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await TutorSession.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-chat', async (req, res) => {
  try {
    const { message, language, topic, level, history } = req.body;
    const messages = [
      { role: 'system', content: `You are an expert ${language || 'Spanish'} language tutor. The student is at ${level || 'beginner'} level. The current topic is: ${topic || 'general language learning'}. Be patient, encouraging, and thorough. Explain concepts clearly, provide examples, and adapt to the student's level. Use markdown formatting for better readability.` },
      ...(history || []),
      { role: 'user', content: message }
    ];
    const content = await callOpenRouter(messages, { maxTokens: 1500 });
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
