import React, { useEffect, useState } from 'react';

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function submit(event) {
    event.preventDefault();
    setNotice('Login is not connected yet. Your details were not sent or saved.');
    setPassword('');
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="age-modal login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="modal-close" type="button" aria-label="Close login" onClick={onClose}>×</button>
        <span className="modal-icon" aria-hidden="true">👤</span>
        <p className="eyebrow">PLAYER ACCOUNT</p>
        <h2 id="login-title">Welcome back</h2>
        <p className="login-intro">Sign in to your Pixel Pals player account.</p>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="confirm-button login-submit" type="submit">Log in</button>
          <p className="login-privacy">Preview only: authentication is not connected, and this form does not send or store your details.</p>
          {notice && <p className="login-notice" role="status">{notice}</p>}
        </form>
      </section>
    </div>
  );
}
