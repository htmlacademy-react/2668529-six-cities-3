import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from '../../pages/main-page/main-page.tsx';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favourites-page/favourites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import Layout from '../layout/layout.tsx';
import ScrollToTop from '../../components/scroll-to-top/scroll-to-top';
import {AppRoute, AuthorizationStatus} from '../../const';
import {AppDispatch} from '../../store';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {fetchOffers, fetchFavorites} from '../../store/offers-slice/offers-slice';
import {checkAuth} from '../../store/user-slice/user-slice';
import {getAuthorizationStatus} from '../../store/user-slice/selectors.ts';

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(getAuthorizationStatus);

  useEffect(() => {
    void dispatch(checkAuth());
    void dispatch(fetchOffers());
  }, [dispatch]);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      void dispatch(fetchFavorites());
    }
  }, [authorizationStatus, dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path={AppRoute.Root} element={<Layout/>} >
          <Route index element={<MainPage/>} />
          <Route
            path={AppRoute.Login}
            element={(
              <PrivateRoute isReverse>
                <LoginPage/>
              </PrivateRoute>
            )}
          />
          <Route path={AppRoute.Offer} element={<OfferPage/>} />
          <Route
            path={AppRoute.Favorites}
            element={(
              <PrivateRoute>
                <FavoritesPage/>
              </PrivateRoute>
            )}
          />
          <Route path={AppRoute.NotFound} element={<NotFoundPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
