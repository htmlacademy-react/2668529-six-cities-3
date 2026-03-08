import Header from '../../components/header/header';

function LoginPage(): JSX.Element {
  return (
    <div className="page page--gray page--login">
      <Header isAuth={false} />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>

            <form className="login__form form" action="#" method="post">
              <div className="login__input-wrapper form__input-wrapper">
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="login__input-wrapper form__input-wrapper">
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

              <button className="login__submit form__submit button" type="submit">
                Sign in
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
