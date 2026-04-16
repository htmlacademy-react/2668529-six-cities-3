import {MouseEvent, memo} from 'react';
import {Link, generatePath, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppRoute, AuthorizationStatus} from '../../const';
import {Offer} from '../../types/offer';
import {AppDispatch, RootState} from '../../store';
import {changeFavoriteStatus} from '../../store/offers-slice/offers-slice';
import {capitalize} from '../../utils/offers-utils';

type PlaceCardProps = {
  offer: Offer;
  cardClassName: string;
  handleHover?: (offerId: string | null) => void;
};

function PlaceCard({offer, cardClassName, handleHover}: PlaceCardProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector((state: RootState) => state.USER.authorizationStatus);
  const {id, title, type, price, previewImage, isPremium, isFavorite, rating} = offer;
  const isBookmarkActive = authorizationStatus === AuthorizationStatus.Auth && isFavorite;
  const offerPath = generatePath(AppRoute.Offer, {id: id});
  const imageWidth = cardClassName === 'favorites' ? 150 : 260;
  const imageHeight = cardClassName === 'favorites' ? 110 : 200;

  const handleMouseOn = () => {
    handleHover?.(id);
  };

  const handleMouseOff = () => {
    handleHover?.(null);
  };

  const handleBookmarkClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }
    const nextStatus = isFavorite ? 0 : 1;
    try {
      await dispatch(
        changeFavoriteStatus({
          offerId: String(id),
          status: nextStatus,
        })
      ).unwrap();
    } catch (error) {
      void error;
    }
  };

  return (
    <article
      className={`${cardClassName}__card place-card`}
      onMouseEnter={handleMouseOn}
      onMouseLeave={handleMouseOff}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className={`${cardClassName}__image-wrapper place-card__image-wrapper`}>
        <Link to={offerPath}>
          <img
            className="place-card__image"
            src={previewImage}
            width={imageWidth}
            height={imageHeight}
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
              isBookmarkActive ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
            onClick={(evt) => {
              void handleBookmarkClick(evt);
            }}
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">
              {isBookmarkActive ? 'In bookmarks' : 'To bookmarks'}
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
          <Link to={offerPath}>{title}</Link>
        </h2>

        <p className="place-card__type">{capitalize(type)}</p>
      </div>
    </article>
  );
}

const MemoizedPlaceCard = memo(PlaceCard);

export default MemoizedPlaceCard;
