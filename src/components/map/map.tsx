import {useEffect, useRef} from 'react';
import leaflet, {Icon, Marker} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Offer} from '../../types/offer';

type MapProps = {
  offers: Offer[];
  activeOfferId: number | null;
  mapClassName: string;
  city: {
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  isScrollZoom?: boolean;
};

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

const activeIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

function Map({ offers, activeOfferId, mapClassName, city, isScrollZoom }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<leaflet.Map | null>(null);
  const markersLayer = useRef<leaflet.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) {
      return;
    }

    const map = leaflet.map(mapRef.current);

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map);

    mapInstance.current = map;
    markersLayer.current = leaflet.layerGroup().addTo(map);
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !city) {
      return;
    }

    mapInstance.current.setView(
      [city.location.latitude, city.location.longitude],
      city.location.zoom
    );
  }, [city]);

  useEffect(() => {
    if (!mapInstance.current) {
      return;
    }

    if (isScrollZoom) {
      mapInstance.current.scrollWheelZoom.enable();
    } else {
      mapInstance.current.scrollWheelZoom.disable();
    }
  }, [isScrollZoom]);

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

  return (
    <section
      className={mapClassName}
      ref={mapRef}
      style={{ maxWidth: '1144px', marginLeft: 'auto', marginRight: 'auto' }}
    />
  );
}

export default Map;
