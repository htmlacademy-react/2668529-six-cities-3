import {RootState} from '../index';

export const getOffers = (state: RootState) => state.OFFERS.offers;
export const getFavorites = (state: RootState) => state.OFFERS.favorites;
export const getFavoriteOffersCount = (state: RootState) => state.OFFERS.favorites.length;
export const getCurrentCity = (state: RootState) => state.OFFERS.currentCity;

export const getOffersRequestStatus = (state: RootState) =>
  state.OFFERS.offersRequestStatus;

export const getFavoritesRequestStatus = (state: RootState) =>
  state.OFFERS.favoritesRequestStatus;

export const getFavoriteChangingStatus = (state: RootState) =>
  state.OFFERS.favoriteChangingStatus;

export const getOffersError = (state: RootState) => state.OFFERS.offersError;
export const getFavoritesError = (state: RootState) => state.OFFERS.favoritesError;
export const getFavoriteChangeError = (state: RootState) =>
  state.OFFERS.favoriteChangeError;
