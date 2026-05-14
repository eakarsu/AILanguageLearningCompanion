import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const fieldLabels = {
  word: 'Word', translation: 'Translation', language: 'Language', partOfSpeech: 'Part of Speech',
  exampleSentence: 'Example Sentence', pronunciation: 'Pronunciation', difficulty: 'Difficulty',
  category: 'Category', title: 'Title', level: 'Level', explanation: 'Explanation', examples: 'Examples',
  rules: 'Rules', scenario: 'Scenario', messages: 'Messages', front: 'Front', back: 'Back',
  timesReviewed: 'Times Reviewed', timesCorrect: 'Times Correct', type: 'Type', questions: 'Questions',
  score: 'Score', totalQuestions: 'Total Questions', sourceText: 'Source Text',
  translatedText: 'Translated Text', sourceLanguage: 'Source Language', targetLanguage: 'Target Language',
  context: 'Context', aiExplanation: 'AI Explanation', prompt: 'Prompt', userResponse: 'User Response',
  aiFeedback: 'AI Feedback', content: 'Content', vocabulary: 'Vocabulary', transcript: 'Transcript',
  duration: 'Duration', country: 'Country', funFact: 'Fun Fact', phrase: 'Phrase', meaning: 'Meaning',
  literalTranslation: 'Literal Translation', example: 'Example', origin: 'Origin',
  description: 'Description', totalLessons: 'Total Lessons', completedLessons: 'Completed Lessons',
  feature: 'Feature', activity: 'Activity', timeSpent: 'Time Spent (min)', date: 'Date',
  details: 'Details', topic: 'Topic', summary: 'Summary', ipa: 'IPA', syllables: 'Syllables',
  tips: 'Tips', commonMistakes: 'Common Mistakes', audioDescription: 'Audio Description',
};

const getDisplayColumns = (fields) => {
  const priorityFields = ['word', 'title', 'phrase', 'front', 'sourceText', 'topic', 'feature', 'activity'];
  const cols = [];
  for (const pf of priorityFields) {
    if (fields.includes(pf)) cols.push(pf);
  }
  for (const f of fields) {
    if (!cols.includes(f) && cols.length < 5 && !['messages', 'explanation', 'examples', 'rules', 'content', 'transcript', 'questions', 'vocabulary', 'aiFeedback', 'aiExplanation', 'userResponse', 'details', 'summary', 'tips', 'commonMistakes', 'audioDescription', 'origin', 'funFact'].includes(f)) {
      cols.push(f);
    }
  }
  return cols;
};

const getBadgeClass = (val) => {
  if (!val) return '';
  const v = val.toLowerCase();
  if (v === 'beginner') return 'badge-beginner';
  if (v === 'intermediate') return 'badge-intermediate';
  if (v === 'advanced') return 'badge-advanced';
  return 'badge-primary';
};

// Extract bilingual corrections from AI response
function extractCorrections(text) {
  if (!text) return null;
  const correctionPattern = /correction|corrected|should be|instead of|better:/i;
  if (!correctionPattern.test(text)) return null;
  const lines = text.split('\n').filter(l => correctionPattern.test(l));
  return lines.length > 0 ? lines : null;
}

const PAGINATED_FEATURES = ['flashcards', 'vocabulary', 'progress'];

