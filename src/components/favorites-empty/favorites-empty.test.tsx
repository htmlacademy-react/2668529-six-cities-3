import {render, screen} from '@testing-library/react';
import FavoritesEmpty from './favorites-empty';

describe('Component test: FavoritesEmpty', () => {
  it('should render correctly', () => {
    render(<FavoritesEmpty />);
    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing yet saved/i)).toBeInTheDocument();
  });
});
