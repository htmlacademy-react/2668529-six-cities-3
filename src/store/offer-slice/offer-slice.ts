import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {FullOffer, Offer} from '../../types/offer';
import {Review} from '../../types/review';
import {AxiosInstance} from 'axios';
import {RequestStatus} from '../../const';
import {changeFavoriteStatus} from '../offers-slice/offers-slice';

type OfferState = {
  currentOffer: FullOffer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  offerRequestStatus: RequestStatus;
  nearbyRequestStatus: RequestStatus;
  reviewsRequestStatus: RequestStatus;
  reviewSendingRequestStatus: RequestStatus;
  reviewSendingRequestError: string | null;
};

type ReviewData = {
  offerId: string;
  comment: string;
  rating: number;
};

const initialState: OfferState = {
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  offerRequestStatus: RequestStatus.Idle,
  nearbyRequestStatus: RequestStatus.Idle,
  reviewsRequestStatus: RequestStatus.Idle,
  reviewSendingRequestStatus: RequestStatus.Idle,
  reviewSendingRequestError: null,
};

export const fetchCurrentOffer = createAsyncThunk<
  FullOffer,
  string,
  {extra: AxiosInstance}
>(
  'offer/fetchCurrentOffer',
  async (id, {extra: api}) => {
    const {data} = await api.get<FullOffer>(`/offers/${id}`);
    return data;
  }
);

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  {extra: AxiosInstance}
>(
  'offer/fetchNearbyOffers',
  async (id, {extra: api}) => {
    const {data} = await api.get<Offer[]>(`/offers/${id}/nearby`);
    return data;
  }
);

export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  {extra: AxiosInstance}
>(
  'offer/fetchReviews',
  async (id, {extra: api}) => {
    const {data} = await api.get<Review[]>(`/comments/${id}`);
    return data;
  }
);

export const sendReview = createAsyncThunk<
  Review,
  ReviewData,
  {extra: AxiosInstance}
>(
  'offer/sendReview',
  async ({offerId, comment, rating}, {extra: api}) => {
    const {data} = await api.post<Review>(`/comments/${offerId}`, {
      comment,
      rating,
    });
    return data;
  }
);

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentOffer.pending, (state) => {
        state.offerRequestStatus = RequestStatus.Loading;
        state.currentOffer = null;
      })
      .addCase(fetchCurrentOffer.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.offerRequestStatus = RequestStatus.Success;
      })
      .addCase(fetchCurrentOffer.rejected, (state) => {
        state.offerRequestStatus = RequestStatus.Failed;
      })
      .addCase(fetchNearbyOffers.pending, (state) => {
        state.nearbyRequestStatus = RequestStatus.Loading;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
        state.nearbyRequestStatus = RequestStatus.Success;
      })
      .addCase(fetchNearbyOffers.rejected, (state) => {
        state.nearbyRequestStatus = RequestStatus.Failed;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsRequestStatus = RequestStatus.Loading;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.reviewsRequestStatus = RequestStatus.Success;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.reviewsRequestStatus = RequestStatus.Failed;
      })
      .addCase(sendReview.pending, (state) => {
        state.reviewSendingRequestStatus = RequestStatus.Loading;
        state.reviewSendingRequestError = null;
      })
      .addCase(sendReview.fulfilled, (state, action) => {
        state.reviewSendingRequestStatus = RequestStatus.Success;
        state.reviewSendingRequestError = null;
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(sendReview.rejected, (state) => {
        state.reviewSendingRequestStatus = RequestStatus.Failed;
        state.reviewSendingRequestError = 'Failed to send review. Please try again.';
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        if (state.currentOffer && state.currentOffer.id === action.payload.id) {
          state.currentOffer = {
            ...state.currentOffer,
            isFavorite: action.payload.isFavorite,
          };
        }
        state.nearbyOffers = state.nearbyOffers.map((offer) =>
          offer.id === action.payload.id ? action.payload : offer
        );
      });
  }
});

export default offerSlice.reducer;
