import {createAction} from '@reduxjs/toolkit';
import {Offer, FullOffer} from '../types/offer';
import {AuthorizationStatus} from '../const';

export const changeCity = createAction<string>('city/change');
export const fillOffers = createAction<Offer[]>('offers/fill');
export const setOffersLoadingStatus = createAction<boolean>('offers/loading');
export const fillCurrentOffer = createAction<FullOffer | null>('offer/fillCurrent');
export const setCurrentOfferLoadingStatus = createAction<boolean>('offer/loading');
export const requireAuthorization =
  createAction<AuthorizationStatus>('user/requireAuthorization');
