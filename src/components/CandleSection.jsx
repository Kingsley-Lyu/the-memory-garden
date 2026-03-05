// src/components/CandleSection.jsx
import { useState, useEffect } from 'react';
import { getMemorials } from '../utils/db';
import styles from './CandleSection.module.css';

export default function CandleSection({ t }) {
  const [pets, setPets] = useState([]);
  const [lit, setLit] = useState({});

  useEffect(() => {
    getMemorials().then(({ data }) => {
      if (data) setPets(data.slice(0, 6));
    });
  }, []);

  const handleLight = (id) => {
    setLit((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className={styles.section} id="candles">
      <div className="section-label">Light a candle</div>
      <h2 className="section-title">
        Keep their light <em>burning</em>
      </h2>
      <p className={styles.sub}>Light a virtual candle in memory of a beloved pet and let their spirit glow.</p>

      <div className={styles.grid}>
        {pets.length === 0 ? (
          <p style={{ color: 'var(--text-light)', fontWeight: 300, gridColumn: '1/-1', textAlign: 'center' }}>
            No memorials yet — be the first to create one. 🐾
          </p>
        ) : (
          pets.map((pet) => (
            <div key={pet.id} className={`${styles.candle} ${lit[pet.id] ? styles.lit : ''}`}>
              <div className={styles.flame}>🕯️</div>
              <div className={styles.petName}>For {pet.name}</div>
              <button
                className={styles.lightBtn}
                onClick={() => handleLight(pet.id)}
                disabled={lit[pet.id]}
              >
                {lit[pet.id] ? '✨ Lit' : '🕯️ Light a Candle'}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}