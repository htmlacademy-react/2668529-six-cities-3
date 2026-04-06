import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {State, AppDispatch} from '../../store';
import NotFoundPage from '../not-found-page/not-found-page';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import ReviewsList from '../../components/reviews-list/reviews-list';
import {reviews} from '../../mocks/reviews';
import {fetchCurrentOfferAction} from '../../store/api-actions';
import Spinner from '../../components/spinner/spinner';

function OfferPage(): JSX.Element {
  const {id} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector((state: State) => state.offers);
  const currentOffer = useSelector((state: State) => state.currentOffer);
  const isCurrentOfferLoading = useSelector((state: State) => state.isCurrentOfferLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOfferAction(id));
    }
  }, [dispatch, id]);

  if (isCurrentOfferLoading) {
    return <Spinner />;
  }

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const nearbyOffers = offers
    .filter((offer) =>
      offer.city.name === currentOffer.city.name &&
      offer.id !== currentOffer.id
    )
    .slice(0, 3);

  const mapOffers = [currentOffer, ...nearbyOffers];

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {currentOffer.images.slice(0, 6).map((image) => (
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
                {currentOffer.goods.map((good) => (
                  <li key={good} className="offer__inside-item">
                    {good}
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
                  {currentOffer.description}
                </p>
              </div>
            </div>

            <ReviewsList reviews={reviews} />
          </div>
        </div>

        <Map
          city={currentOffer.city}
          offers={mapOffers}
          activeOfferId={currentOffer.id}
          mapClassName="offer__map map"
          isScrollZoom={false}
        />
      </section>

      {nearbyOffers.length > 0 && (
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <div className="near-places__list places__list">
              <OffersList
                offers={nearbyOffers}
                cardClassName="near-places"
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default OfferPage;
