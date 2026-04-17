import PlaceCard from '../place-card/place-card';
import {Offer} from '../../types/offer';

type OffersListProps = {
  offers: Offer[];
  cardClassName: string;
  handleHover?: (offerId: string | null) => void;
};

function OffersList({offers, cardClassName, handleHover}: OffersListProps): JSX.Element {
  return (
    <>
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          cardClassName={cardClassName}
          handleHover={handleHover}
        />
      ))}
    </>
  );
}

export default OffersList;
