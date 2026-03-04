// src/pages/dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserMemorials, deleteMemorial } from '../../utils/db';
import styles from './index.module.css';

const emojiMap = { dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦', other: '🐾' };

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [memorials, setMemorials] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
    }
    if (user) {
      getUserMemorials(user.id).then(({ data }) => {
        setMemorials(data ?? []);
        setFetching(false);
      });
    }
  }, [user, loading]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this memorial?')) return;
    const { error } = await deleteMemorial(id);
    if (error) { alert('Failed to delete. Please try again.'); return; }
    setMemorials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading || fetching) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingPaw}>🐾</div>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>The Memory <span>Garden</span></a>
        <div className={styles.navRight}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.label}>My account</div>
            <h1 className={styles.title}>My <em>Memorials</em></h1>
          </div>
          <a href="/" className={styles.createBtn}>+ Create new memorial</a>
        </div>

        {/* Empty state */}
        {memorials.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🐾</div>
            <h2 className={styles.emptyTitle}>No memorials yet</h2>
            <p className={styles.emptySub}>Create your first memorial to honour a beloved companion.</p>
            <a href="/" className={styles.createBtn}>Create a Memorial</a>
          </div>
        ) : (
          <div className={styles.grid}>
            {memorials.map((m) => (
              <div key={m.id} className={styles.card}>
                {/* Photo */}
                <div className={styles.cardPhoto}>
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardEmoji}>{emojiMap[m.type] || '🐾'}</div>
                  )}
                </div>

                {/* Info */}
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{m.name}</div>
                  <div className={styles.cardDates}>{m.born} – {m.died}</div>
                  <div className={styles.cardStats}>
                    <span>🕯️ {m.candles}</span>
                    <span>🤍 {m.hearts}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.cardActions}>
                  <a href={`/memorial/${m.id}`} className={styles.viewBtn}>View</a>
                  <a href={`/dashboard/edit/${m.id}`} className={styles.editBtn}>Edit</a>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}