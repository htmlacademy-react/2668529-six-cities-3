import {Link, generatePath} from 'react-router-dom';
import {AppRoute} from '../../const';
import {Offer} from '../../types/offer';

type PlaceCardProps = {
  offer: Offer;
  cardClassName: string;
};

function PlaceCard({offer, cardClassName}: PlaceCardProps): JSX.Element {
  const {id, title, type, price, previewImage, isPremium, isFavorite, rating} = offer;

  return (
    <article className={`${cardClassName}__card place-card`}>
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className={`${cardClassName}__image-wrapper place-card__image-wrapper`}>
        <Link to={generatePath(AppRoute.Offer, {id: String(id)})}>
          <img
            className="place-card__image"
            src={previewImage}
            width={260}
            height={200}
            alt="Place image"
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button
            className={`place-card__bookmark-button button ${
              isFavorite ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${rating * 20}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={generatePath(AppRoute.Offer, {id: String(id)})}>
            {title}
          </Link>
        </h2>

        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
