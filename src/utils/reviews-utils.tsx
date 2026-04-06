import {Review} from '../types/review.ts';

function sortReviews(reviews: Review[]): Review[] {
  return reviews.sort((reviewA, reviewB) => Date.parse(reviewB.date) - Date.parse(reviewA.date))
    .slice(0, 10);
}

export {sortReviews};
