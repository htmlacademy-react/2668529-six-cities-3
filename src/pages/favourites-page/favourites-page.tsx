import OffersList from '../../components/offers-list/offers-list';
import {Offer} from '../../types/offer';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({offers}: FavoritesPageProps): JSX.Element {
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);
  const isEmpty = favoriteOffers.length === 0;

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
                <li className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <a className="locations__item-link" href="#todo">
                        <span>Amsterdam</span>
                      </a>
                    </div>
                  </div>

                  <div className="favorites__places">
                    <OffersList offers={favoriteOffers} cardClassName="favorites" />
                  </div>
                </li>
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default FavoritesPage;
