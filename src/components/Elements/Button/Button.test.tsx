import { describe, expect, test, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

const buttonContent = 'This is a test button';

describe('Button test', () => {
  test('renders content', () => {
    const { unmount } = render(<Button>{buttonContent}</Button>);

    const button = screen.getByText(buttonContent);

    expect(button).toBeDefined();
    unmount();
  });

  test('user clicking works correctly', async () => {
    const mockHandler = vi.fn();

    const { unmount } = render(<Button onClick={mockHandler}>{buttonContent}</Button>);

    const button = screen.getByText(buttonContent);

    await userEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
    unmount();
  });

  test('onClick not working when the button is disabled', async () => {
    const mockHandler = vi.fn();

    const { unmount } = render(<Button disabled onClick={mockHandler}>{buttonContent}</Button>);

    const button = screen.getByText(buttonContent);
    await userEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(0);
    unmount();
  });
});

test('renders <Link /> when using asLink and to props', () => {
  const linkTo = '/test';

  render(
    <Router>
      <Button asLink to={linkTo}>{buttonContent}</Button>
    </Router>
  );

  const anchor = screen.getByRole('link');
  expect(anchor).toHaveAttribute('href', linkTo);
  expect(anchor).toBeDefined();
});
