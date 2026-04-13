import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {Offer} from '../../types/offer';
import {RequestStatus} from '../../const';

type OffersState = {
  offers: Offer[];
  favorites: Offer[];
  currentCity: string;
  offersRequestStatus: RequestStatus;
  favoritesRequestStatus: RequestStatus;
  favoriteChangingStatus: RequestStatus;
};

const initialState: OffersState = {
  offers: [],
  favorites: [],
  currentCity: 'Paris',
  offersRequestStatus: RequestStatus.Idle,
  favoritesRequestStatus: RequestStatus.Idle,
  favoriteChangingStatus: RequestStatus.Idle,
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  {extra: AxiosInstance}
>(
  'offers/fetchOffers',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<Offer[]>('/offers');
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<
  Offer[],
  undefined,
  {extra: AxiosInstance}
>(
  'offers/fetchFavorites',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<Offer[]>('/favorite');
    return data;
  }
);

type ChangeFavoriteStatusData = {
  offerId: string;
  status: 1 | 0;
};

export const changeFavoriteStatus = createAsyncThunk<
  Offer,
  ChangeFavoriteStatusData,
  {extra: AxiosInstance}
>(
  'offers/changeFavoriteStatus',
  async ({offerId, status}, {extra: api}) => {
    const {data} = await api.post<Offer>(`/favorite/${offerId}/${status}`);
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
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesRequestStatus = RequestStatus.Loading;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.favoritesRequestStatus = RequestStatus.Success;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.favoritesRequestStatus = RequestStatus.Failed;
      })
      .addCase(changeFavoriteStatus.pending, (state) => {
        state.favoriteChangingStatus = RequestStatus.Loading;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        state.favoriteChangingStatus = RequestStatus.Success;

        state.offers = state.offers.map((offer) =>
          offer.id === action.payload.id ? action.payload : offer
        );

        if (action.payload.isFavorite) {
          const isAlreadyInFavorites = state.favorites.some(
            (offer) => offer.id === action.payload.id
          );

          if (!isAlreadyInFavorites) {
            state.favorites.push(action.payload);
          }
        } else {
          state.favorites = state.favorites.filter(
            (offer) => offer.id !== action.payload.id
          );
        }
      })
      .addCase(changeFavoriteStatus.rejected, (state) => {
        state.favoriteChangingStatus = RequestStatus.Failed;
      });
  }
});

export const {changeCity} = offersSlice.actions;
export default offersSlice.reducer;
