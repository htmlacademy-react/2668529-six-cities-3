import ReviewItem from '../review-item/review-item';
import ReviewForm from '../../components/review-form/review-form';
import {Review} from '../../types/review';
import {AuthorizationStatus} from '../../const';

type ReviewsListProps = {
  reviews: Review[];
  authorizationStatus: AuthorizationStatus;
};

function ReviewsList({reviews, authorizationStatus}: ReviewsListProps): JSX.Element {
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>

      <ul className="reviews__list">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
          />
        ))}
      </ul>

      {isAuth && <ReviewForm />}
    </section>
  );
}

export default ReviewsList;
