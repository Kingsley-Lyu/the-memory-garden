// src/pages/auth/login.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    setMessage('');

    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const { error: signInError } = await signInWithEmail(email, password);
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className={styles.page}>
      <a href="/" className={styles.logo}>The Memory <span>Garden</span></a>

      <div className={styles.card}>
        <h1 className={styles.title}>{isSignUp ? 'Create account' : 'Welcome back'}</h1>
        <p className={styles.sub}>{isSignUp ? 'Join to create and manage memorials.' : 'Sign in to manage your memorials.'}</p>

        <button className={styles.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password" placeholder="at least 6 characters"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <button className={styles.submitBtn} onClick={handleEmailAuth} disabled={loading}>
          {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>

        <p className={styles.toggle}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}