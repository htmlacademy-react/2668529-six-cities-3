import {render, screen} from '@testing-library/react';
import Spinner from './spinner';

describe('Component test: Spinner', () => {
  it('should render correctly', () => {
    render(<Spinner />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
