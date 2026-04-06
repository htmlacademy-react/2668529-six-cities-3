import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store';
import {logoutAction} from '../../store/api-actions';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AppRoute, AuthorizationStatus} from '../../const';
import {State} from '../../store';

type HeaderProps = {
  isLoginPage?: boolean;
};

function Header({isLoginPage = false}: HeaderProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector((state: State) => state.authorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const handleSignOut = async () => {
    await dispatch(logoutAction());
    navigate(AppRoute.Login);
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

                {isAuth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                        <div className="header__avatar-wrapper user__avatar-wrapper"/>
                        <span className="header__user-name user__name">
                          Oliver.conner@gmail.com
                        </span>
                        <span className="header__favorite-count">3</span>
                      </Link>
                    </li>

                    <li className="header__nav-item">
                      <button
                        className="header__nav-link"
                        onClick={(evt) => {
                          evt.preventDefault();
                          void handleSignOut();
                        }}
                        style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
                      >
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                ) : (
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
