import {useParams} from 'react-router-dom';
import ReviewForm from '../../components/review-form/review-form';
import {Offer} from '../../types/offer';
import {AuthorizationStatus} from '../../const';
import NotFoundPage from '../not-found-page/not-found-page';

type OfferPageProps = {
  offers: Offer[];
  authorizationStatus: AuthorizationStatus;
};

function OfferPage({offers, authorizationStatus}: OfferPageProps): JSX.Element {
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;
  const {id} = useParams();
  const offer = offers.find((item) => item.id === Number(id));

  if (!offer) {
    return <NotFoundPage />;
  }

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {offer.images.map((image) => (
              <div className="offer__image-wrapper" key={image}>
                <img className="offer__image" src={image} alt={offer.title} />
              </div>
            ))}
          </div>
        </div>

        <div className="offer__container container">
          <div className="offer__wrapper">
            {offer.isPremium && (
              <div className="offer__mark">
                <span>Premium</span>
              </div>
            )}

            <div className="offer__name-wrapper">
              <h1 className="offer__name">{offer.title}</h1>

              <button className="offer__bookmark-button button" type="button">
                <svg className="offer__bookmark-icon" width="31" height="33">
                  <use xlinkHref="#icon-bookmark"/>
                </svg>
                <span className="visually-hidden">To bookmarks</span>
              </button>
            </div>

            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{width: `${offer.rating * 20}%`}} />
                <span className="visually-hidden">Rating</span>
              </div>

              <span className="offer__rating-value rating__value">{offer.rating}.0</span>
            </div>

            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {offer.type}
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                3 Bedrooms
              </li>
              <li className="offer__feature offer__feature--adults">
                Max 4 adults
              </li>
            </ul>

            <div className="offer__price">
              <b className="offer__price-value">&euro;{offer.price}</b>
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

            <section className="offer__reviews reviews">
              <h2 className="reviews__title">
                Reviews &middot; <span className="reviews__amount">1</span>
              </h2>

              <ul className="reviews__list">
                <li className="reviews__item">
                  <div className="reviews__user user">
                    <div className="reviews__avatar-wrapper user__avatar-wrapper">
                      <img
                        className="reviews__avatar user__avatar"
                        src="img/avatar-max.jpg"
                        width="54"
                        height="54"
                        alt="Reviews avatar"
                      />
                    </div>
                    <span className="reviews__user-name">Max</span>
                  </div>

                  <div className="reviews__info">
                    <div className="reviews__rating rating">
                      <div className="reviews__stars rating__stars">
                        <span style={{width: '80%'}} />
                        <span className="visually-hidden">Rating</span>
                      </div>
                    </div>
                    <p className="reviews__text">
                      A quiet cozy and picturesque that hides behind a river by the unique lightness of Amsterdam.
                    </p>
                    <time className="reviews__time" dateTime="2019-04-24">
                      April 2019
                    </time>
                  </div>
                </li>
              </ul>

              {isAuth && <ReviewForm />}
            </section>
          </div>
        </div>

        <section className="offer__map map"/>
      </section>
    </main>
  );
}

export default OfferPage;
