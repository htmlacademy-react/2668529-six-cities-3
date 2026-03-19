/*import {useEffect, useRef} from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Offer} from '../../types/offer';

type MapProps = {
  offers: Offer[];
};

function Map({offers}: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || offers.length === 0) {
      return;
    }

    const firstOffer = offers[0];

    const map = leaflet.map(mapRef.current).setView(
      [firstOffer.location.latitude, firstOffer.location.longitude], firstOffer.location.zoom
    );

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map);

    offers.forEach((offer) => {
      leaflet
        .marker([offer.location.latitude, offer.location.longitude])
        .addTo(map);
    });

    return () => {
      map.remove();
    };

  }, [offers]);

  return <section className="cities__map map" ref={mapRef} />;
}

export default Map;*/
