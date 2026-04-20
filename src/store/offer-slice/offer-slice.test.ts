import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {beforeEach, describe, expect, it} from 'vitest';
import offerReducer, {fetchCurrentOffer, fetchNearbyOffers, fetchReviews, sendReview} from './offer-slice';
import {changeFavoriteStatus} from '../offers-slice/offers-slice';
import {createAPI} from '../../services/api';
import {RequestStatus} from '../../const';
import {FullOffer, Offer} from '../../types/offer';
import {Review} from '../../types/review';

const makeMockOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test offer',
  type: 'house',
  price: 120,
  city: {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  },
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 13,
  },
  isFavorite: false,
  isPremium: false,
  rating: 4.2,
  previewImage: 'preview.jpg',
  ...overrides,
});

const makeMockFullOffer = (overrides: Partial<FullOffer> = {}): FullOffer => ({
  ...makeMockOffer(),
  description: 'Nice place',
  bedrooms: 3,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'Host',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  images: ['1.jpg', '2.jpg'],
  maxAdults: 4,
  ...overrides,
});

const makeMockReview = (overrides: Partial<Review> = {}): Review => ({
  id: '1',
  comment: 'Very good',
  date: '2024-01-01T12:00:00.000Z',
  rating: 5,
  user: {
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  ...overrides,
});

describe('offer-slice reducer tests', () => {
  const initialState = {
    currentOffer: null,
    nearbyOffers: [],
    reviews: [],
    offerRequestStatus: RequestStatus.Idle,
    nearbyRequestStatus: RequestStatus.Idle,
    reviewsRequestStatus: RequestStatus.Idle,
    reviewSendingRequestStatus: RequestStatus.Idle,
    reviewSendingRequestError: null,
  };

  it('should return initial state with empty action', () => {
    expect(offerReducer(undefined, {type: ''})).toEqual(initialState);
  });

  it('should set offerRequestStatus to Loading and reset currentOffer on fetchCurrentOffer.pending', () => {
    const currentOffer = makeMockFullOffer();

    const state = offerReducer(
      {
        ...initialState,
        currentOffer,
      },
      fetchCurrentOffer.pending('', '1')
    );

    expect(state.offerRequestStatus).toBe(RequestStatus.Loading);
    expect(state.currentOffer).toBeNull();
  });

  it('should fill currentOffer on fetchCurrentOffer.fulfilled', () => {
    const offer = makeMockFullOffer();

    const state = offerReducer(
      initialState,
      fetchCurrentOffer.fulfilled(offer, '', '1')
    );

    expect(state.currentOffer).toEqual(offer);
    expect(state.offerRequestStatus).toBe(RequestStatus.Success);
  });

  it('should set offerRequestStatus to Failed on fetchCurrentOffer.rejected', () => {
    const state = offerReducer(
      initialState,
      fetchCurrentOffer.rejected(new Error('error'), '', '1')
    );

    expect(state.offerRequestStatus).toBe(RequestStatus.Failed);
  });

  it('should set nearbyRequestStatus to Loading on fetchNearbyOffers.pending', () => {
    const state = offerReducer(
      initialState,
      fetchNearbyOffers.pending('', '1')
    );

    expect(state.nearbyRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should fill nearbyOffers on fetchNearbyOffers.fulfilled', () => {
    const nearbyOffers = [makeMockOffer(), makeMockOffer({id: '2'})];

    const state = offerReducer(
      initialState,
      fetchNearbyOffers.fulfilled(nearbyOffers, '', '1')
    );

    expect(state.nearbyOffers).toEqual(nearbyOffers);
    expect(state.nearbyRequestStatus).toBe(RequestStatus.Success);
  });

  it('should set nearbyRequestStatus to Failed on fetchNearbyOffers.rejected', () => {
    const state = offerReducer(
      initialState,
      fetchNearbyOffers.rejected(new Error('error'), '', '1')
    );

    expect(state.nearbyRequestStatus).toBe(RequestStatus.Failed);
  });

  it('should set reviewsRequestStatus to Loading on fetchReviews.pending', () => {
    const state = offerReducer(
      initialState,
      fetchReviews.pending('', '1')
    );

    expect(state.reviewsRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should fill reviews on fetchReviews.fulfilled', () => {
    const reviews = [makeMockReview(), makeMockReview({id: '2'})];

    const state = offerReducer(
      initialState,
      fetchReviews.fulfilled(reviews, '', '1')
    );

    expect(state.reviews).toEqual(reviews);
    expect(state.reviewsRequestStatus).toBe(RequestStatus.Success);
  });

  it('should set reviewsRequestStatus to Failed on fetchReviews.rejected', () => {
    const state = offerReducer(
      initialState,
      fetchReviews.rejected(new Error('error'), '', '1')
    );

    expect(state.reviewsRequestStatus).toBe(RequestStatus.Failed);
  });

  it('should set reviewSendingRequestStatus to Loading and clear error on sendReview.pending', () => {
    const state = offerReducer(
      {
        ...initialState,
        reviewSendingRequestError: 'Some old error',
      },
      sendReview.pending('', {
        offerId: '1',
        comment: 'Nice',
        rating: 5,
      })
    );

    expect(state.reviewSendingRequestStatus).toBe(RequestStatus.Loading);
    expect(state.reviewSendingRequestError).toBeNull();
  });

  it('should add new review to the beginning on sendReview.fulfilled', () => {
    const oldReview = makeMockReview({id: '10'});
    const newReview = makeMockReview({id: '11', comment: 'New review'});

    const state = offerReducer(
      {
        ...initialState,
        reviews: [oldReview],
      },
      sendReview.fulfilled(newReview, '', {
        offerId: '1',
        comment: 'New review',
        rating: 5,
      })
    );

    expect(state.reviewSendingRequestStatus).toBe(RequestStatus.Success);
    expect(state.reviewSendingRequestError).toBeNull();
    expect(state.reviews).toEqual([newReview, oldReview]);
  });

  it('should set error on sendReview.rejected', () => {
    const state = offerReducer(
      initialState,
      sendReview.rejected(new Error('error'), '', {
        offerId: '1',
        comment: 'Bad',
        rating: 1,
      })
    );

    expect(state.reviewSendingRequestStatus).toBe(RequestStatus.Failed);
    expect(state.reviewSendingRequestError).toBe('Failed to send review. Please try again.');
  });

  it('should update currentOffer favorite status on changeFavoriteStatus.fulfilled', () => {
    const currentOffer = makeMockFullOffer({id: '1', isFavorite: false});
    const updatedOffer = makeMockOffer({id: '1', isFavorite: true});

    const state = offerReducer(
      {
        ...initialState,
        currentOffer,
      },
      changeFavoriteStatus.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      })
    );

    expect(state.currentOffer?.isFavorite).toBe(true);
  });

  it('should update nearby offer on changeFavoriteStatus.fulfilled', () => {
    const nearbyOffer = makeMockOffer({id: '1', isFavorite: false});
    const anotherNearbyOffer = makeMockOffer({id: '2', isFavorite: false});
    const updatedOffer = makeMockOffer({id: '1', isFavorite: true});

    const state = offerReducer(
      {
        ...initialState,
        nearbyOffers: [nearbyOffer, anotherNearbyOffer],
      },
      changeFavoriteStatus.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      })
    );

    expect(state.nearbyOffers[0]).toEqual(updatedOffer);
    expect(state.nearbyOffers[1]).toEqual(anotherNearbyOffer);
  });
});

