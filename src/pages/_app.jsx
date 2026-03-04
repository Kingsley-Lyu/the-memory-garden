// src/pages/_app.jsx
// Global app wrapper — imports global CSS here.

import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
