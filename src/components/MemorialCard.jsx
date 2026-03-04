// src/components/MemorialCard.jsx
import { useState } from 'react';
import { addReaction } from '../utils/db';
import styles from './MemorialCard.module.css';

const emojiMap = { dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦', other: '🐾' };
const bgMap = {
  dog: 'linear-gradient(135deg,#fde8da,#f5d0b8)',
  cat: 'linear-gradient(135deg,#e0d8f0,#d4c4e8)',
  rabbit: 'linear-gradient(135deg,#d8edd8,#b8d4b8)',
  bird: 'linear-gradient(135deg,#d8eef5,#b0d4e8)',
  other: 'linear-gradient(135deg,#f5e0d3,#e8c8b5)',
};

export default function MemorialCard({ pet, t }) {
  const [candles, setCandles] = useState(pet.candles ?? 0);
  const [hearts, setHearts] = useState(pet.hearts ?? 0);
  const [reacted, setReacted] = useState({ candle: false, heart: false });

  const handleReact = async (type) => {
    if (reacted[type]) return;
    if (type === 'candle') setCandles((n) => n + 1);
    if (type === 'heart') setHearts((n) => n + 1);
    setReacted((prev) => ({ ...prev, [type]: true }));
    const col = type === 'candle' ? 'candles' : 'hearts';
    const { error } = await addReaction(pet.id, col);
    if (error) console.error('Reaction failed:', error);
  };

  return (
    <div className={styles.card}>
      {/* Show real photo if available, otherwise show emoji */}
      <div
        className={styles.photo}
        style={{ background: pet.photo_url ? 'none' : (bgMap[pet.type] || bgMap.other) }}
      >
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} className={styles.photoImg} />
        ) : (
          <span className={styles.emoji}>{emojiMap[pet.type]}</span>
        )}
        <div className={styles.badge}>{pet.breed || pet.type}</div>
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{pet.name}</div>
        <div className={styles.dates}>{pet.born} – {pet.died}</div>
        <p className={styles.quote}>"{pet.quote}"</p>
        <div className={styles.footer}>
          <div className={styles.reactions}>
            <button className={`${styles.reaction} ${reacted.candle ? styles.reacted : ''}`} onClick={() => handleReact('candle')}>
              🕯️ <span>{candles}</span>
            </button>
            <button className={`${styles.reaction} ${reacted.heart ? styles.reacted : ''}`} onClick={() => handleReact('heart')}>
              🤍 <span>{hearts}</span>
            </button>
          </div>
          <a href={`/memorial/${pet.id}`} className={styles.link}>{t('card.view')}</a>
        </div>
      </div>
    </div>
  );
}
