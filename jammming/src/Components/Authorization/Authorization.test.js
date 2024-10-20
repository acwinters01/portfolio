import App from "../App/App";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';


// Import the built-in Node.js crypto module
const crypto = require('crypto');
global.TextEncoder = require('util').TextEncoder;


// Define a mock for the global crypto object
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      // Use the crypto.randomBytes method to fill the Uint8Array
      const randomBytes = crypto.randomBytes(arr.length);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = randomBytes[i];
      }
      return arr; // Return the array filled with random values
    },
    subtle: {
      // Mock the subtle.digest function
      digest: jest.fn(async () => new Uint8Array([1, 2, 3, 4]).buffer),
    },
  },
});


jest.mock('../Authorization/Requests');

describe('Spotify Authorization Flow', () => {

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore(); // Restore original console.error after each test
    });

    it('should mock a successful login and show dashboard after login', async () => {
        // Mock the API or function responsible for login (depending on how your login is set up)
        const mockLogin = jest.fn().mockResolvedValue({
          accessToken: 'mock_access_token',
          user: { name: 'Test User' },
        });

        render(<App />);
    
        const loginButton = screen.getByText('Log in with Spotify');
        fireEvent.click(loginButton);
    
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
        });
    });
});