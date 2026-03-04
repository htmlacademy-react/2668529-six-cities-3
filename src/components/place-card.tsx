type PlaceCardProps = {
  cardClassName: string;
  isPremium?: boolean;
  imageSrc: string;
  price: number;
  isBookmarked?: boolean;
  ratingPercent: number;
  title: string;
  offerType: string;
};

function PlaceCard({
  cardClassName,
  isPremium = false,
  imageSrc,
  price,
  isBookmarked = false,
  ratingPercent,
  title,
  offerType,
}: PlaceCardProps): JSX.Element {
  return (
    <article className={`${cardClassName} place-card`}>
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className={`${cardClassName}__image-wrapper place-card__image-wrapper`}>
        <a href="#">
          <img
            className="place-card__image"
            src={imageSrc}
            width={260}
            height={200}
            alt="Place image"
          />
        </a>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button
            className={`place-card__bookmark-button button ${
              isBookmarked ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">
              {isBookmarked ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ratingPercent}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <a href="#">{title}</a>
        </h2>

        <p className="place-card__type">{offerType}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
