import PlaceCard from '../place-card/place-card';
import {Offer} from '../../types/offer';

type OffersListProps = {
  offers: Offer[];
  cardClassName: string;
};

function OffersList({offers, cardClassName}: OffersListProps): JSX.Element {
  return (
    <>
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          cardClassName={cardClassName}
        />
      ))}
    </>
  );
}

export default OffersList;
