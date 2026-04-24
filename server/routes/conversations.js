const router = require('express').Router();
const { Conversation } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await Conversation.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Conversation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Conversation.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Conversation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Conversation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-chat', async (req, res) => {
  try {
    const { message, language, scenario, conversationHistory } = req.body;
    const history = conversationHistory || [];
    const messages = [
      { role: 'system', content: `You are a friendly ${language || 'Spanish'} conversation partner. The scenario is: ${scenario || 'casual conversation'}. Respond in ${language || 'Spanish'} with an English translation in parentheses. Correct any mistakes the user makes gently. Keep responses conversational and encouraging.` },
      ...history,
      { role: 'user', content: message }
    ];
    const content = await callOpenRouter(messages);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
