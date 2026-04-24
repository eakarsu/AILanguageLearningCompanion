import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard({ features }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    features.forEach(async (f) => {
      try {
        const { data } = await api.get(f.api);
        setCounts(prev => ({ ...prev, [f.key]: Array.isArray(data) ? data.length : 0 }));
      } catch (e) {
        setCounts(prev => ({ ...prev, [f.key]: 0 }));
      }
    });
  }, []);

  const descriptions = {
    vocabulary: 'Build your word bank with AI-powered vocabulary suggestions and examples',
    grammar: 'Master grammar rules with interactive lessons and AI explanations',
    conversations: 'Practice real conversations with AI in various scenarios',
    pronunciation: 'Perfect your accent with detailed pronunciation guides',
    flashcards: 'Reinforce learning with smart flashcard review sessions',
    quizzes: 'Test your knowledge with AI-generated quizzes and assessments',
    translations: 'Translate text with contextual explanations and grammar notes',
    writing: 'Improve your writing skills with AI-powered feedback and corrections',
    reading: 'Enhance comprehension with curated reading passages',
    listening: 'Sharpen your listening skills with transcribed exercises',
    'cultural-notes': 'Explore cultural context behind the language you learn',
    idioms: 'Learn colorful expressions and their meanings',
    courses: 'Follow structured learning paths from beginner to advanced',
    progress: 'Track your learning journey with detailed statistics',
    tutor: 'Chat with your personal AI tutor for any language question',
  };

  return (
    <div>
      <div className="page-header">
        <h2>Welcome to LinguaAI</h2>
        <p>Your AI-powered language learning companion. Choose a feature to get started.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">16</div>
          <div className="stat-label">Features Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.values(counts).reduce((a, b) => a + b, 0)}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">AI-Powered Tools</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Spanish</div>
          <div className="stat-label">Primary Language</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {features.map(f => (
          <div
            key={f.key}
            className="feature-card"
            onClick={() => navigate(`/${f.key}`)}
          >
            <div className="card-icon">{f.icon}</div>
            <h3>{f.label}</h3>
            <p>{descriptions[f.key]}</p>
            <div className="card-count">
              {counts[f.key] !== undefined ? `${counts[f.key]} items` : 'Loading...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
