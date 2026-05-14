import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function DailyLesson() {
  const [lesson, setLesson] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('Spanish');

  useEffect(() => {
    api.get('/ai/daily-lesson/today')
      .then(({ data }) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const generateLesson = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/ai/daily-lesson/generate', { language });
      setLesson(data);
      toast.success("Today's lesson plan generated!");
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to generate lesson');
    }
    setGenerating(false);
  };

  const plan = lesson?.planData;

  return (
    <div>
      <div className="page-header">
        <h2>📅 Daily Lesson Plan</h2>
        <p>AI-personalized lessons based on your learning history</p>
      </div>

      <div className="detail-view" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Language</label>
            <select
              className="form-control"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{ minWidth: 140 }}
            >
              {['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Korean', 'Arabic'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-ai"
            onClick={generateLesson}
            disabled={generating}
            style={{ alignSelf: 'flex-end' }}
          >
            {generating ? (
              <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2, marginRight: 0 }}></span> Generating...</>
            ) : (
              <><span>✨</span> Generate Today's Lesson</>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="loading-spinner"></div>Loading...</div>
      ) : !lesson || !plan ? (
        <div className="empty-state">
          <div className="icon">📅</div>
          <h3>No lesson for today yet</h3>
          <p>Click "Generate Today's Lesson" to get your personalized study plan.</p>
        </div>
      ) : (
        <div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
            {lesson.language} lesson — {new Date(lesson.createdAt).toLocaleDateString()}
            {plan.estimated_minutes && <span style={{ marginLeft: 12 }}>~{plan.estimated_minutes} min</span>}
            {plan.difficulty_level && (
              <span className={`badge badge-${plan.difficulty_level?.toLowerCase()} `} style={{ marginLeft: 12 }}>
                {plan.difficulty_level}
              </span>
            )}
          </div>

          {/* Vocabulary Words */}
          {Array.isArray(plan.vocabulary_words) && plan.vocabulary_words.length > 0 && (
            <div className="detail-view" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>📚 Vocabulary Words</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {plan.vocabulary_words.map((w, idx) => (
                  <div key={idx} style={{
                    background: '#0f172a',
                    borderRadius: 8,
                    padding: '14px 16px',
                    border: '1px solid #1e293b'
                  }}>
                    <div style={{ fontWeight: 700, color: '#6366f1', fontSize: 16 }}>{w.word}</div>
                    <div style={{ color: '#e2e8f0', marginTop: 4 }}>{w.translation}</div>
                    {w.example && (
                      <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 6 }}>
                        "{w.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Focus */}
          {plan.grammar_focus && (
            <div className="detail-view" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 12 }}>📝 Grammar Focus</h3>
              <div style={{ color: '#e2e8f0', lineHeight: 1.7 }}>
                {plan.grammar_focus}
              </div>
            </div>
          )}

          {/* Conversation Scenario */}
          {plan.conversation_scenario && (
            <div className="detail-view" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 12 }}>💬 Conversation Scenario</h3>
              <div style={{ color: '#e2e8f0', lineHeight: 1.7, marginBottom: 16 }}>
                {plan.conversation_scenario}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const path = `/conversations`;
                  window.location.href = path;
                }}
              >
                Start Conversation Practice
              </button>
            </div>
          )}

          {/* Fallback: raw plan */}
          {plan.raw && (
            <div className="detail-view">
              <h3 style={{ marginBottom: 12 }}>Today's Plan</h3>
              <div style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', fontSize: 14 }}>{plan.raw}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
