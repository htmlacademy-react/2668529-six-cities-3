import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {AuthorizationStatus, RequestStatus} from '../../const';
import {saveToken, dropToken} from '../../services/token';

type UserState = {
  authorizationStatus: AuthorizationStatus;
  authRequestStatus: RequestStatus;
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
};

export const checkAuth = createAsyncThunk<
  void,
  undefined,
  {extra: AxiosInstance}
>(
  'user/checkAuth',
  async (_arg, {extra: api}) => {
    await api.get('/login');
  }
);

export const login = createAsyncThunk<
  void,
  AuthData,
  {extra: AxiosInstance}
>(
  'user/login',
  async ({email, password}, {extra: api}) => {
    const {data} = await api.post<AuthInfo>('/login', {email, password});
    saveToken(data.token);
  }
);

export const logout = createAsyncThunk<
  void,
  undefined,
  {extra: AxiosInstance}
>(
  'user/logout',
  async (_arg, {extra: api}) => {
    await api.delete('/logout');
    dropToken();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authRequestStatus = RequestStatus.Success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Failed;
      })
      .addCase(login.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
      })
      .addCase(login.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authRequestStatus = RequestStatus.Success;
      })
      .addCase(login.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Failed;
      })
      .addCase(logout.pending, (state) => {
        state.authRequestStatus = RequestStatus.Loading;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authRequestStatus = RequestStatus.Success;
      })
      .addCase(logout.rejected, (state) => {
        state.authRequestStatus = RequestStatus.Failed;
      });
  }
});

export default userSlice.reducer;
