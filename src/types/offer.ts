type BaseOffer = {
  id: number;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

type Offer = BaseOffer;

type FullOffer = BaseOffer & {
  images: string[];
  goods: string[];
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  bedrooms: number;
  maxAdults: number;
  description: string;
};

export type { Offer, FullOffer };
