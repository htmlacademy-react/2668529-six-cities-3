import {useEffect, MouseEvent, useMemo} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import NotFoundPage from '../not-found-page/not-found-page';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import ReviewsList from '../../components/reviews-list/reviews-list';
import Spinner from '../../components/spinner/spinner';
import {fetchCurrentOffer, fetchNearbyOffers, fetchReviews} from '../../store/offer-slice/offer-slice';
import {changeFavoriteStatus} from '../../store/offers-slice/offers-slice';
import {AppDispatch} from '../../store';
import {RequestStatus, AuthorizationStatus, AppRoute} from '../../const';
import {capitalize} from '../../utils/offers-utils';
import {Offer} from '../../types/offer';
import {getCurrentOffer, getNearbyOffers, getReviews, getOfferRequestStatus} from '../../store/offer-slice/selectors';
import {getAuthorizationStatus} from '../../store/user-slice/selectors';

function OfferPage(): JSX.Element {
  const {id} = useParams<{id: string}>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentOffer = useSelector(getCurrentOffer);
  const nearbyOffers = useSelector(getNearbyOffers);
  const reviews = useSelector(getReviews);
  const offerRequestStatus = useSelector(getOfferRequestStatus);
  const authorizationStatus = useSelector(getAuthorizationStatus);
  const isBookmarkActive = authorizationStatus === AuthorizationStatus.Auth && !!currentOffer?.isFavorite;
  const firstThreeNearbyOffers = useMemo(() => nearbyOffers.slice(0, 3), [nearbyOffers]);
  const mapOffers = useMemo<Offer[]>(
    () => (currentOffer ? [currentOffer, ...firstThreeNearbyOffers] : []),
    [currentOffer, firstThreeNearbyOffers]
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOffer(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);

  if (offerRequestStatus === RequestStatus.Loading) {
    return <Spinner />;
  }

  if (!currentOffer || offerRequestStatus === RequestStatus.Failed) {
    return <NotFoundPage />;
  }

  const handleBookmarkClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }
    const nextStatus = currentOffer.isFavorite ? 0 : 1;
    try {
      await dispatch(
        changeFavoriteStatus({
          offerId: String(currentOffer.id),
          status: nextStatus,
        })
      ).unwrap();
    } catch (error) {
      void error;
    }
  };

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
                  isBookmarkActive ? 'offer__bookmark-button--active' : ''
                }`}
                type="button"
                onClick={(evt) => {
                  void handleBookmarkClick(evt);
                }}
              >
                <svg className="offer__bookmark-icon" width="31" height="33">
                  <use xlinkHref="#icon-bookmark"/>
                </svg>
                <span className="visually-hidden">
                  {isBookmarkActive ? 'In bookmarks' : 'To bookmarks'}
                </span>
              </button>
            </div>

            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{width: `${Math.round(currentOffer.rating) * 20}%`}}/>
                <span className="visually-hidden">Rating</span>
              </div>

              <span className="offer__rating-value rating__value">{currentOffer.rating.toFixed(1)}</span>
            </div>

            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {capitalize(currentOffer.type)}
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

            <ReviewsList
              reviews={reviews}
              offerId={currentOffer.id}
            />
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

      {firstThreeNearbyOffers.length > 0 && (
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <div className="near-places__list places__list">
              <OffersList
                offers={firstThreeNearbyOffers}
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
