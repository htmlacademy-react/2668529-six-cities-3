import {RootState} from '../index';

export const getCurrentOffer = (state: RootState) => state.OFFER.currentOffer;
export const getNearbyOffers = (state: RootState) => state.OFFER.nearbyOffers;
export const getReviews = (state: RootState) => state.OFFER.reviews;

export const getOfferRequestStatus = (state: RootState) =>
  state.OFFER.offerRequestStatus;

export const getReviewSendingRequestStatus = (state: RootState) =>
  state.OFFER.reviewSendingRequestStatus;

export const getReviewSendingRequestError = (state: RootState) =>
  state.OFFER.reviewSendingRequestError;
