import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../Components/App/App'

test('renders Jammming title', () => {
  render(<App />);
  const headerElement = screen.getByText(/Jammming/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders Authorization component', () => {
  render(<App />);
  const authorizationElement = screen.getByText(/Authorization/i);
  expect(authorizationElement).toBeInTheDocument();
});
