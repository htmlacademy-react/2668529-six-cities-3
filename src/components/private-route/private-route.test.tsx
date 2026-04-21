import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import PrivateRoute from './private-route';
import {AuthorizationStatus, RequestStatus} from '../../const';
import offersReducer from '../../store/offers-slice/offers-slice';
import offerReducer from '../../store/offer-slice/offer-slice';
import userReducer from '../../store/user-slice/user-slice';

describe('Component test: PrivateRoute', () => {
  const makeStore = (authStatus: AuthorizationStatus) =>
    configureStore({
      reducer: {
        OFFERS: offersReducer,
        OFFER: offerReducer,
        USER: userReducer,
      },
      preloadedState: {
        OFFERS: {
          offers: [],
          favorites: [],
          currentCity: 'Paris',
          offersRequestStatus: RequestStatus.Idle,
          favoritesRequestStatus: RequestStatus.Idle,
          favoriteChangingStatus: RequestStatus.Idle,
        },
        OFFER: {
          currentOffer: null,
          nearbyOffers: [],
          reviews: [],
          offerRequestStatus: RequestStatus.Idle,
          nearbyRequestStatus: RequestStatus.Idle,
          reviewsRequestStatus: RequestStatus.Idle,
          reviewSendingRequestStatus: RequestStatus.Idle,
          reviewSendingRequestError: null,
        },
        USER: {
          authorizationStatus: authStatus,
          authRequestStatus: RequestStatus.Success,
          user: null,
        },
      },
    });

  it('should render private page when user is authorized', () => {
    const store = makeStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <div>favorites page</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('favorites page')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authorized', () => {
    const store = makeStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <div>favorites page</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<div>login page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('should redirect to main when route is reverse and user is authorized', () => {
    const store = makeStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route
              path="/login"
              element={
                <PrivateRoute isReverse>
                  <div>login page</div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<div>main page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('main page')).toBeInTheDocument();
  });
});
