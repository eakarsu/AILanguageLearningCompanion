import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import FeaturePage from './pages/FeaturePage';
import FlashcardStudy from './pages/FlashcardStudy';
import DailyLesson from './pages/DailyLesson';
import AIToolsPage from './pages/AIToolsPage';
import ForgettingCurveReview from './pages/ForgettingCurveReview';

import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

import TimelineView from './pages/TimelineView';

const features = [
  { key: 'vocabulary', label: 'Vocabulary Builder', icon: '📚', api: '/vocabulary', aiEndpoint: '/vocabulary/ai-generate', aiFields: [{name:'word',label:'Word',required:true},{name:'language',label:'Language',default:'Spanish'}], fields: ['word','translation','language','partOfSpeech','exampleSentence','pronunciation','difficulty','category'] },
  { key: 'grammar', label: 'Grammar Lessons', icon: '📝', api: '/grammar', aiEndpoint: '/grammar/ai-explain', aiFields: [{name:'topic',label:'Grammar Topic',required:true},{name:'language',label:'Language',default:'Spanish'}], fields: ['title','language','level','explanation','examples','rules','category'] },
  { key: 'conversations', label: 'Conversation Practice', icon: '💬', api: '/conversations', aiEndpoint: '/conversations/ai-chat', aiFields: [{name:'message',label:'Your Message',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'scenario',label:'Scenario',default:'casual conversation'}], fields: ['title','language','scenario','level','messages'] },
  { key: 'pronunciation', label: 'Pronunciation Guide', icon: '🗣️', api: '/pronunciation', aiEndpoint: '/pronunciation/ai-guide', aiFields: [{name:'word',label:'Word',required:true},{name:'language',label:'Language',default:'Spanish'}], fields: ['word','language','ipa','syllables','tips','commonMistakes','difficulty'] },
  { key: 'flashcards', label: 'Flashcards', icon: '🃏', api: '/flashcards', aiEndpoint: '/flashcards/ai-generate', aiFields: [{name:'topic',label:'Topic',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'count',label:'Count',default:'5'},{name:'level',label:'Level',default:'beginner'}], fields: ['front','back','language','category','difficulty','timesReviewed','timesCorrect'] },
  { key: 'quizzes', label: 'Quizzes & Assessment', icon: '🎯', api: '/quizzes', aiEndpoint: '/quizzes/ai-generate', aiFields: [{name:'topic',label:'Topic',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'level',label:'Level',default:'beginner'}], fields: ['title','language','level','type','questions','score','totalQuestions'] },
  { key: 'translations', label: 'Translation Tool', icon: '🌐', api: '/translations', aiEndpoint: '/translations/ai-translate', aiFields: [{name:'text',label:'Text to Translate',required:true},{name:'sourceLanguage',label:'Source Language',default:'English'},{name:'targetLanguage',label:'Target Language',default:'Spanish'}], fields: ['sourceText','translatedText','sourceLanguage','targetLanguage','context','aiExplanation'] },
  { key: 'writing', label: 'Writing Practice', icon: '✍️', api: '/writing', aiEndpoint: '/writing/ai-review', aiFields: [{name:'text',label:'Your Writing',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'prompt',label:'Writing Prompt'}], fields: ['title','prompt','language','level','userResponse','aiFeedback','category'] },
  { key: 'reading', label: 'Reading Comprehension', icon: '📖', api: '/reading', aiEndpoint: '/reading/ai-comprehension', aiFields: [{name:'passage',label:'Reading Passage',required:true},{name:'language',label:'Language',default:'Spanish'}], fields: ['title','content','language','level','category','questions','vocabulary'] },
  { key: 'listening', label: 'Listening Exercises', icon: '🎧', api: '/listening', aiEndpoint: '/listening/ai-exercise', aiFields: [{name:'topic',label:'Topic',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'level',label:'Level',default:'beginner'}], fields: ['title','transcript','language','level','category','questions','duration'] },
  { key: 'cultural-notes', label: 'Cultural Notes', icon: '🌍', api: '/cultural-notes', aiEndpoint: '/cultural-notes/ai-explore', aiFields: [{name:'topic',label:'Cultural Topic',required:true},{name:'country',label:'Country',default:'Spain'},{name:'language',label:'Language',default:'Spanish'}], fields: ['title','content','language','country','category','funFact'] },
  { key: 'idioms', label: 'Idioms & Phrases', icon: '💡', api: '/idioms', aiEndpoint: '/idioms/ai-explain', aiFields: [{name:'idiom',label:'Idiom',required:true},{name:'language',label:'Language',default:'Spanish'}], fields: ['phrase','meaning','language','literalTranslation','example','origin','category'] },
  { key: 'courses', label: 'Language Courses', icon: '🎓', api: '/courses', aiEndpoint: '/courses/ai-syllabus', aiFields: [{name:'courseName',label:'Course Name',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'level',label:'Level',default:'beginner'}], fields: ['title','description','language','level','totalLessons','completedLessons','category','duration'] },
  { key: 'progress', label: 'Progress Tracking', icon: '📊', api: '/progress', fields: ['feature','activity','score','timeSpent','date','language','details'] },
  { key: 'tutor', label: 'AI Tutor Chat', icon: '🤖', api: '/tutor', aiEndpoint: '/tutor/ai-chat', aiFields: [{name:'message',label:'Ask your tutor',required:true},{name:'language',label:'Language',default:'Spanish'},{name:'topic',label:'Topic',default:'general'},{name:'level',label:'Level',default:'beginner'}], fields: ['topic','language','level','messages','summary'] },
];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer theme="dark" position="bottom-right" />
      </>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar features={features} user={user} onLogout={handleLogout} extraLinks={[
          { key: 'flashcard-study', label: 'Study Now', icon: '🎯', path: '/flashcards/study' },
          { key: 'daily-lesson', label: "Today's Lesson", icon: '📅', path: '/daily-lesson' },
          { key: 'ai-tools', label: 'AI Tools', icon: '✨', path: '/ai-tools' },
          { key: 'forgetting-curve-review', label: 'Review Queue', icon: '🧠', path: '/forgetting-curve-review' },
        ]} />
        <div className="main-content">
          <Routes>
        <Route path="/insights/timeline" element={<TimelineView />} />
        <Route path="/codex/custom-viz" element={<CodexCustomVizFeature />} />
        <Route path="/codex/operations" element={<CodexOperationsFeature />} />

            <Route path="/" element={<Dashboard features={features} />} />
            {features.map(f => (
              <Route key={f.key} path={`/${f.key}`} element={<FeaturePage feature={f} />} />
            ))}
            <Route path="/flashcards/study" element={<FlashcardStudy />} />
            <Route path="/daily-lesson" element={<DailyLesson />} />
            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/forgetting-curve-review" element={<ForgettingCurveReview />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;
