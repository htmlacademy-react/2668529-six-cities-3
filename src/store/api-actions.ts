import {AxiosInstance} from 'axios';
import {AppDispatch, State} from './index';
import {fillOffers, setOffersLoadingStatus, fillCurrentOffer, setCurrentOfferLoadingStatus,
  fillNearbyOffers, setNearbyOffersLoadingStatus, fillReviews, setReviewsLoadingStatus, setReviewSendingStatus,
  requireAuthorization} from './action';
import {Offer, FullOffer} from '../types/offer';
import {Review} from '../types/review';
import {AuthorizationStatus} from '../const';
import {saveToken, dropToken} from '../services/token.ts';

type ThunkActionResult = (
  dispatch: AppDispatch,
  getState: () => State,
  api: AxiosInstance
) => Promise<void>;

type AuthData = {
  email: string;
  password: string;
};

type AuthInfo = {
  token: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  name: string;
};

type ReviewData = {
  offerId: string;
  comment: string;
  rating: number;
};

export const checkAuthAction = (): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    try {
      await api.get('/login');
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  };

export const loginAction = ({ email, password }: AuthData): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    const { data } = await api.post<AuthInfo>('/login', { email, password });
    saveToken(data.token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
  };

export const logoutAction = (): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    await api.delete('/logout');
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  };

export const fetchOffersAction = (): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    dispatch(setOffersLoadingStatus(true));

    try {
      const { data } = await api.get<Offer[]>('/offers');
      dispatch(fillOffers(data));
    } finally {
      dispatch(setOffersLoadingStatus(false));
    }
  };

export const fetchCurrentOfferAction = (id: string): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    dispatch(setCurrentOfferLoadingStatus(true));
    dispatch(fillCurrentOffer(null));

    try {
      const { data } = await api.get<FullOffer>(`/offers/${id}`);
      dispatch(fillCurrentOffer(data));
    } finally {
      dispatch(setCurrentOfferLoadingStatus(false));
    }
  };

export const fetchNearbyOffersAction = (id: string): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    dispatch(setNearbyOffersLoadingStatus(true));
    dispatch(fillNearbyOffers([]));

    try {
      const { data } = await api.get<Offer[]>(`/offers/${id}/nearby`);
      dispatch(fillNearbyOffers(data));
    } finally {
      dispatch(setNearbyOffersLoadingStatus(false));
    }
  };

export const fetchReviewsAction = (id: string): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    dispatch(setReviewsLoadingStatus(true));
    dispatch(fillReviews([]));

    try {
      const { data } = await api.get<Review[]>(`/comments/${id}`);
      dispatch(fillReviews(data));
    } finally {
      dispatch(setReviewsLoadingStatus(false));
    }
  };

export const sendReviewAction = ({offerId, comment, rating}: ReviewData): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    dispatch(setReviewSendingStatus(true));

    try {
      const { data } = await api.post<Review[]>(`/comments/${offerId}`, {comment, rating});
      dispatch(fillReviews(data));
    } finally {
      dispatch(setReviewSendingStatus(false));
    }
  };
