import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ features, user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">🌎</div>
        <h1>LinguaAI</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🏠</span>
          Dashboard
        </NavLink>
        {features.map(f => (
          <NavLink key={f.key} to={`/${f.key}`} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">{f.icon}</span>
            {f.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
        </div>
        <button
          onClick={onLogout}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
          title="Logout"
        >
          ↩
        </button>
      </div>
    </div>
  );
}
