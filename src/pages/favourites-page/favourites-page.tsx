import {MouseEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {groupFavoriteOffersByCity} from '../../utils/offers-utils';
import FavoritesEmpty from '../../components/favorites-empty/favorites-empty';
import Spinner from '../../components/spinner/spinner';
import {AppRoute, AuthorizationStatus, RequestStatus} from '../../const';
import {changeFavoriteStatus, changeCity} from '../../store/offers-slice/offers-slice';
import {capitalize} from '../../utils/offers-utils';

function FavoritesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const favoriteOffers = useSelector((state: RootState) => state.OFFERS.favorites);
  const favoritesRequestStatus = useSelector((state: RootState) => state.OFFERS.favoritesRequestStatus);
  const authorizationStatus = useSelector((state: RootState) => state.USER.authorizationStatus);
  const favoritesError = useSelector((state: RootState) => state.OFFERS.favoritesError);
  const favoriteChangeError = useSelector((state: RootState) => state.OFFERS.favoriteChangeError);

  const serverErrorMessage = (favoritesError || favoriteChangeError) ? (
    <div
      style={{
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#d9534f',
      }}
    >
      {favoritesError ?? favoriteChangeError}
    </div>
  ) : null;

  if (favoritesRequestStatus === RequestStatus.Loading) {
    return <Spinner />;
  }

  if (favoriteOffers.length === 0) {
    return (
      <>
        {serverErrorMessage}
        <FavoritesEmpty />
      </>
    );
  }

  const groupedFavoriteOffers = groupFavoriteOffersByCity(favoriteOffers);
  const cityNames = Object.keys(groupedFavoriteOffers);

  const handleBookmarkClick = async (evt: MouseEvent<HTMLButtonElement>,
    offerId: string | number) => {
    evt.preventDefault();
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }
    try {
      await dispatch(
        changeFavoriteStatus({
          offerId: String(offerId),
          status: 0,
        })
      ).unwrap();
    } catch (error) {
      void error;
    }
  };

  const handleCityClick = (cityName: string) => {
    dispatch(changeCity(cityName));
  };

  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites">
          <h1 className="favorites__title">Saved listing</h1>

          {serverErrorMessage}

          <ul className="favorites__list">
            {cityNames.map((cityName) => (
              <li className="favorites__locations-items" key={cityName}>
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <Link
                      className="locations__item-link"
                      to={AppRoute.Root}
                      onClick={() => {
                        handleCityClick(cityName);
                      }}
                    >
                      <span>{cityName}</span>
                    </Link>
                  </div>
                </div>

                <div className="favorites__places">
                  {groupedFavoriteOffers[cityName].map((offer) => (
                    <article className="favorites__card place-card" key={offer.id}>
                      {offer.isPremium && (
                        <div className="place-card__mark">
                          <span>Premium</span>
                        </div>
                      )}

                      <div className="favorites__image-wrapper place-card__image-wrapper">
                        <Link to={`/offer/${offer.id}`}>
                          <img
                            className="place-card__image"
                            src={offer.previewImage}
                            width="150"
                            height="110"
                            alt={offer.title}
                          />
                        </Link>
                      </div>

                      <div className="favorites__card-info place-card__info">
                        <div className="place-card__price-wrapper">
                          <div className="place-card__price">
                            <b className="place-card__price-value">&euro;{offer.price}</b>
                            <span className="place-card__price-text">&#47;&nbsp;night</span>
                          </div>

                          <button
                            className="place-card__bookmark-button place-card__bookmark-button--active button"
                            type="button"
                            onClick={(evt) => {
                              void handleBookmarkClick(evt, offer.id);
                            }}
                          >
                            <svg className="place-card__bookmark-icon" width="18" height="19">
                              <use xlinkHref="#icon-bookmark" />
                            </svg>
                            <span className="visually-hidden">In bookmarks</span>
                          </button>
                        </div>

                        <div className="place-card__rating rating">
                          <div className="place-card__stars rating__stars">
                            <span style={{width: `${Math.round(offer.rating) * 20}%`}} />
                            <span className="visually-hidden">Rating</span>
                          </div>
                        </div>

                        <h2 className="place-card__name">
                          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                        </h2>
                        <p className="place-card__type">{capitalize(offer.type)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default FavoritesPage;
