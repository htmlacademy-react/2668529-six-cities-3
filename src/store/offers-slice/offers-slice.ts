import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {Offer} from '../../types/offer';
import {RequestStatus, APIRoute} from '../../const';

type OffersState = {
  offers: Offer[];
  favorites: Offer[];
  currentCity: string;
  offersRequestStatus: RequestStatus;
  favoritesRequestStatus: RequestStatus;
  favoriteChangingStatus: RequestStatus;
  offersError: string | null;
  favoritesError: string | null;
  favoriteChangeError: string | null;
};

type ChangeFavoriteStatusData = {
  offerId: string;
  status: 1 | 0;
};

const initialState: OffersState = {
  offers: [],
  favorites: [],
  currentCity: 'Paris',
  offersRequestStatus: RequestStatus.Idle,
  favoritesRequestStatus: RequestStatus.Idle,
  favoriteChangingStatus: RequestStatus.Idle,
  offersError: null,
  favoritesError: null,
  favoriteChangeError: null,
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  {extra: AxiosInstance}
>(
  'offers/fetchOffers',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<Offer[]>(APIRoute.Offers);
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
    const {data} = await api.get<Offer[]>(APIRoute.Favorites);
    return data;
  }
);

export const changeFavoriteStatus = createAsyncThunk<
  Offer,
  ChangeFavoriteStatusData,
  {extra: AxiosInstance}
>(
  'offers/changeFavoriteStatus',
  async ({offerId, status}, {extra: api}) => {
    const {data} = await api.post<Offer>(`${APIRoute.Favorites}/${offerId}/${status}`);
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
        state.offersError = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.offersRequestStatus = RequestStatus.Success;
        state.offersError = null;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.offersRequestStatus = RequestStatus.Failed;
        state.offersError = 'Failed to load offers. Please try again later.';
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesRequestStatus = RequestStatus.Loading;
        state.favoritesError = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.favoritesRequestStatus = RequestStatus.Success;
        state.favoritesError = null;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.favoritesRequestStatus = RequestStatus.Failed;
        state.favoritesError = 'Failed to load favorites. Please try again later.';
      })
      .addCase(changeFavoriteStatus.pending, (state) => {
        state.favoriteChangingStatus = RequestStatus.Loading;
        state.favoriteChangeError = null;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        state.favoriteChangingStatus = RequestStatus.Success;
        state.favoriteChangeError = null;

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
        state.favoriteChangeError = 'Failed to update favorite status. Please try again later.';
      });
  }
});

export const {changeCity} = offersSlice.actions;
export default offersSlice.reducer;
