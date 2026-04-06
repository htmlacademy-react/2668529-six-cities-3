import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from '../../pages/main-page/main-page.tsx';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favourites-page/favourites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import Layout from '../layout/layout.tsx';
import ScrollToTop from '../../components/scroll-to-top/scroll-to-top';
import {AppRoute} from '../../const';
import {AppDispatch} from '../../store';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {fetchOffersAction, checkAuthAction} from '../../store/api-actions';

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(checkAuthAction());
    dispatch(fetchOffersAction());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path={AppRoute.Root}
          element={<Layout/>}
        >
          <Route
            index
            element={<MainPage/>}
          />
          <Route
            path={AppRoute.Login}
            element={(
              <PrivateRoute isReverse>
                <LoginPage/>
              </PrivateRoute>
            )}
          />
          <Route
            path={AppRoute.Offer}
            element={(
              <OfferPage/>
            )}
          />
          <Route
            path={AppRoute.Favorites}
            element={(
              <PrivateRoute>
                <FavoritesPage/>
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
