import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import Layout from './layout';
import offersReducer from '../../store/offers-slice/offers-slice';
import offerReducer from '../../store/offer-slice/offer-slice';
import userReducer from '../../store/user-slice/user-slice';
import {AuthorizationStatus, RequestStatus} from '../../const';

describe('Component test: Layout', () => {
  const store = configureStore({
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
        authorizationStatus: AuthorizationStatus.NoAuth,
        authRequestStatus: RequestStatus.Idle,
        user: null,
      },
    },
  });

  it('should render outlet content in layout component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>test content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('test content')).toBeInTheDocument();
  });
});
