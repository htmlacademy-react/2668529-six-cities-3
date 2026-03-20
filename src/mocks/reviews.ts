import {Review} from '../types/review';

const reviews: Review[] = [
  {
    id: 1,
    comment: 'A quiet cozy and picturesque that hides behind a river by the unique lightness of Amsterdam.',
    date: '2019-04-24',
    rating: 4,
    user: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false
    },
  },
  {
    id: 2,
    comment: 'Beautiful place, very clean and comfortable. Great location and friendly host.',
    date: '2020-02-10',
    rating: 5,
    user: {
      name: 'Clara',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
  },
];

export {reviews};
