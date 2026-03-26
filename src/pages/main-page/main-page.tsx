import {useState} from 'react';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import {CITIES} from '../../const';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import {State} from '../../store';
import {changeCity} from '../../store/action';
import CitiesList from '../../components/cities-list/cities-list';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const currentCity = useSelector((state: State) => state.city);
  const offers = useSelector((state: State) => state.offers);
  const filteredOffers = offers.filter((offer) => offer.city.name === currentCity);
  const isEmpty = filteredOffers.length === 0;

  return (
    <main className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}>
      <h1 className="visually-hidden">Cities</h1>

      <CitiesList
        cities={CITIES}
        currentCity={currentCity}
        onCityClick={(city) => dispatch(changeCity(city))}
      />

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
                    We could not find any property available at the moment in {currentCity}
                  </p>
                </div>
              </section>

              <div className="cities__right-section" />
            </>
          ) : (
            <>
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{filteredOffers.length} places to stay in {currentCity}</b>

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
                    offers={filteredOffers}
                    cardClassName="cities"
                    handleHover={setActiveOfferId}
                  />
                </div>
              </section>

              <div className="cities__right-section">
                <Map
                  offers={filteredOffers}
                  activeOfferId={activeOfferId}
                  mapClassName="cities__map map"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default MainPage;
