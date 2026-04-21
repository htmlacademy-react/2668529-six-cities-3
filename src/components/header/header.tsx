import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {AppDispatch} from '../../store';
import {AppRoute, AuthorizationStatus} from '../../const';
import {logout} from '../../store/user-slice/user-slice';
import {getFavorites} from '../../store/offers-slice/selectors';
import {getAuthorizationStatus, getUser} from '../../store/user-slice/selectors';

type HeaderProps = {
  isLoginPage?: boolean;
};

function Header({isLoginPage = false}: HeaderProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteOffers = useSelector(getFavorites);
  const favoriteOffersCount = favoriteOffers.length;
  const authorizationStatus = useSelector(getAuthorizationStatus);
  const user = useSelector(getUser);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      void error;
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link header__logo-link--active" to={AppRoute.Root}>
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>

          {!isLoginPage && (
            <nav className="header__nav">
              <ul className="header__nav-list">
                {isAuth && user && (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                        <img
                          className="user__avatar"
                          src={user.avatarUrl}
                          alt={user.name}
                          width="54"
                          height="54"
                        />
                      </div>
                      <span className="header__user-name user__name">{user.email}</span>
                      <span className="header__favorite-count">{favoriteOffersCount}</span>
                    </Link>
                  </li>
                )}

                {isAuth && user && (
                  <li className="header__nav-item">
                    <button
                      className="header__nav-link"
                      type="button"
                      onClick={() => {
                        void handleSignOut();
                      }}
                      style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
                    >
                      <span className="header__signout">Sign out</span>
                    </button>
                  </li>
                )}

                {!isAuth && (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Login}>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