describe('offer-slice async thunks tests', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);

  beforeEach(() => {
    mockAPI.reset();
  });

  it('should dispatch fetchCurrentOffer and store current offer', async () => {
    const mockOffer = makeMockFullOffer({id: '5'});
    mockAPI.onGet('/offers/5').reply(200, mockOffer);

    const store = configureStore({
      reducer: {OFFER: offerReducer},
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(fetchCurrentOffer('5'));

    const state = store.getState().OFFER;
    expect(state.currentOffer).toEqual(mockOffer);
    expect(state.offerRequestStatus).toBe(RequestStatus.Success);
  });

  it('should dispatch fetchNearbyOffers and store nearby offers', async () => {
    const mockNearbyOffers = [makeMockOffer({id: '2'}), makeMockOffer({id: '3'})];
    mockAPI.onGet('/offers/5/nearby').reply(200, mockNearbyOffers);

    const store = configureStore({
      reducer: {OFFER: offerReducer},
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(fetchNearbyOffers('5'));

    const state = store.getState().OFFER;
    expect(state.nearbyOffers).toEqual(mockNearbyOffers);
    expect(state.nearbyRequestStatus).toBe(RequestStatus.Success);
  });

  it('should dispatch fetchReviews and store reviews', async () => {
    const mockReviews = [makeMockReview({id: '7'}), makeMockReview({id: '8'})];
    mockAPI.onGet('/comments/5').reply(200, mockReviews);

    const store = configureStore({
      reducer: {OFFER: offerReducer},
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(fetchReviews('5'));

    const state = store.getState().OFFER;
    expect(state.reviews).toEqual(mockReviews);
    expect(state.reviewsRequestStatus).toBe(RequestStatus.Success);
  });

  it('should dispatch sendReview and add review to store', async () => {
    const oldReview = makeMockReview({id: '1'});
    const newReview = makeMockReview({id: '2', comment: 'Posted review'});
    mockAPI.onPost('/comments/5').reply(200, newReview);

    const store = configureStore({
      reducer: {OFFER: offerReducer},
      preloadedState: {
        OFFER: {
          currentOffer: null,
          nearbyOffers: [],
          reviews: [oldReview],
          offerRequestStatus: RequestStatus.Idle,
          nearbyRequestStatus: RequestStatus.Idle,
          reviewsRequestStatus: RequestStatus.Idle,
          reviewSendingRequestStatus: RequestStatus.Idle,
          reviewSendingRequestError: null,
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(
      sendReview({
        offerId: '5',
        comment: 'Posted review',
        rating: 5,
      })
    );

    const state = store.getState().OFFER;
    expect(state.reviews).toEqual([newReview, oldReview]);
    expect(state.reviewSendingRequestStatus).toBe(RequestStatus.Success);
    expect(state.reviewSendingRequestError).toBeNull();
  });
});
