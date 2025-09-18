import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

function Hello() {
  return <div>Hello Jest!</div>;
}

test('renders Hello Jest!', () => {
  render(<Hello />);
  expect(screen.getByText('Hello Jest!')).toBeInTheDocument();
});
