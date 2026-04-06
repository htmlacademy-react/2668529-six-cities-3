import {createReducer} from '@reduxjs/toolkit';
import {changeCity, fillOffers, setOffersLoadingStatus, fillCurrentOffer, setCurrentOfferLoadingStatus,
  fillNearbyOffers, setNearbyOffersLoadingStatus, fillReviews, setReviewsLoadingStatus, setReviewSendingStatus,
  requireAuthorization} from './action';
import {Offer, FullOffer} from '../types/offer';
import {Review} from '../types/review';
import {AuthorizationStatus} from '../const';

type State = {
  city: string;
  offers: Offer[];
  isOffersLoading: boolean;
  currentOffer: FullOffer | null;
  isCurrentOfferLoading: boolean;
  nearbyOffers: Offer[];
  isNearbyOffersLoading: boolean;
  reviews: Review[];
  isReviewsLoading: boolean;
  isReviewSending: boolean;
  authorizationStatus: AuthorizationStatus;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isOffersLoading: true,
  currentOffer: null,
  isCurrentOfferLoading: true,
  nearbyOffers: [],
  isNearbyOffersLoading: true,
  reviews: [],
  isReviewsLoading: true,
  isReviewSending: false,
  authorizationStatus: AuthorizationStatus.Unknown,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fillOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoadingStatus, (state, action) => {
      state.isOffersLoading = action.payload;
    })
    .addCase(fillCurrentOffer, (state, action) => {
      state.currentOffer = action.payload;
    })
    .addCase(setCurrentOfferLoadingStatus, (state, action) => {
      state.isCurrentOfferLoading = action.payload;
    })
    .addCase(fillNearbyOffers, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(setNearbyOffersLoadingStatus, (state, action) => {
      state.isNearbyOffersLoading = action.payload;
    })
    .addCase(fillReviews, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(setReviewsLoadingStatus, (state, action) => {
      state.isReviewsLoading = action.payload;
    })
    .addCase(setReviewSendingStatus, (state, action) => {
      state.isReviewSending = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    });
});
