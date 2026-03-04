// src/components/MemoryWall.jsx
// Shows the grid of memorial cards with filter buttons.

import { useState } from 'react';
import MemorialCard from './MemorialCard';
import styles from './MemoryWall.module.css';

export default function MemoryWall({ pets, t }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? pets : pets.filter((p) => p.type === filter);

  return (
    <section className={styles.wall} id="wall">
      <div className={styles.header}>
        <div>
          <div className="section-label">{t('wall.label')}</div>
          <h2 className="section-title">
            {/* Split title to apply italic styling to last word */}
            {t('wall.title').split(' ').slice(0, -1).join(' ')}{' '}
            <em>{t('wall.title').split(' ').slice(-1)}</em>
          </h2>
        </div>

        <div className={styles.filters}>
          {['all', 'dog', 'cat', 'other'].map((type) => (
            <button
              key={type}
              className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
              onClick={() => setFilter(type)}
            >
              {t(`wall.filter_${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((pet) => (
          <MemorialCard key={pet.id} pet={pet} t={t} />
        ))}
      </div>
    </section>
  );
}
