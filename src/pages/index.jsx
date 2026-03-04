// src/pages/index.jsx
import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getMemorials, createMemorial, getSiteStats } from '../utils/db';
import { supabase } from '../utils/supabase';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MemoryWall from '../components/MemoryWall';
import CandleSection from '../components/CandleSection';
import CreateModal from '../components/CreateModal';
import styles from './index.module.css';

export default function Home({ initialPets, initialStats }) {
  const { lang, setLang, t } = useLanguage();
  const [pets, setPets] = useState(initialPets);
  const [stats, setStats] = useState(initialStats);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateMemorial = async (newPet) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id ?? null;

    const { data, error } = await createMemorial({ ...newPet, user_id });
    if (error) {
      console.error('Failed to create memorial:', error);
      alert('Something went wrong. Please try again.');
    } else {
      setPets((prev) => [data, ...prev]);
      // Update memorial count in stats
      setStats((prev) => ({ ...prev, memorials: prev.memorials + 1 }));
    }
  };

  return (
    <>
      <Navbar t={t} lang={lang} setLang={setLang} onCreateClick={() => setModalOpen(true)} />

      <main>
        <HeroSection t={t} onCreateClick={() => setModalOpen(true)} />

        {/* Stats — now real numbers from DB */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{stats.memorials.toLocaleString()}</div>
            <div className={styles.statLabel}>{t('stats.memorials')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{stats.candles.toLocaleString()}</div>
            <div className={styles.statLabel}>{t('stats.candles')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{stats.hearts.toLocaleString()}</div>
            <div className={styles.statLabel}>{t('stats.tributes')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>190+</div>
            <div className={styles.statLabel}>{t('stats.countries')}</div>
          </div>
        </div>

        <MemoryWall pets={pets} t={t} />

        <div className={styles.quoteBanner}>
          <p className={styles.quoteText}>"{t('quote.text')}"</p>
          <p className={styles.quoteSource}>{t('quote.source')}</p>
        </div>

        <CandleSection t={t} />

        <section className={styles.howSection} id="how">
          <div className="section-label">{t('how.label')}</div>
          <h2 className="section-title">
            {t('how.title').split(' ').slice(0,-1).join(' ')} <em>{t('how.title').split(' ').slice(-1)}</em>
          </h2>
          <div className={styles.steps}>
            {[1,2,3,4].map((n) => (
              <div key={n} className={styles.step}>
                <div className={styles.stepNum}>0{n}</div>
                <h3 className={styles.stepTitle}>{t(`how.step${n}_title`)}</h3>
                <p className={styles.stepDesc}>{t(`how.step${n}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>The Memory <em>Garden</em></div>
        <div className={styles.footerLinks}>
          <a href="#">{t('footer.about')}</a>
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.support')}</a>
          <a href="#">{t('footer.contact')}</a>
        </div>
        <div className={styles.footerCopy}>{t('footer.copy')}</div>
      </footer>

      <CreateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateMemorial}
        t={t}
      />
    </>
  );
}

export async function getServerSideProps() {
  const [{ data: pets, error }, { data: stats }] = await Promise.all([
    getMemorials(),
    getSiteStats(),
  ]);

  if (error) console.error('Failed to fetch memorials:', error);

  return {
    props: {
      initialPets: pets ?? [],
      initialStats: stats ?? { memorials: 0, candles: 0, hearts: 0 },
    },
  };
}