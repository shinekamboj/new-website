import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, saveUserProfile } from '../firebase.js';

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  async function submit(event) {
    event.preventDefault();
    setErrorMessage('');
    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const credential = mode === 'signup'
        ? await createUserWithEmailAndPassword(auth, email.trim(), password)
        : await signInWithEmailAndPassword(auth, email.trim(), password);
      try {
        await saveUserProfile(credential.user);
      } catch (error) {
        setErrorMessage(`Firebase account is active, but profile data could not be saved (${error.code || 'Firestore error'}).`);
        return;
      }
      onClose();
    } catch (error) {
      const messages = {
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/user-not-found': 'No account was found for this email.',
        'auth/wrong-password': 'Email or password is incorrect.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/email-already-in-use': 'An account already exists for this email. Try logging in instead.',
        'auth/weak-password': 'Choose a password with at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
        'auth/network-request-failed': 'Could not reach Firebase. Check your connection.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase Authentication.',
      };
      setErrorMessage(messages[error.code] || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="age-modal login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="modal-close" type="button" aria-label="Close login" onClick={onClose}>×</button>
        <span className="modal-icon" aria-hidden="true">👤</span>
        <p className="eyebrow">PLAYER ACCOUNT</p>
        <h2 id="login-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="login-intro">{mode === 'login' ? 'Sign in with your Firebase player account.' : 'Create a Firebase account to save your game progress.'}</p>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} placeholder={mode === 'login' ? 'Enter your password' : 'At least 6 characters'} value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} />
          {mode === 'signup' && <>
            <label htmlFor="login-confirm-password">Confirm password</label>
            <input id="login-confirm-password" type="password" autoComplete="new-password" minLength={6} placeholder="Type your password again" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required disabled={loading} />
          </>}
          <button className="confirm-button login-submit" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
          <button className="login-mode-switch" type="button" onClick={() => { setMode((value) => value === 'login' ? 'signup' : 'login'); setErrorMessage(''); }} disabled={loading}>
            {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
          </button>
          <p className="login-privacy">Firebase handles your password. Your profile and game results are saved to your account.</p>
          {errorMessage && <p className="login-notice" role="alert">{errorMessage}</p>}
        </form>
      </section>
    </div>
  );
}
