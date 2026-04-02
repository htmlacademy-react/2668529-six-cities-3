import {createReducer} from '@reduxjs/toolkit';
import {changeCity, fillOffers, setOffersLoadingStatus,
  fillCurrentOffer, setCurrentOfferLoadingStatus, requireAuthorization} from './action';
import {Offer, FullOffer} from '../types/offer';
import {AuthorizationStatus} from '../const';

type State = {
  city: string;
  offers: Offer[];
  isOffersLoading: boolean;
  currentOffer: FullOffer | null;
  isCurrentOfferLoading: boolean;
  authorizationStatus: AuthorizationStatus;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isOffersLoading: true,
  currentOffer: null,
  isCurrentOfferLoading: true,
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
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    });
});
