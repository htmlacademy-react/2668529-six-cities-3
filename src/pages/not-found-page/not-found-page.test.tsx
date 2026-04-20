import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import NotFoundPage from './not-found-page';

describe('Page test: NotFoundPage', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
