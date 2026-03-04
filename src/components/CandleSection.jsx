// src/components/CandleSection.jsx
import { useState } from 'react';
import styles from './CandleSection.module.css';

const initialCandles = [
  { name: 'Da Wang' }, { name: 'Buddy' }, { name: 'Mochi' },
  { name: 'Luna' }, { name: 'Cleo' }, { name: 'Peanut' },
];

export default function CandleSection({ t }) {
  const [candles, setCandles] = useState(initialCandles);

  const addCandle = () => {
    const name = prompt(t('candles.for') + '...');
    if (name?.trim()) {
      setCandles((prev) => [...prev, { name: name.trim() }]);
    }
  };

  return (
    <section className={styles.section} id="candles">
      <div className="section-label">{t('candles.label')}</div>
      <h2 className="section-title">
        {t('candles.title').split(' ').slice(0, -1).join(' ')}{' '}
        <em>{t('candles.title').split(' ').slice(-1)}</em>
      </h2>
      <p className={styles.sub}>{t('candles.sub')}</p>

      <div className={styles.candles}>
        {candles.map((c, i) => (
          <div key={i} className={styles.candle}>
            <div className={styles.flame}>🕯️</div>
            <div className={styles.label}>{t('candles.for')} {c.name}</div>
          </div>
        ))}
      </div>

      <button className={styles.btn} onClick={addCandle}>
        {t('candles.btn')}
      </button>
    </section>
  );
}
