import React from 'react';

export default function Header({ audience, onAudienceChange, search, onSearch }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Pixel Pals Arcade home">
        <span className="brand-mark" aria-hidden="true">🎮</span>
        <span className="brand-name">pixel<span>pals arcade</span></span>
      </a>

      <label className="search-box">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <span className="sr-only">Search games</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Find your next game..."
        />
      </label>

      <nav className="audience-nav" aria-label="Game audience">
        <button
          className={`nav-link ${audience === 'kids' ? 'active' : ''}`}
          type="button"
          onClick={() => onAudienceChange('kids')}
        >
          <span aria-hidden="true">🌈</span> For kids
        </button>
        <button
          className={`nav-link ${audience === 'adult' ? 'active' : ''}`}
          type="button"
          onClick={() => onAudienceChange('adult')}
        >
          <span aria-hidden="true">✨</span> For grown-ups
        </button>
      </nav>
    </header>
  );
}
