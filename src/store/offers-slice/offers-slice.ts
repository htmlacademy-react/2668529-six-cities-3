import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {Offer} from '../../types/offer';
import {RootState} from '../index';
import {RequestStatus} from '../../const';

type OffersState = {
  offers: Offer[];
  currentCity: string;
  offersRequestStatus: RequestStatus;
};

const initialState: OffersState = {
  offers: [],
  currentCity: 'Paris',
  offersRequestStatus: RequestStatus.Idle,
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  {extra: AxiosInstance; state: RootState}
>(
  'offers/fetchOffers',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<Offer[]>('/offers');
    return data;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<string>) => {
      state.currentCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.offersRequestStatus = RequestStatus.Loading;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.offersRequestStatus = RequestStatus.Success;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.offersRequestStatus = RequestStatus.Failed;
      });
  }
});

export const {changeCity} = offersSlice.actions;
export default offersSlice.reducer;
