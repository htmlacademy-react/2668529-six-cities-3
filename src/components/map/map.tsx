import {useEffect, useRef} from 'react';
import leaflet, {Icon, Marker} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Offer} from '../../types/offer';

type MapProps = {
  offers: Offer[];
  activeOfferId: number | null;
};

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const activeIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

function Map({offers, activeOfferId}: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<leaflet.Map | null>(null);
  const markersLayer = useRef<leaflet.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || offers.length === 0 || mapInstance.current) {
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

    mapInstance.current = map;
    markersLayer.current = leaflet.layerGroup().addTo(map);
  }, [offers]);

  useEffect(() => {
    if (!markersLayer.current) {
      return;
    }

    markersLayer.current.clearLayers();

    offers.forEach((offer) => {
      const marker = new Marker(
        [offer.location.latitude, offer.location.longitude],
        {
          icon: offer.id === activeOfferId ? activeIcon : defaultIcon,
        }
      );

      marker.addTo(markersLayer.current as leaflet.LayerGroup);
    });
  }, [offers, activeOfferId]);

  return <section className="cities__map map" ref={mapRef} />;
}

export default Map;
