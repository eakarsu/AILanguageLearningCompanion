require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
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

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
