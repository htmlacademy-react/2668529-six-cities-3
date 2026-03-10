import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import {Settings, AuthorizationStatus} from './const';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <App
        offersCount={Settings.OffersCount}
        authorizationStatus={AuthorizationStatus.Auth}
      />
  </React.StrictMode>
);
