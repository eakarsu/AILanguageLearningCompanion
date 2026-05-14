import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function FlashcardStudy() {
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setLoading(true);
    api.get('/flashcards/due-today')
      .then(({ data }) => {
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load due cards');
        setLoading(false);
      });
  }, []);

  const current = cards[currentIdx];

  const handleReview = async (correct) => {
    try {
      await api.post(`/flashcards/${current.id}/review`, { correct });
      setSessionStats(prev => ({
        correct: correct ? prev.correct + 1 : prev.correct,
        incorrect: correct ? prev.incorrect : prev.incorrect + 1
      }));
      setFlipped(false);
      if (currentIdx + 1 >= cards.length) {
        setDone(true);
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    } catch (e) {
      toast.error('Failed to record review');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setDone(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading due cards...
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>🃏 Flashcard Study</h2>
          <p>Spaced Repetition Review</p>
        </div>
        <div className="empty-state">
          <div className="icon">🎉</div>
          <h3>No cards due today!</h3>
          <p>You're all caught up. Come back tomorrow for more reviews.</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div className="page-header">
          <h2>🃏 Session Complete!</h2>
        </div>
        <div className="detail-view" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <h3 style={{ marginBottom: 24 }}>Great work!</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#22c55e20', borderRadius: 8, padding: '16px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e' }}>{sessionStats.correct}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Correct</div>
            </div>
            <div style={{ background: '#ef444420', borderRadius: 8, padding: '16px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444' }}>{sessionStats.incorrect}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Incorrect</div>
            </div>
          </div>
          <div style={{ color: '#94a3b8', marginBottom: 24 }}>
            Accuracy: {cards.length > 0 ? Math.round((sessionStats.correct / cards.length) * 100) : 0}%
          </div>
          <button className="btn btn-primary" onClick={handleRestart}>
            Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>🃏 Flashcard Study</h2>
        <p>Spaced Repetition - {cards.length} cards due today</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>
            Card {currentIdx + 1} of {cards.length}
          </span>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ color: '#22c55e' }}>✓ {sessionStats.correct}</span>
            <span style={{ color: '#ef4444' }}>✗ {sessionStats.incorrect}</span>
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: '48px 40px',
          textAlign: 'center',
          minHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: flipped ? 'default' : 'pointer',
          border: '1px solid #334155',
          marginBottom: 20,
          transition: 'all 0.3s'
        }}
          onClick={() => !flipped && setFlipped(true)}
        >
          {!flipped ? (
            <>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                {current.language} — {current.category || 'Flashcard'}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
                {current.front}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 16 }}>
                Click to reveal
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Answer
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1', marginBottom: 12 }}>
                {current.back}
              </div>
              {current.exampleSentence && (
                <div style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', marginTop: 8 }}>
                  "{current.exampleSentence}"
                </div>
              )}
            </>
          )}
        </div>

        {flipped && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              className="btn btn-danger"
              style={{ padding: '16px', fontSize: 16 }}
              onClick={() => handleReview(false)}
            >
              ✗ Incorrect
            </button>
            <button
              style={{ padding: '16px', fontSize: 16, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleReview(true)}
            >
              ✓ Correct
            </button>
          </div>
        )}

        {!flipped && (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 8 }}>
            Click the card to reveal the answer
          </div>
        )}
      </div>
    </div>
  );
}
