import App from "./App";
import TrackList from "../Tracklist/Tracklist";
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import { makeSpotifyRequest, getUserProfile, getUserPlaylists, getToken } from '../Authorization/Requests';
import { initiateAuthorization } from '../Authorization/Authorization';

// Import the built-in Node.js crypto module
const crypto = require('crypto');
global.TextEncoder = require('util').TextEncoder;

// Define a mock for the global crypto object
beforeAll(() => {
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
});

jest.mock('../Tracklist/Tracklist', () => (props) => {
    const Track = require('../Track/Track').default;
    const currentTracks = props.tracks || [];
  
    // Replicating the isSelected logic from TrackList
    const isSelected = (track) => {
      return props.playlistTracks.some(playlistTrack => playlistTrack.id === track.id);
    };
  
    return (
      <div>
        {currentTracks.length > 0 ? (
          currentTracks.map((track, i) => (
  
            <Track
              key={`${track.id}-${i}`}
              id={track.id}
              name={track.name}
              artist={track.artist}
              album={track.album}
              uri={track.uri}
              imageUri={track.imageUri}
              onAdd={props.onAdd}
              onRemove={props.onRemove}
              isSelected={() => isSelected(track)}
            />
          ))
        ) : (
          <p>No tracks found</p>
        )}
      </div>
    );
});

  // Mock the makeSpotifyRequest function from Requests
jest.mock('../Authorization/Requests');
const mockUserProfile = { display_name: 'Test User', email: 'test@useremail.com', country: 'US', images: [{}, {url: 'http//imageExample.com/image.png'}] };
const mockUserPlaylists = { items: [{ name: 'User Playlist Test 1', images: [{ url: 'http://examplePlaylist.com/playlist.png' }], id: 'playlistId' }] };


describe('Testing App Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
   
    afterEach(() => {
        consoleErrorSpy.mockRestore(); // Restore original console.error after each test
    });

    
    const mockLogin = jest.fn().mockResolvedValue({
    accessToken: 'mock_access_token',
    user: { name: 'Test User' },
    });

    describe('Testing sub-Component Rendering', () => {

        it('Testing Authorization Log In', async () => {
            await act(async () => {
                render(<App />);
            });
            const loginButton = await waitFor(() => screen.getByText('Log in with Spotify'));
            expect(loginButton).toBeInTheDocument();
        });

        it('Testing SearchBar Rendered Successfully', async () => {
            await act(async () => {
                render(<App />);
            });
            expect(screen.getByText('Search')).toBeInTheDocument();
        });

        it('Testing Dashboard Rendered Successfully', async () => {
            await act(async () => {
                render(<App />);
            });
            const loginButton = screen.getByText('Log in with Spotify');
            await act(async () => {
                fireEvent.click(loginButton);
            });
            
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
            });
        });

        it('Testing Playlist Rendered Successfully', async () => {
            getUserProfile.mockResolvedValue(mockUserProfile);
            getUserPlaylists.mockResolvedValue(mockUserPlaylists);

            const { container } =  render(<App />);
            const loginButton = screen.getByText('Log in with Spotify');
            await act(async () => {
                fireEvent.click(loginButton);
            });
     
            await waitFor(() => {
                const playlistContainer = container.querySelector('.dashboardPlaylist-0')
                const playlistTitle = within(playlistContainer).getByText('User Playlist Test 1');
                expect(playlistTitle).toBeInTheDocument();

            });
        });
    });

    describe('Testing Initial State', () => {
        it('should render correct default states for Search Results and Playlists', () => {
            const { container } = render(<App />);
            const tracklist = container.querySelector('.trackListContainer');

            expect(tracklist).toBeInTheDocument();
            expect(tracklist).toHaveTextContent('No tracks found');

            const playlist = container.querySelector('.allPlaylistsContainer');
            expect(playlist).toBeInTheDocument();
        });
    });
});
