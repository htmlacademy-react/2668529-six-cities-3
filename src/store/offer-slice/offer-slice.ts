import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {FullOffer, Offer} from '../../types/offer';
import {Review} from '../../types/review';
import {AxiosInstance} from 'axios';
import {RootState} from '../index';
import {RequestStatus} from '../../const';

type OfferState = {
  currentOffer: FullOffer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  offerRequestStatus: RequestStatus;
  nearbyRequestStatus: RequestStatus;
  reviewsRequestStatus: RequestStatus;
  reviewSendingRequestStatus: RequestStatus;
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
};

export const fetchCurrentOffer = createAsyncThunk<
  FullOffer,
  string,
  {extra: AxiosInstance; state: RootState}
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
  void,
  ReviewData,
  {extra: AxiosInstance; state: RootState}
>(
  'offer/sendReview',
  async ({offerId, comment, rating}, {extra: api, dispatch}) => {
    await api.post(`/comments/${offerId}`, {comment, rating,});
    await dispatch(fetchReviews(offerId));
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
      })
      .addCase(sendReview.fulfilled, (state) => {
        state.reviewSendingRequestStatus = RequestStatus.Success;
      })
      .addCase(sendReview.rejected, (state) => {
        state.reviewSendingRequestStatus = RequestStatus.Failed;
      });
  }
});

export default offerSlice.reducer;
