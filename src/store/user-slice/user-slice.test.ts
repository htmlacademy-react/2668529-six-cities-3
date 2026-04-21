import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import userReducer, {checkAuth, login, logout} from './user-slice';
import {createAPI} from '../../services/api';
import {AuthorizationStatus, RequestStatus} from '../../const';

vi.mock('../../services/token', () => ({
  getToken: vi.fn(() => 'test-token'),
  saveToken: vi.fn(),
  dropToken: vi.fn(),
}));

const makeMockUser = (overrides = {}) => ({
  email: 'test@test.ru',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  name: 'Test User',
  ...overrides,
});

describe('user-slice reducer tests', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    authRequestStatus: RequestStatus.Idle,
    user: null,
    authError: null,
  };

  it('should return initial state with empty action', () => {
    expect(userReducer(undefined, {type: ''})).toEqual(initialState);
  });

  it('should set authRequestStatus to Loading on checkAuth.pending', () => {
    const state = userReducer(initialState, checkAuth.pending('', undefined));
    expect(state.authRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should set user and auth status on checkAuth.fulfilled', () => {
    const user = makeMockUser();

    const state = userReducer(
      initialState,
      checkAuth.fulfilled(user, '', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(state.authRequestStatus).toBe(RequestStatus.Success);
    expect(state.user).toEqual(user);
  });

  it('should reset user on checkAuth.rejected', () => {
    const state = userReducer(
      initialState,
      checkAuth.rejected(new Error('error'), '', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(state.authRequestStatus).toBe(RequestStatus.Failed);
    expect(state.user).toBeNull();
  });

  it('should set authRequestStatus to Loading on login.pending', () => {
    const state = userReducer(
      initialState,
      login.pending('', {email: 'test@test.ru', password: 'abc123'})
    );

    expect(state.authRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should set user and auth status on login.fulfilled', () => {
    const user = makeMockUser();

    const state = userReducer(
      initialState,
      login.fulfilled(user, '', {email: 'test@test.ru', password: 'abc123'})
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(state.authRequestStatus).toBe(RequestStatus.Success);
    expect(state.user).toEqual(user);
  });

  it('should reset user on login.rejected', () => {
    const state = userReducer(
      initialState,
      login.rejected(new Error('error'), '', {
        email: 'test@test.ru',
        password: '12345',
      })
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(state.authRequestStatus).toBe(RequestStatus.Failed);
    expect(state.user).toBeNull();
  });

  it('should set authRequestStatus to Loading on logout.pending', () => {
    const state = userReducer(initialState, logout.pending('', undefined));
    expect(state.authRequestStatus).toBe(RequestStatus.Loading);
  });

  it('should clear user on logout.fulfilled', () => {
    const state = userReducer(
      {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        user: makeMockUser(),
      },
      logout.fulfilled(undefined, '', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(state.authRequestStatus).toBe(RequestStatus.Success);
    expect(state.user).toBeNull();
  });

  it('should set authRequestStatus to Failed on logout.rejected', () => {
    const state = userReducer(
      initialState,
      logout.rejected(new Error('error'), '', undefined)
    );

    expect(state.authRequestStatus).toBe(RequestStatus.Failed);
  });
});

describe('user-slice async thunks tests', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);

  beforeEach(() => {
    mockAPI.reset();
  });

  it('should dispatch logout and clear user', async () => {
    mockAPI.onDelete('/logout').reply(204);

    const store = configureStore({
      reducer: {USER: userReducer},
      preloadedState: {
        USER: {
          authorizationStatus: AuthorizationStatus.Auth,
          authRequestStatus: RequestStatus.Idle,
          user: makeMockUser(),
          authError: null,
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {extraArgument: api},
        }),
    });
    await store.dispatch(logout());

    const state = store.getState().USER;
    expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(state.authRequestStatus).toBe(RequestStatus.Success);
    expect(state.user).toBeNull();
  });
});
