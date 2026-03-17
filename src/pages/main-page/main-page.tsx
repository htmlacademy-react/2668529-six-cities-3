import {useState} from 'react';
import OffersList from '../../components/offers-list/offers-list';
import {Offer} from '../../types/offer';

type MainPageProps = {
  offers: Offer[];
};

function MainPage({offers}: MainPageProps): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const isEmpty = offers.length === 0;

  return (
    <main className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}>
      <h1 className="visually-hidden">Cities</h1>

      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            <li className="locations__item">
              <a className="locations__item-link tabs__item" href="#todo">
                <span>Paris</span>
              </a>
            </li>
            <li className="locations__item">
              <a className="locations__item-link tabs__item" href="#todo">
                <span>Cologne</span>
              </a>
            </li>
            <li className="locations__item">
              <a className="locations__item-link tabs__item" href="#todo">
                <span>Brussels</span>
              </a>
            </li>
            <li className="locations__item">
              <a className="locations__item-link tabs__item" href="#todo">
                <span>Amsterdam</span>
              </a>
            </li>
            <li className="locations__item">
              <a className="locations__item-link tabs__item" href="#todo">
                <span>Hamburg</span>
              </a>
            </li>
            <li className="locations__item">
              <a className="locations__item-link tabs__item tabs__item--active" href="#todo">
                <span>Dusseldorf</span>
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="cities">
        <div
          className={`cities__places-container container ${
            isEmpty ? 'cities__places-container--empty' : ''
          }`}
        >
          {isEmpty ? (
            <>
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in Dusseldorf
                  </p>
                </div>
              </section>

              <div className="cities__right-section" />
            </>
          ) : (
            <>
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{offers.length} places to stay in Amsterdam</b>

                <form className="places__sorting" action="#" method="get">
                  <span className="places__sorting-caption">Sort by</span>
                  <span className="places__sorting-type" tabIndex={0}>
                    Popular
                    <svg className="places__sorting-arrow" width={7} height={4}>
                      <use xlinkHref="#icon-arrow-select" />
                    </svg>
                  </span>
                  <ul className="places__options places__options--custom places__options--opened">
                    <li className="places__option places__option--active" tabIndex={0}>
                      Popular
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: low to high
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: high to low
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Top rated first
                    </li>
                  </ul>
                </form>

                <div className="cities__places-list places__list tabs__content">
                  <OffersList
                    offers={offers}
                    cardClassName="cities"
                    onCardHover={setActiveOfferId}
                  />
                </div>
              </section>

              <div className="cities__right-section">
                <section className="cities__map map" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="visually-hidden">
        Active offer id: {activeOfferId ?? 'none'}
      </div>
    </main>
  );
}

export default MainPage;
