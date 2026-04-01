import { AxiosInstance } from 'axios';
import { AppDispatch, State } from './index';
import { fillOffers, setOffersLoadingStatus } from './action';
import { Offer } from '../types/offer';

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
