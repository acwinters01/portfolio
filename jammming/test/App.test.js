import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../Components/App/App';

// Mock the child components and external dependencies
jest.mock('../Components/Authorization/Authorization', () => () => <div>Authorization</div>);
jest.mock('../Components/SearchBar/SearchBar', () => ({ onSearchResults }) => <div>SearchBar</div>);
jest.mock('../Components/Playlist/Playlist', () => () => <div>Playlist</div>);
jest.mock('../Components/Dashboard/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('../Authorization/Requests', () => ({
  getUserProfile: jest.fn(() => Promise.resolve({ country: 'US' })),
  makeSpotifyRequest: jest.fn(() => Promise.resolve({ items: [] })),
}));

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

test('renders SearchBar component', () => {
  render(<App />);
  const searchBarElement = screen.getByText(/SearchBar/i);
  expect(searchBarElement).toBeInTheDocument();
});

test('renders Playlist component', () => {
  render(<App />);
  const playlistElement = screen.getByText(/Playlist/i);
  expect(playlistElement).toBeInTheDocument();
});

test('renders Dashboard component', () => {
  render(<App />);
  const dashboardElement = screen.getByText(/Dashboard/i);
  expect(dashboardElement).toBeInTheDocument();
});
