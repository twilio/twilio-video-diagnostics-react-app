import { render, fireEvent } from '@testing-library/react';
import { Snackbar } from './Snackbar';

//@ts-ignore
delete window.location;

//@ts-ignore
window.location = { reload: jest.fn() };

describe('the Snackbar component', () => {
  it('should render correctly', () => {
    const { container } = render(<Snackbar open={true} />);
    expect(container).toMatchSnapshot();
  });

  it('should refresh the page when "Refresh page" is clicked on', () => {
    const { getByText } = render(<Snackbar open={true} />);
    const refreshBtn = getByText('Refresh page');

    fireEvent.click(refreshBtn);

    expect(window.location.reload).toHaveBeenCalled();
  });
});
