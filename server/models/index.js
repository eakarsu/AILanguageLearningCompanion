const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  nativeLanguage: { type: DataTypes.STRING, defaultValue: 'English' },
  learningLanguage: { type: DataTypes.STRING, defaultValue: 'Spanish' },
  level: { type: DataTypes.STRING, defaultValue: 'Beginner' },
});

const Vocabulary = sequelize.define('Vocabulary', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  word: { type: DataTypes.STRING, allowNull: false },
  translation: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  partOfSpeech: { type: DataTypes.STRING },
  exampleSentence: { type: DataTypes.TEXT },
  pronunciation: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING, defaultValue: 'beginner' },
  category: { type: DataTypes.STRING },
});

const GrammarLesson = sequelize.define('GrammarLesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  explanation: { type: DataTypes.TEXT },
  examples: { type: DataTypes.TEXT },
  rules: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
});

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  scenario: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  messages: { type: DataTypes.TEXT, defaultValue: '[]' },
  aiResponse: { type: DataTypes.TEXT },
});

const Flashcard = sequelize.define('Flashcard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  front: { type: DataTypes.STRING, allowNull: false },
  back: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING, defaultValue: 'beginner' },
  timesReviewed: { type: DataTypes.INTEGER, defaultValue: 0 },
  timesCorrect: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER },
  exampleSentence: { type: DataTypes.TEXT },
  nextReviewDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  intervalDays: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Quiz = sequelize.define('Quiz', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  questions: { type: DataTypes.TEXT },
  score: { type: DataTypes.INTEGER },
  totalQuestions: { type: DataTypes.INTEGER },
});

const Translation = sequelize.define('Translation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sourceText: { type: DataTypes.TEXT, allowNull: false },
  translatedText: { type: DataTypes.TEXT },
  sourceLanguage: { type: DataTypes.STRING, allowNull: false },
  targetLanguage: { type: DataTypes.STRING, allowNull: false },
  context: { type: DataTypes.STRING },
  aiExplanation: { type: DataTypes.TEXT },
});

const WritingExercise = sequelize.define('WritingExercise', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  prompt: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  userResponse: { type: DataTypes.TEXT },
  aiFeedback: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
});

const ReadingPassage = sequelize.define('ReadingPassage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  questions: { type: DataTypes.TEXT },
  vocabulary: { type: DataTypes.TEXT },
});

const ListeningExercise = sequelize.define('ListeningExercise', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  transcript: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  questions: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING },
});

const CulturalNote = sequelize.define('CulturalNote', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  funFact: { type: DataTypes.TEXT },
});

const Idiom = sequelize.define('Idiom', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phrase: { type: DataTypes.STRING, allowNull: false },
  meaning: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  literalTranslation: { type: DataTypes.STRING },
  example: { type: DataTypes.TEXT },
  origin: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
});

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  totalLessons: { type: DataTypes.INTEGER },
  completedLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
  category: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
});

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  feature: { type: DataTypes.STRING, allowNull: false },
  activity: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.INTEGER },
  timeSpent: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY, defaultValue: Sequelize.NOW },
  language: { type: DataTypes.STRING },
  details: { type: DataTypes.TEXT },
  userId: { type: DataTypes.INTEGER },
});

const DailyLesson = sequelize.define('DailyLesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  language: { type: DataTypes.STRING, allowNull: false },
  lessonDate: { type: DataTypes.DATEONLY, defaultValue: Sequelize.NOW },
  planData: { type: DataTypes.JSONB },
});

const TutorSession = sequelize.define('TutorSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  topic: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  messages: { type: DataTypes.TEXT, defaultValue: '[]' },
  summary: { type: DataTypes.TEXT },
});

const Pronunciation = sequelize.define('Pronunciation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  word: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  ipa: { type: DataTypes.STRING },
  syllables: { type: DataTypes.STRING },
  tips: { type: DataTypes.TEXT },
  commonMistakes: { type: DataTypes.TEXT },
  audioDescription: { type: DataTypes.TEXT },
  difficulty: { type: DataTypes.STRING, defaultValue: 'beginner' },
});

module.exports = {
  sequelize,
  User,
  Vocabulary,
  GrammarLesson,
  Conversation,
  Flashcard,
  Quiz,
  Translation,
  WritingExercise,
  ReadingPassage,
  ListeningExercise,
  CulturalNote,
  Idiom,
  Course,
  Progress,
  TutorSession,
  Pronunciation,
  DailyLesson,
};
