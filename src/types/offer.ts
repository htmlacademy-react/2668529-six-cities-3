type Offer = {
  id: number;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  services: string[];
  bedrooms: number;
  maxAdults: number;
};

export type {Offer};
