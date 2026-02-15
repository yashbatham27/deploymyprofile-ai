import { Auth0Provider } from '@auth0/auth0-react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIXED: Corrected environment variable access
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId) {
  console.warn('Missing VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID in .env');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain || ""}
    clientId={clientId || ""}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience || undefined
    }}
  >
    <App />
  </Auth0Provider>
);