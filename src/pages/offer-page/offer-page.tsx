import {useParams} from 'react-router-dom';
import ReviewForm from '../../components/review-form/review-form';
import {Offer} from '../../types/offer';
import {AuthorizationStatus} from '../../const';
import NotFoundPage from '../not-found-page/not-found-page';
import PlaceCard from '../../components/place-card/place-card';

type OfferPageProps = {
  offers: Offer[];
  authorizationStatus: AuthorizationStatus;
};

function OfferPage({offers, authorizationStatus}: OfferPageProps): JSX.Element {
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;
  const {id} = useParams();
  const currentOffer = offers.find((item) => item.id === Number(id));

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const nearbyOffers = offers.filter((item) => item.id !== currentOffer.id).slice(0, 3);

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {currentOffer.images.map((image) => (
              <div className="offer__image-wrapper" key={image}>
                <img className="offer__image" src={image} alt={currentOffer.title}/>
              </div>
            ))}
          </div>
        </div>

        <div className="offer__container container">
          <div className="offer__wrapper">
            {currentOffer.isPremium && (
              <div className="offer__mark">
                <span>Premium</span>
              </div>
            )}

            <div className="offer__name-wrapper">
              <h1 className="offer__name">{currentOffer.title}</h1>

              <button
                className={`offer__bookmark-button button ${
                  currentOffer.isFavorite ? 'offer__bookmark-button--active' : ''
                }`}
                type="button"
              >
                <svg className="offer__bookmark-icon" width="31" height="33">
                  <use xlinkHref="#icon-bookmark"/>
                </svg>
                <span className="visually-hidden">
                  {currentOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                </span>
              </button>
            </div>

            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{width: `${currentOffer.rating * 20}%`}}/>
                <span className="visually-hidden">Rating</span>
              </div>

              <span className="offer__rating-value rating__value">{currentOffer.rating.toFixed(1)}</span>
            </div>

            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {currentOffer.type}
              </li>

              <li className="offer__feature offer__feature--bedrooms">
                {currentOffer.bedrooms} {currentOffer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </li>

              <li className="offer__feature offer__feature--adults">
                Max {currentOffer.maxAdults} {currentOffer.maxAdults === 1 ? 'adult' : 'adults'}
              </li>
            </ul>

            <div className="offer__price">
              <b className="offer__price-value">&euro;{currentOffer.price}</b>
              <span className="offer__price-text"> night</span>
            </div>

            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {currentOffer.services.map((service) => (
                  <li key={service} className="offer__inside-item">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>

              <div className="offer__host-user user">
                <div
                  className={`offer__avatar-wrapper user__avatar-wrapper ${
                    currentOffer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                  }`}
                >
                  <img
                    className="offer__avatar user__avatar"
                    src={currentOffer.host.avatarUrl}
                    width="74"
                    height="74"
                    alt="Host avatar"
                  />
                </div>

                <span className="offer__user-name">{currentOffer.host.name}</span>

                {currentOffer.host.isPro && (
                  <span className="offer__user-status">Pro</span>
                )}
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
                        <span style={{width: '80%'}}/>
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

              {isAuth && <ReviewForm/>}
            </section>
          </div>
        </div>

        <section className="offer__map map"/>
      </section>

      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <div className="near-places__list places__list">
            {nearbyOffers.map((nearbyOffer) => (
              <PlaceCard
                key={nearbyOffer.id}
                offer={nearbyOffer}
                cardClassName="near-places"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default OfferPage;
