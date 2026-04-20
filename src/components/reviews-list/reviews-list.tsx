import {useSelector} from 'react-redux';
import ReviewItem from '../review-item/review-item';
import ReviewForm from '../../components/review-form/review-form';
import {Review} from '../../types/review.ts';
import {AuthorizationStatus} from '../../const';
import {RootState} from '../../store';
import {sortReviews} from '../../utils/reviews-utils';

type ReviewsListProps = {
  reviews: Review[];
  offerId: string;
};

function ReviewsList({reviews, offerId}: ReviewsListProps): JSX.Element {
  const authorizationStatus = useSelector((state: RootState) => state.USER.authorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;
  const sortedReviews = sortReviews(reviews);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>

      <ul className="reviews__list">
        {sortedReviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
          />
        ))}
      </ul>

      {isAuth && <ReviewForm offerId={offerId} />}
    </section>
  );
}

export default ReviewsList;
