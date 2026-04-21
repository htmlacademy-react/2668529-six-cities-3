import {RootState} from '../index';

export const getAuthorizationStatus = (state: RootState) =>
  state.USER.authorizationStatus;

export const getAuthRequestStatus = (state: RootState) =>
  state.USER.authRequestStatus;

export const getUser = (state: RootState) => state.USER.user;
export const getAuthError = (state: RootState) => state.USER.authError;
