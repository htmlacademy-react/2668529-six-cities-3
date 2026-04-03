import {AxiosInstance} from 'axios';
import {AppDispatch, State} from './index';
import {fillOffers, setOffersLoadingStatus, fillCurrentOffer,
  setCurrentOfferLoadingStatus, requireAuthorization} from './action';
import {Offer, FullOffer} from '../types/offer';
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
