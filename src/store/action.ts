import { createAction } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';

export const changeCity = createAction<string>('city/change');
export const fillOffers = createAction<Offer[]>('offers/fill');
export const setOffersLoadingStatus = createAction<boolean>('offers/loading');
