// src/components/HeroSection.jsx
import styles from './HeroSection.module.css';

export default function HeroSection({ t, onCreateClick }) {
  const scrollToWall = () => {
    document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={`${styles.deco} ${styles.deco1}`} />
      <div className={`${styles.deco} ${styles.deco2}`} />

      <div className={styles.paw}>🐾</div>

      <h1
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: t('hero.title') }}
      />

      <p className={styles.sub}>{t('hero.sub')}</p>

      <div className={styles.actions}>
        <button className="btn-primary" onClick={onCreateClick}>
          {t('hero.btn_create')}
        </button>
        <button className="btn-secondary" onClick={scrollToWall}>
          {t('hero.btn_browse')}
        </button>
      </div>

      <div className={styles.scroll}>
        <span>{t('hero.scroll')}</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
