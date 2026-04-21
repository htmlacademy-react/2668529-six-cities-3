import {useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OffersList from '../../components/offers-list/offers-list';
import CitiesList from '../../components/cities-list/cities-list';
import Map from '../../components/map/map';
import Sorting from '../../components/sorting/sorting';
import Spinner from '../../components/spinner/spinner';
import MainEmpty from '../../components/main-empty/main-empty';
import {CITIES, SortType, RequestStatus} from '../../const';
import {RootState, AppDispatch} from '../../store';
import {changeCity} from '../../store/offers-slice/offers-slice';
import {getOffersByCity, sortOffers} from '../../utils/offers-utils';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<SortType>(SortType.Popular);
  const dispatch = useDispatch<AppDispatch>();
  const currentCity = useSelector((state: RootState) => state.OFFERS.currentCity);
  const offers = useSelector((state: RootState) => state.OFFERS.offers);
  const offersRequestStatus = useSelector((state: RootState) => state.OFFERS.offersRequestStatus);
  const offersError = useSelector((state: RootState) => state.OFFERS.offersError);
  const favoriteChangeError = useSelector((state: RootState) => state.OFFERS.favoriteChangeError);

  const handleCityChange = useCallback((city: string) => {
    dispatch(changeCity(city));
    setCurrentSort(SortType.Popular);
    setActiveOfferId(null);
  }, [dispatch]);

  const filteredOffers = useMemo(() => getOffersByCity(offers, currentCity), [offers, currentCity]);
  const sortedOffers = useMemo(() => sortOffers(filteredOffers, currentSort), [filteredOffers, currentSort]);
  const isEmpty = sortedOffers.length === 0;
  const placesToStayText = sortedOffers.length === 1 ? 'place' : 'places';

  const serverErrorMessage = (offersError || favoriteChangeError) ? (
    <div
      style={{
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#d9534f',
      }}
    >
      {offersError ?? favoriteChangeError}
    </div>
  ) : null;

  if (offersRequestStatus === RequestStatus.Loading) {
    return <Spinner />;
  }

  if (isEmpty) {
    return (
      <main className="page__main page__main--index page__main--index-empty">
        <h1 className="visually-hidden">Cities</h1>

        <CitiesList
          cities={CITIES}
          currentCity={currentCity}
          onCityClick={handleCityChange}
        />

        {serverErrorMessage}

        <MainEmpty city={currentCity} />
      </main>
    );
  }

  return (
    <main className="page__main page__main--index">
      <h1 className="visually-hidden">Cities</h1>

      <CitiesList
        cities={CITIES}
        currentCity={currentCity}
        onCityClick={handleCityChange}
      />

      {serverErrorMessage}

      <div className="cities">
        <div className="cities__places-container container">
          <section className="cities__places places">
            <h2 className="visually-hidden">Places</h2>
            <b className="places__found">
              {sortedOffers.length} {placesToStayText} to stay in {currentCity}
            </b>

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
              city={filteredOffers[0].city}
              offers={sortedOffers}
              activeOfferId={activeOfferId}
              mapClassName="cities__map map"
              isScrollZoom
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
