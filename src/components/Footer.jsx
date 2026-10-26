import React from 'react';

export default function Footer({ onAudienceChange }) {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-top">
        <div className="footer-brand-block">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark" aria-hidden="true">🎮</span>
            <span className="brand-name">pixel<span>pals arcade</span></span>
          </a>
          <p>A happy little corner of the internet for playing your next favorite game.</p>
        </div>
        <div className="footer-links">
          <h2>Explore</h2>
          <a href="#games" onClick={() => onAudienceChange('kids')}>Learning games</a>
          <a href="#games" onClick={() => onAudienceChange('adult')}>Grown-up picks</a>
          <a href="#about-us">About us</a>
          <a href="#top">Back to top ↑</a>
        </div>
        <div className="footer-about" id="about-us">
          <h2>About us</h2>
          <p>Pixel Pals Arcade is a playful home for curious kids and grown-ups to discover, learn, and enjoy browser games together.</p>
        </div>
        <div className="footer-note" id="safety">
          <span className="footer-note-icon" aria-hidden="true">🛡️</span>
          <div>
            <h2>Play thoughtfully</h2>
            <p>Every pick is a general-audience game. Kids’ learning games and grown-up favorites are kept in separate collections.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Pixel Pals Arcade</span>
        <span>Made for curious minds &amp; happy players <span aria-hidden="true">💜</span></span>
      </div>
    </footer>
  );
}
