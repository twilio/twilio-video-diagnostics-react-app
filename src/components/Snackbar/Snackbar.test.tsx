import { render } from '@testing-library/react';
import { Snackbar } from './Snackbar';

describe('the Snackbar component', () => {
  it('should render correctly', () => {
    const { container } = render(<Snackbar open={true} />);
    expect(container).toMatchSnapshot();
  });
});
