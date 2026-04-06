import {createAction} from '@reduxjs/toolkit';
import {Offer, FullOffer} from '../types/offer';
import {Review} from '../types/review';
import {AuthorizationStatus} from '../const';

export const changeCity = createAction<string>('city/change');

export const fillOffers = createAction<Offer[]>('offers/fill');
export const setOffersLoadingStatus = createAction<boolean>('offers/loading');

export const fillCurrentOffer = createAction<FullOffer | null>('offer/fillCurrent');
export const setCurrentOfferLoadingStatus = createAction<boolean>('offer/loading');

export const fillNearbyOffers = createAction<Offer[]>('offer/fillNearby');
export const setNearbyOffersLoadingStatus = createAction<boolean>('offer/nearbyLoading');

export const fillReviews = createAction<Review[]>('reviews/fill');
export const setReviewsLoadingStatus = createAction<boolean>('reviews/loading');
export const setReviewSendingStatus = createAction<boolean>('reviews/sending');

export const requireAuthorization =
  createAction<AuthorizationStatus>('user/requireAuthorization');
