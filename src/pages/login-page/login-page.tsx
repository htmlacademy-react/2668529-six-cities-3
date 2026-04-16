import {FormEvent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import {AppDispatch} from '../../store';
import {login} from '../../store/user-slice/user-slice';
import {AppRoute, CITIES} from '../../const';
import {changeCity} from '../../store/offers-slice/offers-slice';

function LoginPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [randomCity] = useState(
    () => CITIES[Math.floor(Math.random() * CITIES.length)]
  );

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const isPasswordValid = password.trim().length > 0 && /^(?=.*[A-Za-z])(?=.*\d).+$/.test(password);
    if (!isPasswordValid) {
      return;
    }
    await dispatch(login({email, password})).unwrap();
    navigate(AppRoute.Root);
  };

  const handleCityClick = () => {
    dispatch(changeCity(randomCity));
  };

  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>

          <form
            className="login__form form"
            action="#"
            method="post"
            onSubmit={(evt) => {
              void handleSubmit(evt);
            }}
          >
            <div className="login__input-wrapper form__input-wrapper">
              <input
                className="login__input form__input"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
                required
              />
            </div>

            <div className="login__input-wrapper form__input-wrapper">
              <input
                className="login__input form__input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
                required
              />
            </div>

            <button className="login__submit form__submit button" type="submit">
              Sign in
            </button>
          </form>
        </section>

        <section className="locations locations--login locations--current">
          <div className="locations__item">
            <Link
              className="locations__item-link"
              to={AppRoute.Root}
              onClick={handleCityClick}
            >
              <span>{randomCity}</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
