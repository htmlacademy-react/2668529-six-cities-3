import {useSelector} from 'react-redux';
import OffersList from '../../components/offers-list/offers-list';
import {State} from '../../store';
import {getFavoriteOffers, groupFavoriteOffersByCity} from '../../utils/offers-utils';

function FavoritesPage(): JSX.Element {
  const offers = useSelector((state: State) => state.offers);

  const favoriteOffers = getFavoriteOffers(offers);
  const isEmpty = favoriteOffers.length === 0;
  const favoriteOffersByCity = groupFavoriteOffersByCity(favoriteOffers);
  const groupedFavoriteOffers = Object.entries(favoriteOffersByCity);

  return (
    <main
      className={`page__main page__main--favorites ${
        isEmpty ? 'page__main--favorites-empty' : ''
      }`}
    >
      <div className="page__favorites-container container">
        <section className={`favorites ${isEmpty ? 'favorites--empty' : ''}`}>
          {isEmpty ? (
            <>
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="favorites__title">Saved listing</h1>

              <ul className="favorites__list">
                {groupedFavoriteOffers.map(([cityName, cityOffers]) => (
                  <li className="favorites__locations-items" key={cityName}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#todo">
                          <span>{cityName}</span>
                        </a>
                      </div>
                    </div>

                    <div className="favorites__places">
                      <OffersList offers={cityOffers} cardClassName="favorites" />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default FavoritesPage;
