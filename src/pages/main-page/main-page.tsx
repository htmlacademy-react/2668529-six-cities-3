import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OffersList from '../../components/offers-list/offers-list';
import CitiesList from '../../components/cities-list/cities-list';
import Map from '../../components/map/map';
import Sorting from '../../components/sorting/sorting';
import {CITIES, SortType} from '../../const';
import {State, AppDispatch} from '../../store';
import {changeCity} from '../../store/action';
import {getOffersByCity, sortOffers} from '../../utils/offers-utils';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const [currentSort, setCurrentSort] = useState<SortType>(SortType.Popular);
  const dispatch = useDispatch<AppDispatch>();
  const currentCity = useSelector((state: State) => state.city);
  const offers = useSelector((state: State) => state.offers);

  const handleCityChange = (city: string) => {
    dispatch(changeCity(city));
    setCurrentSort(SortType.Popular);
    setActiveOfferId(null);
  };

  const filteredOffers = getOffersByCity(offers, currentCity);
  const sortedOffers = sortOffers(filteredOffers, currentSort);
  const isEmpty = sortedOffers.length === 0;

  return (
    <main className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}>
      <h1 className="visually-hidden">Cities</h1>

      <CitiesList
        cities={CITIES}
        currentCity={currentCity}
        onCityClick={handleCityChange}
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
                <b className="places__found">{sortedOffers.length} places to stay in {currentCity}</b>

                <Sorting
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />

                <div className="cities__places-list places__list tabs__content">
                  <OffersList
                    offers={sortedOffers}
                    cardClassName="cities"
                    handleHover={setActiveOfferId}
                  />
                </div>
              </section>

              <div className="cities__right-section">
                <Map
                  offers={sortedOffers}
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
