import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from '../../pages/main-page/main-page.tsx';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favourites-page/favourites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import Layout from '../layout/layout.tsx';
import ScrollToTop from '../../components/scroll-to-top/scroll-to-top';
import {AuthorizationStatus, AppRoute} from '../../const';
import {offers} from '../../mocks/offers';
import {AppDispatch} from '../../store';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {fillOffers} from '../../store/action';

type AppProps = {
  authorizationStatus: AuthorizationStatus;
};

function App({authorizationStatus}: AppProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fillOffers(offers));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path={AppRoute.Root}
          element={<Layout authorizationStatus={authorizationStatus}/>}
        >
          <Route
            index
            element={<MainPage/>}
          />
          <Route
            path={AppRoute.Login}
            element={(
              <PrivateRoute authorizationStatus={authorizationStatus} isReverse>
                <LoginPage/>
              </PrivateRoute>
            )}
          />
          <Route
            path={AppRoute.Offer}
            element={(
              <OfferPage
                offers={offers}
                authorizationStatus={authorizationStatus}
              />
            )}
          />
          <Route
            path={AppRoute.Favorites}
            element={(
              <PrivateRoute authorizationStatus={authorizationStatus}>
                <FavoritesPage offers={offers} />
              </PrivateRoute>
            )}
          />
          <Route
            path={AppRoute.NotFound}
            element={<NotFoundPage/>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
