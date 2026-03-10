const Settings = {
  OffersCount: 312
};

enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
}

const AppRoute = {
  Root: '/',
  Login: '/login',
  Favorites: '/favorites',
  Offer: '/offer/:id',
  NotFound: '*'
} as const;

export {Settings, AuthorizationStatus, AppRoute};
