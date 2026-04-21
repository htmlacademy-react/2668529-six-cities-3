import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import {vi} from 'vitest';
import App from './app';
import offersReducer from '../../store/offers-slice/offers-slice';
import offerReducer from '../../store/offer-slice/offer-slice';
import userReducer from '../../store/user-slice/user-slice';
import {AuthorizationStatus, RequestStatus} from '../../const';

vi.mock('../../services/token', () => ({
  getToken: vi.fn(() => 'test-token'),
  saveToken: vi.fn(),
  dropToken: vi.fn(),
}));

vi.mock('../../store/offers-slice/offers-slice', async () => {
  const actual = await vi.importActual<typeof import('../../store/offers-slice/offers-slice')>(
    '../../store/offers-slice/offers-slice'
  );

  return {
    ...actual,
    fetchOffers: vi.fn(() => ({type: 'offers/fetchOffers'})),
    fetchFavorites: vi.fn(() => ({type: 'offers/fetchFavorites'})),
  };
});

vi.mock('../../store/user-slice/user-slice', async () => {
  const actual = await vi.importActual<typeof import('../../store/user-slice/user-slice')>(
    '../../store/user-slice/user-slice'
  );

  return {
    ...actual,
    checkAuth: vi.fn(() => ({type: 'user/checkAuth'})),
  };
});

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

describe('Application Routing Tests', () => {
  const makeStore = (authStatus = AuthorizationStatus.NoAuth) =>
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
          offersRequestStatus: RequestStatus.Success,
          favoritesRequestStatus: RequestStatus.Success,
          favoriteChangingStatus: RequestStatus.Idle,
          offersError: null,
          favoritesError: null,
          favoriteChangeError: null,
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
          authError: null,
        },
      },
    });

  it('should render MainPage for "/" path', () => {
    window.history.pushState({}, '', '/');

    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/places to stay/i)).toBeInTheDocument();
  });

  it('should render LoginPage for "/login" path', () => {
    window.history.pushState({}, '', '/login');

    render(
      <Provider store={makeStore(AuthorizationStatus.NoAuth)}>
        <App />
      </Provider>
    );

    expect(screen.getByRole('heading', {name: /sign in/i})).toBeInTheDocument();
  });

  it('should render NotFoundPage for unknown route', () => {
    window.history.pushState({}, '', '/random');

    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('should redirect unauthorized user from "/favorites" path to "/login" path', () => {
    window.history.pushState({}, '', '/favorites');

    render(
      <Provider store={makeStore(AuthorizationStatus.NoAuth)}>
        <App />
      </Provider>
    );

    expect(screen.getByRole('heading', {name: /sign in/i})).toBeInTheDocument();
  });

  it('should redirect authorized user from "/login" path to "/" path', () => {
    window.history.pushState({}, '', '/login');

    render(
      <Provider store={makeStore(AuthorizationStatus.Auth)}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/places to stay/i)).toBeInTheDocument();
  });
});
