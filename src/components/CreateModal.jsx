// src/components/CreateModal.jsx
import { useState } from 'react';
import { uploadPhoto } from '../utils/db';
import styles from './CreateModal.module.css';

export default function CreateModal({ isOpen, onClose, onSubmit, t }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    console.log('Submit clicked');

    const name = document.getElementById('inputName').value.trim();
    const species = document.getElementById('inputSpecies').value;
    const breed = document.getElementById('inputBreed').value.trim();
    const tribute = document.getElementById('inputTribute').value.trim();
    const dob = document.getElementById('inputDob').value;
    const dod = document.getElementById('inputDod').value;

    console.log('Form values:', { name, species, breed });

    if (!name) {
      alert('Please enter your pet\'s name.');
      return;
    }

    setUploading(true);

    let photo_url = null;
    if (photoFile) {
      console.log('Uploading photo...');
      const { url, error } = await uploadPhoto(photoFile);
      console.log('Photo result:', { url, error });
      if (error) {
        alert('Photo upload failed. Please try again.');
        setUploading(false);
        return;
      }
      photo_url = url;
    }

    console.log('Submitting memorial...');
    await onSubmit({
      name,
      type: species,
      breed: breed || species,
      born: dob ? new Date(dob).getFullYear().toString() : '—',
      died: dod ? new Date(dod).getFullYear().toString() : '—',
      quote: tribute || 'Forever in our hearts.',
      photo_url,
    });

    console.log('Done!');
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(74,55,40,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fffcf8', borderRadius: '2rem', padding: '3rem',
        maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#4a3728', marginBottom: '0.4rem' }}>
          Create a Memorial
        </h2>
        <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#8a6a5a', marginBottom: '2rem' }}>
          Celebrate the life of your beloved companion.
        </p>

        {/* Photo upload */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label
            htmlFor="inputPhoto"
            style={{
              display: 'block', cursor: 'pointer', borderRadius: '1rem',
              overflow: 'hidden', border: '2px dashed #e8b4a0', transition: 'border-color 0.2s'
            }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{
                height: '160px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: '#fdf6ee', color: '#8a6a5a'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🐾</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 300 }}>Click to upload a photo</p>
              </div>
            )}
          </label>
          <input type="file" id="inputPhoto" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </div>

        {/* Name */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>
            Pet's Name
          </label>
          <input type="text" id="inputName" placeholder="e.g. Da Wang, Buddy…"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none' }}
          />
        </div>

        {/* Species + Breed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.4rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>Species</label>
            <select id="inputSpecies" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none' }}>
              <option value="dog">🐶 Dog</option>
              <option value="cat">🐱 Cat</option>
              <option value="rabbit">🐰 Rabbit</option>
              <option value="bird">🐦 Bird</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>Breed (optional)</label>
            <input type="text" id="inputBreed" placeholder="e.g. Golden Retriever"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none' }}
            />
          </div>
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.4rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>Date of Birth</label>
            <input type="date" id="inputDob" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>Date Passed</label>
            <input type="date" id="inputDod" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none' }} />
          </div>
        </div>

        {/* Tribute */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a6a5a', marginBottom: '0.5rem' }}>A tribute message</label>
          <textarea id="inputTribute" placeholder="Share a favourite memory or what made them so special…"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1.5px solid #e8b4a0', background: '#fdf6ee', fontSize: '0.9rem', color: '#4a3728', outline: 'none', resize: 'vertical', minHeight: '90px', fontFamily: 'inherit' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '0.85rem', borderRadius: '3rem', border: '1.5px solid #e8b4a0', background: 'transparent', fontSize: '0.88rem', cursor: 'pointer', color: '#8a6a5a' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{ flex: 2, padding: '0.85rem', borderRadius: '3rem', border: 'none', background: uploading ? '#c9897a' : '#a0614f', color: 'white', fontSize: '0.88rem', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            {uploading ? 'Uploading…' : 'Create Memorial 🐾'}
          </button>
        </div>
      </div>
    </div>
  );
}
