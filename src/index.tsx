import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import {AuthorizationStatus} from './const';
import {offers} from './mocks/offers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App
      offers={offers}
      authorizationStatus={AuthorizationStatus.NoAuth}
    />
  </React.StrictMode>
);
