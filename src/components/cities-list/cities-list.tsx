type CitiesListProps = {
  cities: readonly string[];
  currentCity: string;
  onCityClick: (city: string) => void;
};

function CitiesList({ cities, currentCity, onCityClick }: CitiesListProps): JSX.Element {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li className="locations__item" key={city}>
              <a
                className={`locations__item-link tabs__item ${
                  city === currentCity ? 'tabs__item--active' : ''
                }`}
                href="#"
                onClick={(evt) => {
                  evt.preventDefault();
                  onCityClick(city);
                }}
              >
                <span>{city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CitiesList;
