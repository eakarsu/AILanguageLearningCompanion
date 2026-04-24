const router = require('express').Router();
const { ListeningExercise } = require('../models');
const { callOpenRouter } = require('../services/openrouter');

router.get('/', async (req, res) => {
  try { res.json(await ListeningExercise.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await ListeningExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await ListeningExercise.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await ListeningExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await ListeningExercise.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-exercise', async (req, res) => {
  try {
    const { topic, language, level } = req.body;
    const content = await callOpenRouter([
      { role: 'system', content: 'You are a listening exercise creator for language learners. Create engaging audio transcript scenarios with comprehension exercises.' },
      { role: 'user', content: `Create a ${level || 'beginner'} listening exercise in ${language || 'Spanish'} about "${topic}". Include: 1) A dialogue transcript (2-3 minutes), 2) English translation, 3) Key phrases to listen for, 4) 3 comprehension questions, 5) Vocabulary from the dialogue.` }
    ]);
    res.json({ aiResponse: content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
