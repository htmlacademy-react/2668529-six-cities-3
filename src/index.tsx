import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './components/app/app.tsx';
import {AuthorizationStatus} from './const';
import {store} from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App authorizationStatus={AuthorizationStatus.NoAuth} />
    </Provider>
  </React.StrictMode>
);
