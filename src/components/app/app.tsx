import { Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/main-page/main-page.tsx';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favourites-page/favourites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import {AuthorizationStatus} from '../../const';

type AppProps = {
  offersCount: number;
  authorizationStatus: AuthorizationStatus;
};

function App({offersCount, authorizationStatus}: AppProps): JSX.Element {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainPage
            offersCount={offersCount}
            authorizationStatus={authorizationStatus}
          />
        }
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/favorites"
        element={
          <PrivateRoute authorizationStatus={authorizationStatus}>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/offer/:id"
        element={<OfferPage />}
      />
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;
