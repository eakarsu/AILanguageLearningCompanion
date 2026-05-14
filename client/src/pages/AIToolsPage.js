import React, { useState } from 'react';
import api from '../services/api';

const TOOLS = [
  {
    key: 'grammar-correction',
    label: 'Grammar Correction',
    icon: '📝',
    endpoint: '/ai/grammar-correction',
    description: 'Correct writing exercises with structured error annotation.',
    fields: [
      { key: 'text', label: 'Your Writing', type: 'textarea', required: true },
      { key: 'language', label: 'Language', type: 'text', placeholder: 'Spanish' },
      { key: 'level', label: 'Learner Level', type: 'text', placeholder: 'beginner' },
    ],
  },
  {
    key: 'personalized-lesson-plan',
    label: 'Personalized Lesson Plan',
    icon: '🎓',
    endpoint: '/ai/personalized-lesson-plan',
    description: 'Adaptive lesson plan from level, goals, weak areas, available minutes.',
    fields: [
      { key: 'language', label: 'Language', type: 'text', placeholder: 'Spanish' },
      { key: 'level', label: 'Level', type: 'text', placeholder: 'beginner' },
      { key: 'goals', label: 'Goals', type: 'textarea' },
      { key: 'weakAreas', label: 'Weak Areas', type: 'textarea' },
      { key: 'minutes', label: 'Available Minutes', type: 'number', placeholder: '30' },
    ],
  },
  {
    key: 'pronunciation-feedback',
    label: 'Pronunciation Feedback',
    icon: '🎤',
    endpoint: '/ai/pronunciation-feedback',
    description: 'Text-only pronunciation coaching: IPA, stress, drills, common L1-interference mistakes.',
    fields: [
      { key: 'phrase', label: 'Phrase to Practice', type: 'textarea', required: true },
      { key: 'language', label: 'Target Language', type: 'text', placeholder: 'Spanish' },
      { key: 'learnerNativeLanguage', label: 'Learner Native Language', type: 'text', placeholder: 'English' },
      { key: 'level', label: 'Level', type: 'text', placeholder: 'beginner' },
    ],
  },
  {
    key: 'idiom-explanation',
    label: 'Idiom Explanation',
    icon: '💡',
    endpoint: '/ai/idiom-explanation',
    description: 'Cultural context, register, examples, related idioms.',
    fields: [
      { key: 'idiom', label: 'Idiom', type: 'text', required: true },
      { key: 'language', label: 'Language', type: 'text', placeholder: 'Spanish' },
    ],
  },
];

export default function AIToolsPage() {
  const [active, setActive] = useState(TOOLS[0].key);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tool = TOOLS.find(t => t.key === active);

  const handleChange = (key, value) => setInputs(prev => ({ ...prev, [key]: value }));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {};
      tool.fields.forEach(f => {
        const v = inputs[f.key];
        if (v === undefined || v === '') return;
        payload[f.key] = f.type === 'number' ? Number(v) : v;
      });
      const res = await api.post(tool.endpoint, payload);
      setResult(res.data);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.error || e?.response?.data?.message || e.message || 'Request failed';
      setError(status === 503 ? `AI provider not configured (503): ${msg}` : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>✨ AI Tools</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {TOOLS.map(t => (
          <div
            key={t.key}
            onClick={() => { setActive(t.key); setInputs({}); setResult(null); setError(null); }}
            style={{
              padding: '16px',
              background: active === t.key ? 'var(--accent, #4f46e5)' : 'var(--card-bg, #1e293b)',
              color: active === t.key ? '#fff' : 'inherit',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid var(--border, #334155)',
            }}
          >
            <div style={{ fontSize: '24px' }}>{t.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{t.label}</div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>{t.description}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '720px', background: 'var(--card-bg, #1e293b)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border, #334155)' }}>
        <h2>{tool.icon} {tool.label}</h2>
        <p style={{ opacity: 0.85, marginBottom: '16px' }}>{tool.description}</p>

        {tool.fields.map(field => (
          <div key={field.key} style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>
              {field.label}{field.required ? ' *' : ''}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                value={inputs[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #334155)', background: 'var(--input-bg, #0f172a)', color: 'inherit' }}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={inputs[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #334155)', background: 'var(--input-bg, #0f172a)', color: 'inherit' }}
              />
            )}
          </div>
        ))}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            fontSize: '16px',
            background: 'var(--accent, #4f46e5)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Running…' : 'Run AI Tool'}
        </button>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#3a1f1f', border: '1px solid #7f1d1d', color: '#fecaca', borderRadius: '6px' }}>
            {String(error)}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--input-bg, #0f172a)', borderRadius: '8px', border: '1px solid var(--border, #334155)' }}>
            <h3 style={{ marginBottom: '12px' }}>Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '13px' }}>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
