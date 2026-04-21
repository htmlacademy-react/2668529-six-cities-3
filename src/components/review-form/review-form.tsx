import {ChangeEvent, FormEvent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import {sendReview} from '../../store/offer-slice/offer-slice';
import {RequestStatus} from '../../const';
import {getReviewSendingRequestStatus, getReviewSendingRequestError} from '../../store/offer-slice/selectors.ts';

const MIN_REVIEW_LENGTH = 50;
const MAX_REVIEW_LENGTH = 300;

type ReviewFormProps = {
  offerId: string;
};

function ReviewForm({offerId}: ReviewFormProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const reviewSendingRequestStatus = useSelector(getReviewSendingRequestStatus);
  const reviewSendingRequestError = useSelector(getReviewSendingRequestError);
  const isReviewSending = reviewSendingRequestStatus === RequestStatus.Loading;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const isSubmitDisabled =
    rating === 0 ||
    review.length < MIN_REVIEW_LENGTH ||
    review.length > MAX_REVIEW_LENGTH ||
    isReviewSending;

  const handleReviewChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(evt.target.value);
  };

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value));
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isSubmitDisabled) {
      return;
    }
    try {
      await dispatch(sendReview({offerId, comment: review, rating})).unwrap();
      setReview('');
      setRating(0);
    } catch (error) {
      void error;
    }
  };

  return (
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={(evt) => {
        evt.preventDefault();
        void handleSubmit(evt);
      }}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          checked={rating === 5}
          onChange={handleRatingChange}
          disabled={isReviewSending}
        />
        <label htmlFor="5-stars" className="reviews__rating-label form__rating-label" title="perfect">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={rating === 4}
          onChange={handleRatingChange}
          disabled={isReviewSending}
        />
        <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={rating === 3}
          onChange={handleRatingChange}
          disabled={isReviewSending}
        />
        <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={rating === 2}
          onChange={handleRatingChange}
          disabled={isReviewSending}
        />
        <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-stars"
          type="radio"
          checked={rating === 1}
          onChange={handleRatingChange}
          disabled={isReviewSending}
        />
        <label htmlFor="1-stars" className="reviews__rating-label form__rating-label" title="terribly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
        disabled={isReviewSending}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span>{' '}
          and describe your stay with at least{' '}
          <b className="reviews__text-amount">{MIN_REVIEW_LENGTH} characters</b>.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            gap: '10px'
          }}
        >
          {reviewSendingRequestError && (
            <p
              style={{
                color: '#ff4d4f',
                backgroundColor: 'rgba(255, 77, 79, 0.1)',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '14px',
                margin: 0
              }}
            >
              {reviewSendingRequestError}
            </p>
          )}

          <button
            className="reviews__submit form__submit button"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {isReviewSending ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
