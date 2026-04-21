import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {AuthorizationStatus, RequestStatus, APIRoute} from '../../const';
import {saveToken, dropToken} from '../../services/token';
import {fetchFavorites} from '../offers-slice/offers-slice';
import {AppDispatch} from '../index';

type UserData = {
  email: string;
  avatarUrl: string;
  isPro: boolean;
  name: string;
};

type UserState = {
  authorizationStatus: AuthorizationStatus;
  authRequestStatus: RequestStatus;
  user: UserData | null;
  authError: string | null;
};

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

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  authRequestStatus: RequestStatus.Idle,
  user: null,
  authError: null,
};

export const checkAuth = createAsyncThunk<
  UserData,
  undefined,
  {extra: AxiosInstance; dispatch: AppDispatch}
>(
  'user/checkAuth',
  async (_arg, {extra: api, dispatch}) => {
    const {data} = await api.get<UserData>(APIRoute.Login);
    dispatch(fetchFavorites());
    return data;
  }
);

export const login = createAsyncThunk<
  UserData,
  AuthData,
  {extra: AxiosInstance; dispatch: AppDispatch}
>(
  'user/login',
  async ({email, password}, {extra: api, dispatch}) => {
    const {data} = await api.post<AuthInfo>(APIRoute.Login, {email, password});
    saveToken(data.token);
    dispatch(fetchFavorites());

    return {
      email: data.email,
      avatarUrl: data.avatarUrl,
      isPro: data.isPro,
      name: data.name,
    };
  }
);

export const logout = createAsyncThunk<
  void,
  undefined,
  {extra: AxiosInstance}
>(
  'user/logout',
  async (_arg, {extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authRequestStatus = RequestStatus.Success;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Failed;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authRequestStatus = RequestStatus.Success;
        state.user = action.payload;
        state.authError = null;
      })
      .addCase(login.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Failed;
        state.user = null;
        state.authError = 'Failed to sign in. Please check your credentials or try again later.';
      })
      .addCase(logout.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Success;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authRequestStatus = RequestStatus.Failed;
      });
  }
});

export const {clearAuthError} = userSlice.actions;
export default userSlice.reducer;
