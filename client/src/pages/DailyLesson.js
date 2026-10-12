import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AIReport from '../components/AIReport';
import NativeAIPresets from '../components/NativeAIPresets';

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
        <NativeAIPresets fields={[{ name: 'language' }]} disabled={generating} onChoose={(values) => setLanguage(values.language)} />
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

          <AIReport response={plan} title="Today's lesson plan" />
          {plan.conversation_scenario && <button className="btn btn-primary" onClick={() => { window.location.href = '/conversations'; }}>Start Conversation Practice</button>}
        </div>
      )}
    </div>
  );
}
