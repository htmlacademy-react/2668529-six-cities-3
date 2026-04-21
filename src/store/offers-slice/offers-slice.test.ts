import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {describe, expect, it, beforeEach} from 'vitest';
import offersReducer, {changeCity, fetchOffers, fetchFavorites, changeFavoriteStatus} from './offers-slice';
import {createAPI} from '../../services/api';
import {RequestStatus} from '../../const';
import {Offer} from '../../types/offer';

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

describe('offers-slice reducer tests', () => {
  const initialState = {
    offers: [],
    favorites: [],
    currentCity: 'Paris',
    offersRequestStatus: RequestStatus.Idle,
    favoritesRequestStatus: RequestStatus.Idle,
    favoriteChangingStatus: RequestStatus.Idle,
    offersError: null,
    favoritesError: null,
    favoriteChangeError: null,
  };

  it('should return initial state with empty action', () => {
    expect(offersReducer(undefined, {type: ''})).toEqual(initialState);
  });

  it('should change city', () => {
    const state = offersReducer(initialState, changeCity('Amsterdam'));
    expect(state.currentCity).toBe('Amsterdam');
  });

  it('should set offersRequestStatus to Loading on fetchOffers.pending', () => {
    const state = offersReducer(initialState, fetchOffers.pending('', undefined));
    expect(state.offersRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should fill offers on fetchOffers.fulfilled', () => {
    const offers = [makeMockOffer(), makeMockOffer({id: '2'})];

    const state = offersReducer(
      initialState,
      fetchOffers.fulfilled(offers, '', undefined)
    );

    expect(state.offers).toEqual(offers);
    expect(state.offersRequestStatus).toBe(RequestStatus.Success);
  });

  it('should set offersRequestStatus to Failed on fetchOffers.rejected', () => {
    const state = offersReducer(
      initialState,
      fetchOffers.rejected(new Error('error'), '', undefined)
    );

    expect(state.offersRequestStatus).toBe(RequestStatus.Failed);
  });

  it('should fill favorites on fetchFavorites.fulfilled', () => {
    const favorites = [makeMockOffer({id: '11', isFavorite: true})];

    const state = offersReducer(
      initialState,
      fetchFavorites.fulfilled(favorites, '', undefined)
    );

    expect(state.favorites).toEqual(favorites);
    expect(state.favoritesRequestStatus).toBe(RequestStatus.Success);
  });

  it('should update offers and add offer to favorites on changeFavoriteStatus.fulfilled', () => {
    const offer = makeMockOffer({id: '1', isFavorite: false});
    const updatedOffer = makeMockOffer({id: '1', isFavorite: true});

    const state = offersReducer(
      {
        ...initialState,
        offers: [offer],
        favorites: [],
      },
      changeFavoriteStatus.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      })
    );

    expect(state.favoriteChangingStatus).toBe(RequestStatus.Success);
    expect(state.offers[0]).toEqual(updatedOffer);
    expect(state.favorites).toEqual([updatedOffer]);
  });

  it('should remove offer from favorites on changeFavoriteStatus.fulfilled when isFavorite is false', () => {
    const offer = makeMockOffer({id: '1', isFavorite: true});
    const updatedOffer = makeMockOffer({id: '1', isFavorite: false});

    const state = offersReducer(
      {
        ...initialState,
        offers: [offer],
        favorites: [offer],
      },
      changeFavoriteStatus.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 0,
      })
    );

    expect(state.offers[0]).toEqual(updatedOffer);
    expect(state.favorites).toEqual([]);
  });
});

describe('offers-slice async thunks tests', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);

  beforeEach(() => {
    mockAPI.reset();
  });

  it('should dispatch fetchOffers and store offers', async () => {
    const fakeOffers = [makeMockOffer(), makeMockOffer({id: '2'})];
    mockAPI.onGet('/offers').reply(200, fakeOffers);

    const store = configureStore({
      reducer: {OFFERS: offersReducer},
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(fetchOffers());

    const state = store.getState().OFFERS;
    expect(state.offers).toEqual(fakeOffers);
    expect(state.offersRequestStatus).toBe(RequestStatus.Success);
  });

  it('should dispatch fetchFavorites and store favorites', async () => {
    const fakeFavorites = [makeMockOffer({id: '10', isFavorite: true})];
    mockAPI.onGet('/favorite').reply(200, fakeFavorites);

    const store = configureStore({
      reducer: {OFFERS: offersReducer},
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(fetchFavorites());

    const state = store.getState().OFFERS;
    expect(state.favorites).toEqual(fakeFavorites);
    expect(state.favoritesRequestStatus).toBe(RequestStatus.Success);
  });

  it('should dispatch changeFavoriteStatus and update store', async () => {
    const offer = makeMockOffer({id: '1', isFavorite: false});
    const updatedOffer = makeMockOffer({id: '1', isFavorite: true});

    mockAPI.onPost('/favorite/1/1').reply(200, updatedOffer);

    const store = configureStore({
      reducer: {OFFERS: offersReducer},
      preloadedState: {
        OFFERS: {
          offers: [offer],
          favorites: [],
          currentCity: 'Paris',
          offersRequestStatus: RequestStatus.Idle,
          favoritesRequestStatus: RequestStatus.Idle,
          favoriteChangingStatus: RequestStatus.Idle,
          offersError: null,
          favoritesError: null,
          favoriteChangeError: null,
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });

    await store.dispatch(changeFavoriteStatus({offerId: '1', status: 1}));

    const state = store.getState().OFFERS;
    expect(state.offers[0].isFavorite).toBe(true);
    expect(state.favorites[0].isFavorite).toBe(true);
    expect(state.favoriteChangingStatus).toBe(RequestStatus.Success);
  });
});
