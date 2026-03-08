import Header from '../../components/header/header';

function OfferPage(): JSX.Element {
  return (
    <div className="page">
      <Header isAuth />

      <main className="page__main page__main--offer">

        <section className="offer">

          <div className="offer__gallery-container container">
            <div className="offer__gallery">

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/room.jpg" alt="Photo studio"/>
              </div>

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio"/>
              </div>

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-02.jpg" alt="Photo studio"/>
              </div>

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-03.jpg" alt="Photo studio"/>
              </div>

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/studio-01.jpg" alt="Photo studio"/>
              </div>

              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio"/>
              </div>

            </div>
          </div>


          <div className="offer__container container">
            <div className="offer__wrapper">

              <div className="offer__mark">
                <span>Premium</span>
              </div>

              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  Beautiful & luxurious studio at great location
                </h1>

                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>


              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: '80%'}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>

                <span className="offer__rating-value rating__value">4.8</span>
              </div>


              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  Apartment
                </li>

                <li className="offer__feature offer__feature--bedrooms">
                  3 Bedrooms
                </li>

                <li className="offer__feature offer__feature--adults">
                  Max 4 adults
                </li>
              </ul>


              <div className="offer__price">
                <b className="offer__price-value">€120</b>
                <span className="offer__price-text"> night</span>
              </div>


              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>

                <ul className="offer__inside-list">

                  <li className="offer__inside-item">Wi-Fi</li>
                  <li className="offer__inside-item">Washing machine</li>
                  <li className="offer__inside-item">Towels</li>
                  <li className="offer__inside-item">Heating</li>
                  <li className="offer__inside-item">Coffee machine</li>
                  <li className="offer__inside-item">Baby seat</li>
                  <li className="offer__inside-item">Kitchen</li>
                  <li className="offer__inside-item">Dishwasher</li>
                  <li className="offer__inside-item">Cabel TV</li>
                  <li className="offer__inside-item">Fridge</li>

                </ul>
              </div>


              <div className="offer__host">

                <h2 className="offer__host-title">Meet the host</h2>

                <div className="offer__host-user user">

                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src="img/avatar-angelina.jpg"
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>

                  <span className="offer__user-name">Angelina</span>
                  <span className="offer__user-status">Pro</span>

                </div>


                <div className="offer__description">

                  <p className="offer__text">
                    A quiet cozy and picturesque that hides behind a river by the
                    unique lightness of Amsterdam.
                  </p>

                  <p className="offer__text">
                    An independent house strategically located between Rembrand
                    Square and National Opera.
                  </p>

                </div>

              </div>

            </div>
          </div>


          <section className="offer__map map"></section>

        </section>

      </main>

    </div>
  );
}

export default OfferPage;
