import React, { useEffect, useState } from 'react';
export default function ForgettingCurveReview() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/forgetting-curve-review').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return <div><h1>Forgetting Curve Review Queue</h1><p>Prioritizes vocabulary reviews by elapsed time and accuracy decay.</p>{data?.words?.map(w => <section className="card" key={w.word}><h2>{w.word}</h2><p>{w.action} - score {w.review_score}</p></section>)}</div>;
}
