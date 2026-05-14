require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const { aiRateLimiter } = require('./middleware/rateLimiter');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/writing', require('./routes/writing'));
app.use('/api/reading', require('./routes/reading'));
app.use('/api/listening', require('./routes/listening'));
app.use('/api/cultural-notes', require('./routes/culturalNotes'));
app.use('/api/idioms', require('./routes/idioms'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/tutor', require('./routes/tutor'));
app.use('/api/pronunciation', require('./routes/pronunciation'));
app.use('/api/ai/daily-lesson', require('./routes/dailyLesson'));
app.use('/api/ai', require('./routes/ai'));

// Apply rate limiter to all generic AI sub-routes
const aiRoutes = [
  '/api/flashcards/ai-generate',
  '/api/vocabulary/ai-generate',
  '/api/grammar/ai-explain',
  '/api/conversations/ai-chat',
  '/api/quizzes/ai-generate',
  '/api/translations/ai-translate',
  '/api/writing/ai-review',
  '/api/reading/ai-comprehension',
  '/api/listening/ai-exercise',
  '/api/cultural-notes/ai-explore',
  '/api/idioms/ai-explain',
  '/api/courses/ai-syllabus',
  '/api/tutor/ai-chat',
  '/api/pronunciation/ai-guide',
];

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/conversation-partner', require('./routes/conversation-partner'));
app.use('/api/voice-tutor', require('./routes/voice-tutor'));
app.use('/api/cultural-storytelling', require('./routes/cultural-storytelling'));
app.use('/api/peer-matchmaker', require('./routes/peer-matchmaker'));
app.use('/api/vertical-vocab-pack', require('./routes/vertical-vocab-pack'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_ai_tutor_response = require('./routes/gap-ai-tutor-response'); app.use('/api/gap-ai-tutor-response', _gap_ai_tutor_response); } catch(e) { console.error('gap mount fail ai-tutor-response:', e.message); }
try { const _gap_ai_grammar_correction = require('./routes/gap-ai-grammar-correction'); app.use('/api/gap-ai-grammar-correction', _gap_ai_grammar_correction); } catch(e) { console.error('gap mount fail ai-grammar-correction:', e.message); }
try { const _gap_ai_pronunciation_feedback = require('./routes/gap-ai-pronunciation-feedback'); app.use('/api/gap-ai-pronunciation-feedback', _gap_ai_pronunciation_feedback); } catch(e) { console.error('gap mount fail ai-pronunciation-feedback:', e.message); }
try { const _gap_ai_personalized_lesson_plan = require('./routes/gap-ai-personalized-lesson-plan'); app.use('/api/gap-ai-personalized-lesson-plan', _gap_ai_personalized_lesson_plan); } catch(e) { console.error('gap mount fail ai-personalized-lesson-plan:', e.message); }
try { const _gap_ai_idiom_explanation = require('./routes/gap-ai-idiom-explanation'); app.use('/api/gap-ai-idiom-explanation', _gap_ai_idiom_explanation); } catch(e) { console.error('gap mount fail ai-idiom-explanation:', e.message); }
try { const _gap_speech_to_text = require('./routes/gap-speech-to-text'); app.use('/api/gap-speech-to-text', _gap_speech_to_text); } catch(e) { console.error('gap mount fail speech-to-text:', e.message); }
try { const _gap_community = require('./routes/gap-community'); app.use('/api/gap-community', _gap_community); } catch(e) { console.error('gap mount fail community:', e.message); }
try { const _gap_streak = require('./routes/gap-streak'); app.use('/api/gap-streak', _gap_streak); } catch(e) { console.error('gap mount fail streak:', e.message); }
try { const _gap_certification = require('./routes/gap-certification'); app.use('/api/gap-certification', _gap_certification); } catch(e) { console.error('gap mount fail certification:', e.message); }
try { const _gap_teacher = require('./routes/gap-teacher'); app.use('/api/gap-teacher', _gap_teacher); } catch(e) { console.error('gap mount fail teacher:', e.message); }
try { const _gap_limited = require('./routes/gap-limited'); app.use('/api/gap-limited', _gap_limited); } catch(e) { console.error('gap mount fail limited:', e.message); }
// === End Batch 05 Mounts ===
