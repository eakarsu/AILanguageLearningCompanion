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
app.use('/api/forgetting-curve-review', require('./routes/forgettingCurveReview'));

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

const schemaReady = process.env.AUTO_INIT_SCHEMA === 'true' ? sequelize.sync({ alter: true }) : sequelize.authenticate();
app.use('/api/governed-language-learning', require('./governance'));

schemaReady.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Generated prototype routes are opt-in for isolated, non-production evaluation.
if (process.env.ENABLE_GENERATED_ROUTES === 'true' && process.env.NODE_ENV !== 'production') {
app.use('/api/conversation-partner', require('./routes/conversation-partner'));
app.use('/api/voice-tutor', require('./routes/voice-tutor'));
app.use('/api/cultural-storytelling', require('./routes/cultural-storytelling'));
app.use('/api/peer-matchmaker', require('./routes/peer-matchmaker'));
app.use('/api/vertical-vocab-pack', require('./routes/vertical-vocab-pack'));

}
// Generated gap routes remain deliberately unmounted.
