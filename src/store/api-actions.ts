import {AxiosInstance} from 'axios';
import {AppDispatch, State} from './index';
import {fillOffers, setOffersLoadingStatus, fillCurrentOffer, setCurrentOfferLoadingStatus} from './action';
import {Offer, FullOffer} from '../types/offer';

type ThunkActionResult = (
  dispatch: AppDispatch,
  getState: () => State,
  api: AxiosInstance
) => Promise<void>;

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
