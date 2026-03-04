// src/pages/memorial/[id].jsx
import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { getMemorialById, addReaction } from '../../utils/db';
import styles from './[id].module.css';

const emojiMap = { dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦', other: '🐾' };
const bgMap = {
  dog: 'linear-gradient(135deg,#fde8da,#f5d0b8)',
  cat: 'linear-gradient(135deg,#e0d8f0,#d4c4e8)',
  rabbit: 'linear-gradient(135deg,#d8edd8,#b8d4b8)',
  bird: 'linear-gradient(135deg,#d8eef5,#b0d4e8)',
  other: 'linear-gradient(135deg,#f5e0d3,#e8c8b5)',
};

export default function MemorialPage({ pet }) {
  const { lang, setLang } = useLanguage();
  const [candles, setCandles] = useState(pet.candles ?? 0);
  const [hearts, setHearts] = useState(pet.hearts ?? 0);
  const [reacted, setReacted] = useState({ candle: false, heart: false });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [submittingMsg, setSubmittingMsg] = useState(false);

  if (!pet) return <div className={styles.notFound}>Memorial not found.</div>;

  const handleReact = async (type) => {
    if (reacted[type]) return;
    if (type === 'candle') setCandles((n) => n + 1);
    if (type === 'heart') setHearts((n) => n + 1);
    setReacted((prev) => ({ ...prev, [type]: true }));
    const col = type === 'candle' ? 'candles' : 'hearts';
    await addReaction(pet.id, col);
  };

  const handleMessageSubmit = () => {
    if (!message.trim()) return;
    setSubmittingMsg(true);
    setMessages((prev) => [
      { text: message.trim(), time: new Date().toLocaleDateString() },
      ...prev,
    ]);
    setMessage('');
    setSubmittingMsg(false);
  };

  return (
    <div className={styles.page}>

      {/* NAV */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>The Memory <span>Garden</span></a>
        <div className={styles.langToggle}>
          <button className={lang === 'en' ? styles.active : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'zh' ? styles.active : ''} onClick={() => setLang('zh')}>中文</button>
        </div>
      </nav>

      {/* HERO PHOTO */}
      <div className={styles.hero}>
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} className={styles.heroPhoto} />
        ) : (
          <div className={styles.heroEmoji} style={{ background: bgMap[pet.type] || bgMap.other }}>
            <span>{emojiMap[pet.type]}</span>
          </div>
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>{pet.breed || pet.type}</div>
          <h1 className={styles.heroName}>{pet.name}</h1>
          <p className={styles.heroDates}>{pet.born} — {pet.died}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.container}>

        {/* Tribute */}
        <section className={styles.tribute}>
          <div className={styles.tributeLabel}>In loving memory</div>
          <blockquote className={styles.tributeQuote}>"{pet.quote}"</blockquote>
        </section>

        {/* Reactions */}
        <section className={styles.reactions}>
          <button
            className={`${styles.reactionBtn} ${reacted.candle ? styles.reacted : ''}`}
            onClick={() => handleReact('candle')}
          >
            <span className={styles.reactionEmoji}>🕯️</span>
            <span className={styles.reactionCount}>{candles}</span>
            <span className={styles.reactionLabel}>Light a candle</span>
          </button>
          <button
            className={`${styles.reactionBtn} ${reacted.heart ? styles.reacted : ''}`}
            onClick={() => handleReact('heart')}
          >
            <span className={styles.reactionEmoji}>🤍</span>
            <span className={styles.reactionCount}>{hearts}</span>
            <span className={styles.reactionLabel}>Send love</span>
          </button>
          <button
            className={styles.shareBtn}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
          >
            🔗 Share this memorial
          </button>
        </section>

        {/* Leave a message */}
        <section className={styles.messagesSection}>
          <h2 className={styles.messagesTitle}>Leave a condolence</h2>
          <div className={styles.messageForm}>
            <textarea
              className={styles.messageInput}
              placeholder="Share a kind word or memory…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <button
              className={styles.messageSubmit}
              onClick={handleMessageSubmit}
              disabled={submittingMsg || !message.trim()}
            >
              Post message 🕊️
            </button>
          </div>

          {messages.length > 0 && (
            <div className={styles.messagesList}>
              {messages.map((m, i) => (
                <div key={i} className={styles.messageItem}>
                  <div className={styles.messageAvatar}>🤍</div>
                  <div className={styles.messageBody}>
                    <p className={styles.messageText}>{m.text}</p>
                    <span className={styles.messageTime}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Back link */}
        <div className={styles.backLink}>
          <a href="/">← Back to Memory Wall</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>The Memory <em>Garden</em></div>
        <div className={styles.footerCopy}>© 2026 The Memory Garden. Made with 🤍</div>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { data, error } = await getMemorialById(params.id);
  if (error || !data) return { notFound: true };
  return { props: { pet: data } };
}