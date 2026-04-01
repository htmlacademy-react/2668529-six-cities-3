import {createReducer} from '@reduxjs/toolkit';
import {changeCity, fillOffers, setOffersLoadingStatus, fillCurrentOffer, setCurrentOfferLoadingStatus} from './action';
import {Offer, FullOffer} from '../types/offer';

type State = {
  city: string;
  offers: Offer[];
  isOffersLoading: boolean;
  currentOffer: FullOffer | null;
  isCurrentOfferLoading: boolean;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isOffersLoading: true,
  currentOffer: null,
  isCurrentOfferLoading: true,
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
    });
});
