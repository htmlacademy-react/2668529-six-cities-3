import { SortType } from '../const';
import { Offer } from '../types/offer';

function getOffersByCity(offers: Offer[], city: string): Offer[] {
  return offers.filter((offer) => offer.city.name === city);
}

function sortOffers(offers: Offer[], sortType: SortType): Offer[] {
  const sortedOffers = [...offers];

  switch (sortType) {
    case SortType.PriceLowToHigh:
      return sortedOffers.sort((offerA, offerB) => offerA.price - offerB.price);
    case SortType.PriceHighToLow:
      return sortedOffers.sort((offerA, offerB) => offerB.price - offerA.price);
    case SortType.TopRatedFirst:
      return sortedOffers.sort((offerA, offerB) => offerB.rating - offerA.rating);
    case SortType.Popular:
    default:
      return sortedOffers;
  }
}

export { getOffersByCity, sortOffers };