export default function FeaturePage({ feature }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiFormData, setAiFormData] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);

  const isPaginated = PAGINATED_FEATURES.includes(feature.key);

  const fetchItems = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const url = isPaginated ? `${feature.api}?page=${p}&limit=20` : feature.api;
      const { data } = await api.get(url);
      if (isPaginated && data.data) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setPagination(data.pagination || { totalPages: 1, total: 0 });
      } else {
        setItems(Array.isArray(data) ? data : []);
        setPagination({ totalPages: 1, total: Array.isArray(data) ? data.length : 0 });
      }
    } catch (err) {
      toast.error('Failed to load data');
    }
    setLoading(false);
  }, [feature.api, isPaginated]);

  useEffect(() => {
    setPage(1);
    setSelectedItem(null);
    setAiResponse('');
    setAiFormData({});
    setGeneratedFlashcards([]);
    fetchItems(1);
  }, [feature.key]);

  useEffect(() => {
    if (page > 1) fetchItems(page);
  }, [page]);

  const handleRowClick = async (item) => {
    try {
      const { data } = await api.get(`${feature.api}/${item.id}`);
      setSelectedItem(data);
    } catch {
      setSelectedItem(item);
    }
  };

  const handleCreate = () => {
    const initial = {};
    feature.fields.forEach(f => { initial[f] = ''; });
    setFormData(initial);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = () => {
    const data = {};
    feature.fields.forEach(f => { data[f] = selectedItem[f] || ''; });
    setFormData(data);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`${feature.api}/${selectedItem.id}`);
      toast.success('Deleted successfully');
      setSelectedItem(null);
      fetchItems(page);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`${feature.api}/${selectedItem.id}`, formData);
        toast.success('Updated successfully');
      } else {
        await api.post(feature.api, formData);
        toast.success('Created successfully');
      }
      setShowModal(false);
      setSelectedItem(null);
      fetchItems(page);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleAiAction = async () => {
    if (!feature.aiEndpoint) return;
    setAiLoading(true);
    setAiResponse('');
    setGeneratedFlashcards([]);
    try {
      const payload = {};
      feature.aiFields.forEach(f => {
        payload[f.name] = aiFormData[f.name] || f.default || '';
      });
      const { data } = await api.post(feature.aiEndpoint, payload);

      if (feature.key === 'flashcards' && data.flashcards) {
        // Structured flashcard response - bulk inserted in DB
        setGeneratedFlashcards(data.flashcards);
        toast.success(`${data.count} flashcards created and saved!`);
        fetchItems(1);
      } else {
        setAiResponse(data.aiResponse || data.content || JSON.stringify(data));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI request failed');
    }
    setAiLoading(false);
  };

  const displayCols = getDisplayColumns(feature.fields);
  const corrections = feature.key === 'conversations' ? extractCorrections(aiResponse) : null;

  if (selectedItem) {
    return (
      <div>
        <button className="back-btn" onClick={() => setSelectedItem(null)}>
          Back to {feature.label}
        </button>
        <div className="detail-view">
          <div className="detail-header">
            <h3>{selectedItem[displayCols[0]] || `Item #${selectedItem.id}`}</h3>
            <div className="btn-group">
              <button className="btn btn-secondary btn-sm" onClick={handleEdit}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="detail-grid">
            {feature.fields.map(f => {
              const val = selectedItem[f];
              if (val === null || val === undefined || val === '') return null;
              return (
                <div key={f} className="detail-field" style={['explanation','examples','rules','content','transcript','details','summary','tips','commonMistakes','exampleSentence','funFact','origin','prompt','userResponse','aiFeedback','aiExplanation','description'].includes(f) ? { gridColumn: '1 / -1' } : {}}>
                  <div className="label">{fieldLabels[f] || f}</div>
                  <div className="value">
                    {(f === 'difficulty' || f === 'level') ? (
                      <span className={`badge ${getBadgeClass(String(val))}`}>{String(val)}</span>
                    ) : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="detail-field" style={{ marginTop: '12px' }}>
            <div className="label">Created</div>
            <div className="value">{new Date(selectedItem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {feature.aiEndpoint && (
          <div className="detail-view">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🤖</span> AI Assistant
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {feature.aiFields.map(af => (
                <div key={af.name} className="form-group" style={{ marginBottom: 0 }}>
                  <label>{af.label}</label>
                  <input
                    className="form-control"
                    value={aiFormData[af.name] || af.default || ''}
                    onChange={e => setAiFormData(prev => ({ ...prev, [af.name]: e.target.value }))}
                    placeholder={af.label}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-ai" onClick={handleAiAction} disabled={aiLoading}>
              {aiLoading ? (
                <><span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '0' }}></span> Generating...</>
              ) : (
                <><span>✨</span> Ask AI</>
              )}
            </button>
            {aiResponse && (
              <div className="ai-response">
                <div className="ai-content">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>{feature.icon} {feature.label}</h2>
        <p>Manage your {feature.label.toLowerCase()} with AI-powered assistance</p>
      </div>

      {feature.aiEndpoint && (
        <div className="detail-view" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🤖</span> AI Assistant - {feature.label}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {feature.aiFields.map(af => (
              <div key={af.name} className="form-group" style={{ marginBottom: 0 }}>
                <label>{af.label}</label>
                {af.name === 'message' || af.name === 'text' || af.name === 'passage' ? (
                  <textarea
                    className="form-control"
                    value={aiFormData[af.name] || ''}
                    onChange={e => setAiFormData(prev => ({ ...prev, [af.name]: e.target.value }))}
                    placeholder={af.label}
                    rows={3}
                  />
                ) : (
                  <input
                    className="form-control"
                    value={aiFormData[af.name] || af.default || ''}
                    onChange={e => setAiFormData(prev => ({ ...prev, [af.name]: e.target.value }))}
                    placeholder={af.label}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-ai" onClick={handleAiAction} disabled={aiLoading}>
              {aiLoading ? (
                <><span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '0' }}></span> Generating...</>
              ) : (
                <><span>✨</span> Ask AI</>
              )}
            </button>
            {feature.key === 'flashcards' && (
              <button className="btn btn-secondary" onClick={() => navigate('/flashcards/study')}>
                🎯 Study Due Cards
              </button>
            )}
          </div>

          {/* Structured flashcard preview after AI generation */}
          {feature.key === 'flashcards' && generatedFlashcards.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#e2e8f0' }}>
                Generated & Saved {generatedFlashcards.length} Flashcards:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {generatedFlashcards.map((fc, idx) => (
                  <div key={idx} style={{
                    background: '#0f172a',
                    borderRadius: 8,
                    padding: '14px 16px',
                    border: '1px solid #1e293b'
                  }}>
                    <div style={{ fontWeight: 700, color: '#6366f1', marginBottom: 6 }}>{fc.front}</div>
                    <div style={{ color: '#e2e8f0', fontSize: 14 }}>{fc.back}</div>
                    {fc.exampleSentence && (
                      <div style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic', marginTop: 6 }}>"{fc.exampleSentence}"</div>
                    )}
                    <span className={`badge ${getBadgeClass(fc.difficulty || 'beginner')}`} style={{ marginTop: 8, display: 'inline-block' }}>
                      {fc.difficulty || 'beginner'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiResponse && (
            <div className="ai-response">
              {corrections && corrections.length > 0 && (
                <div style={{
                  background: '#f59e0b15',
                  border: '1px solid #f59e0b40',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 12
                }}>
                  <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: 8, fontSize: 13 }}>
                    Language Corrections
                  </div>
                  {corrections.map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#fbbf24', marginBottom: 4 }}>{c}</div>
                  ))}
                </div>
              )}
              <div className="ai-content">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="data-table-container">
        <div className="table-header">
          <h3>{pagination.total || items.length} {feature.label}</h3>
          <button className="btn btn-primary" onClick={handleCreate}>
            + New Item
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">{feature.icon}</div>
            <h3>No items yet</h3>
            <p>Click "New Item" to add your first entry</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {displayCols.map(c => (
                    <th key={c}>{fieldLabels[c] || c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} onClick={() => handleRowClick(item)}>
                    <td>{(page - 1) * 20 + idx + 1}</td>
                    {displayCols.map(c => (
                      <td key={c}>
                        {(c === 'difficulty' || c === 'level') ? (
                          <span className={`badge ${getBadgeClass(String(item[c] || ''))}`}>{item[c] || '-'}</span>
                        ) : (
                          String(item[c] || '-').substring(0, 60) + (String(item[c] || '').length > 60 ? '...' : '')
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {isPaginated && pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ opacity: page <= 1 ? 0.4 : 1 }}
                >
                  Prev
                </button>
                <span style={{ color: '#94a3b8', fontSize: 14 }}>
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  style={{ opacity: page >= pagination.totalPages ? 0.4 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editMode ? 'Edit Item' : 'New Item'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {feature.fields.map(f => (
                  <div key={f} className="form-group">
                    <label>{fieldLabels[f] || f}</label>
                    {['explanation','examples','rules','content','transcript','details','summary','tips','commonMistakes','exampleSentence','funFact','origin','prompt','userResponse','aiFeedback','aiExplanation','description','messages'].includes(f) ? (
                      <textarea
                        className="form-control"
                        value={formData[f] || ''}
                        onChange={e => setFormData(prev => ({ ...prev, [f]: e.target.value }))}
                        rows={3}
                      />
                    ) : f === 'difficulty' || f === 'level' ? (
                      <select
                        className="form-control"
                        value={formData[f] || ''}
                        onChange={e => setFormData(prev => ({ ...prev, [f]: e.target.value }))}
                      >
                        <option value="">Select...</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        type={['score','totalQuestions','totalLessons','completedLessons','timesReviewed','timesCorrect','timeSpent'].includes(f) ? 'number' : f === 'date' ? 'date' : 'text'}
                        value={formData[f] || ''}
                        onChange={e => setFormData(prev => ({ ...prev, [f]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
