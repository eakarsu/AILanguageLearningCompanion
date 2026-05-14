const router = require('express').Router();
const { DailyLesson, Progress, Quiz } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

function parseAIJson(text) {
  try { return JSON.parse(text); } catch (e) {}
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
  try { return JSON.parse(stripped); } catch (e) {}
  const start = text.indexOf('{'); const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) { try { return JSON.parse(text.slice(start, end + 1)); } catch (e) {} }
  return null;
}

// GET today's lesson for current user
router.get('/today', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const today = new Date().toISOString().split('T')[0];
    const lesson = await DailyLesson.findOne({
      where: { userId, lessonDate: today },
      order: [['createdAt', 'DESC']]
    });
    if (!lesson) return res.status(404).json({ error: 'No lesson for today. Generate one!' });
    res.json(lesson);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST generate adaptive daily lesson
router.post('/generate', auth, aiRateLimiter, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { language } = req.body;
    const lang = language || 'Spanish';

    // Fetch last 7 days of progress
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProgress = await Progress.findAll({
      where: {
        ...(userId ? { userId } : {}),
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    const progressSummary = recentProgress.length > 0
      ? recentProgress.map(p => `${p.feature}: ${p.activity} (score: ${p.score || 'N/A'})`).join(', ')
      : 'No recent activity recorded';

    const prompt = `Based on this learner's recent activity in ${lang} learning: ${progressSummary}. Create tomorrow's personalized lesson plan. Return JSON: { vocabulary_words: [{word, translation, example}], grammar_focus, conversation_scenario, estimated_minutes, difficulty_level }`;

    const content = await callOpenRouter([
      { role: 'system', content: 'You are an adaptive language learning tutor. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ], { maxTokens: 1000 });

    const parsed = parseAIJson(content);
    const today = new Date().toISOString().split('T')[0];

    const lesson = await DailyLesson.create({
      userId,
      language: lang,
      lessonDate: today,
      planData: parsed || { raw: content }
    });

    res.json(lesson);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
