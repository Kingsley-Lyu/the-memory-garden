// src/components/Navbar.jsx
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar({ t, lang, setLang, onCreateClick }) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        The Memory <span>Garden</span>
      </div>

      <div className={styles.right}>
        <ul className={styles.links}>
          <li><a href="#wall">{t('nav.memorials')}</a></li>
          <li><a href="#candles">{t('nav.candles')}</a></li>
          <li><a href="#how">{t('nav.how')}</a></li>
          {user ? (
            <>
              <li><a href="/dashboard">My Memorials</a></li>
              <li><a href="#" className={styles.cta} onClick={(e) => { e.preventDefault(); onCreateClick(); }}>{t('nav.create')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleSignOut(); }}>Sign out</a></li>
            </>
          ) : (
            <>
              <li><a href="#" className={styles.cta} onClick={(e) => { e.preventDefault(); onCreateClick(); }}>{t('nav.create')}</a></li>
              <li><a href="/auth/login">Sign in</a></li>
            </>
          )}
        </ul>

        <div className={styles.langToggle}>
          <button className={lang === 'en' ? styles.active : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'zh' ? styles.active : ''} onClick={() => setLang('zh')}>中文</button>
        </div>
      </div>
    </nav>
  );
}