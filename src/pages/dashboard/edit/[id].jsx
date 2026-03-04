// src/pages/dashboard/edit/[id].jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getMemorialById, updateMemorial, uploadPhoto } from '../../../utils/db';
import styles from './[id].module.css';

export default function EditMemorial() {
  const { user, loading } = useAuth();
  const [memorial, setMemorial] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [born, setBorn] = useState('');
  const [died, setDied] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
      return;
    }

    if (user) {
      const id = window.location.pathname.split('/').pop();
      getMemorialById(id).then(({ data, error }) => {
        if (error || !data) { window.location.href = '/dashboard'; return; }
        if (data.user_id !== user.id) { window.location.href = '/dashboard'; return; }
        setMemorial(data);
        setName(data.name || '');
        setType(data.type || 'dog');
        setBreed(data.breed || '');
        setBorn(data.born || '');
        setDied(data.died || '');
        setQuote(data.quote || '');
        setPhotoPreview(data.photo_url || null);
        setFetching(false);
      });
    }
  }, [user, loading]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('Please enter a name.'); return; }
    setSaving(true);
    setError('');

    let photo_url = memorial.photo_url;

    // Upload new photo if changed
    if (photoFile) {
      const { url, error: uploadError } = await uploadPhoto(photoFile);
      if (uploadError) {
        setError('Photo upload failed. Please try again.');
        setSaving(false);
        return;
      }
      photo_url = url;
    }

    const { error: saveError } = await updateMemorial(memorial.id, {
      name, type, breed, born, died, quote, photo_url
    });

    if (saveError) {
      setError('Failed to save. Please try again.');
    } else {
      setSuccess(true);
      setTimeout(() => window.location.href = '/dashboard', 1500);
    }
    setSaving(false);
  };

  if (loading || fetching) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>🐾</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>The Memory <span>Garden</span></a>
        <a href="/dashboard" className={styles.backBtn}>← Back to dashboard</a>
      </nav>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.label}>Editing memorial</div>
          <h1 className={styles.title}>Edit <em>{memorial?.name}</em></h1>
        </div>

        <div className={styles.card}>
          {/* Photo */}
          <div className={styles.photoUpload}>
            <label htmlFor="editPhoto" className={styles.photoLabel}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span>🐾</span>
                  <p>Click to upload a photo</p>
                </div>
              )}
            </label>
            <input type="file" id="editPhoto" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label>Pet's Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Da Wang" />
          </div>

          {/* Species + Breed */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Species</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="dog">🐶 Dog</option>
                <option value="cat">🐱 Cat</option>
                <option value="rabbit">🐰 Rabbit</option>
                <option value="bird">🐦 Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Breed</label>
              <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Westie" />
            </div>
          </div>

          {/* Dates */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Year Born</label>
              <input type="text" value={born} onChange={(e) => setBorn(e.target.value)} placeholder="e.g. 2019" />
            </div>
            <div className={styles.field}>
              <label>Year Passed</label>
              <input type="text" value={died} onChange={(e) => setDied(e.target.value)} placeholder="e.g. 2025" />
            </div>
          </div>

          {/* Tribute */}
          <div className={styles.field}>
            <label>Tribute message</label>
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} placeholder="Share a favourite memory…" />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>✅ Saved! Redirecting to dashboard…</p>}

          <div className={styles.actions}>
            <a href="/dashboard" className={styles.cancelBtn}>Cancel</a>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}