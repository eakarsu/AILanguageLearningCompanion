const router = require('express').Router();
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Strip markdown fences and parse JSON
function parseJson(text) {
  if (!text) return null;
  const stripped = String(text).replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  try { return JSON.parse(stripped); } catch (_) { return null; }
}

// POST /api/ai/grammar-correction — auto-correct writing exercises
router.post('/grammar-correction', aiRateLimiter, async (req, res) => {
  try {
    const { text, language = 'Spanish', level = 'beginner' } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const messages = [
      { role: 'system', content: `You are an expert ${language} language teacher. Correct grammar and writing for a ${level} student. Respond with valid JSON only, no markdown fences.` },
      { role: 'user', content: `Correct this ${language} text and explain the corrections.

Text: """${text}"""

Return JSON: { corrected_text, errors: [{ original, correction, type, explanation }], overall_feedback, level_assessment }` }
    ];
    const content = await callOpenRouter(messages, { maxTokens: 1500 });
    res.json({ raw: content, structured: parseJson(content) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/ai/personalized-lesson-plan — adaptive lesson plan
router.post('/personalized-lesson-plan', aiRateLimiter, async (req, res) => {
  try {
    const { language = 'Spanish', level = 'beginner', goals, weakAreas = [], availableMinutes = 30 } = req.body;
    const messages = [
      { role: 'system', content: 'You are a curriculum designer for language learning. Respond with valid JSON only, no markdown fences.' },
      { role: 'user', content: `Build a personalized ${language} lesson plan.

Student level: ${level}
Goals: ${goals || 'general fluency'}
Weak areas: ${(weakAreas || []).join(', ') || 'none reported'}
Available minutes: ${availableMinutes}

Return JSON: { plan_title, total_minutes, blocks: [{ topic, activity, minutes, materials, success_criteria }], next_lesson_focus, expected_outcomes }` }
    ];
    const content = await callOpenRouter(messages, { maxTokens: 1500 });
    res.json({ raw: content, structured: parseJson(content) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/ai/idiom-explanation — cultural context + usage examples
router.post('/idiom-explanation', aiRateLimiter, async (req, res) => {
  try {
    const { idiom, language = 'Spanish' } = req.body;
    if (!idiom) return res.status(400).json({ error: 'idiom is required' });

    const messages = [
      { role: 'system', content: `You are a cultural-linguistic expert in ${language}. Respond with valid JSON only, no markdown fences.` },
      { role: 'user', content: `Explain this idiom: "${idiom}"

Return JSON: { idiom, literal_translation, meaning, cultural_origin, usage_register ("formal" | "casual" | "regional"), example_sentences: [{ sentence, translation }], related_idioms: [] }` }
    ];
    const content = await callOpenRouter(messages, { maxTokens: 1200 });
    res.json({ raw: content, structured: parseJson(content) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/ai/pronunciation-feedback — text-based pronunciation guidance (no audio)
router.post('/pronunciation-feedback', aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI provider not configured. Set OPENROUTER_API_KEY in server/.env to enable this endpoint.' });
    }
    const { phrase, language = 'Spanish', learnerNativeLanguage = 'English', level = 'beginner' } = req.body;
    if (!phrase) return res.status(400).json({ error: 'phrase is required' });

    const messages = [
      { role: 'system', content: `You are a pronunciation coach for ${language}. The learner speaks ${learnerNativeLanguage} natively (level: ${level}). Respond with valid JSON only, no markdown fences.` },
      { role: 'user', content: `Provide pronunciation feedback for this phrase a learner is practicing.

Phrase: """${phrase}"""

Return JSON: {
  "phrase": "",
  "ipa": "",
  "syllable_breakdown": [],
  "stressed_syllable_index": 0,
  "common_mistakes_for_${learnerNativeLanguage}_speakers": [],
  "mouth_position_tips": [],
  "minimal_pairs_to_practice": [],
  "drill_steps": [],
  "self_check_questions": []
}` }
    ];
    const content = await callOpenRouter(messages, { maxTokens: 1200 });
    res.json({ raw: content, structured: parseJson(content) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/ai/routes-inventory — discoverability for all ai-bearing routes
router.get('/routes-inventory', (_req, res) => {
  res.json({
    namespace: '/api/ai',
    endpoints: [
      { method: 'POST', path: '/api/ai/grammar-correction', description: 'Correct writing exercises.' },
      { method: 'POST', path: '/api/ai/personalized-lesson-plan', description: 'Adaptive lesson plan.' },
      { method: 'POST', path: '/api/ai/idiom-explanation', description: 'Idiom cultural context + examples.' },
      { method: 'POST', path: '/api/ai/pronunciation-feedback', description: 'Text-only pronunciation coaching.' },
    ],
    related_namespaces: [
      { mount: '/api/tutor', endpoint: 'POST /api/tutor/ai-chat', description: 'Conversational tutor (== /ai/tutor-response).' },
      { mount: '/api/grammar', description: 'Grammar drills + AI-backed exercises.' },
      { mount: '/api/pronunciation', description: 'Pronunciation flows.' },
      { mount: '/api/writing', description: 'Writing prompts and feedback.' },
    ],
  });
});

module.exports = router;
