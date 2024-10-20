import Dashboard from "./Dashboard";
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import { makeSpotifyRequest, getUserProfile, getUserPlaylists } from '../Authorization/Requests';

jest.mock('../Authorization/Requests');

describe('Testing Dashboard Component', () => {

    const handlePlaylistSync = jest.fn();
    const mockUserProfile = { display_name: 'Test User', email: 'test@useremail.com', country: 'US', images: [{}, {url: 'http//imageExample.com/image.png'}] };

    describe('Testing Component Rendering', () => {
        let consoleErrorSpy;

        beforeEach(() => {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleErrorSpy.mockRestore(); // Restore original console.error after each test
        });

        const  mockUserPlaylists = { items: [{ name: 'User Playlist Test 1', images: [{ url: 'http://examplePlaylist.com/playlist.png' }], id: 'playlistId' }] };

        it('should display loading test when data is loading in', async () => {
            await act(async () => {
                render(<Dashboard/>);
            });
            expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        });

        it('should display the user profile and playlists when loaded', async () => {
            getUserProfile.mockResolvedValue(mockUserProfile);
            getUserPlaylists.mockResolvedValue(mockUserPlaylists);

            await act(async () => {
                render(<Dashboard/>);
            });

            expect( await screen.findByText('Test User')).toBeInTheDocument();
            expect( await screen.findByText('User Playlist Test 1')).toBeInTheDocument();
        });

        describe('Testing Rendering Error Handling', () => {

            it('should display error when fetching UserProfile data fails', async () => {
                getUserProfile.mockRejectedValue(new Error('Profile fetch error'));

                await act(async () => {
                    render(<Dashboard/>);
                });

                expect( await screen.findByText('Error: An error occurred while fetching the user profile.')).toBeInTheDocument();
            });

            it('should display error when fetching user playlists data fails', async () => {
                getUserProfile.mockResolvedValue(mockUserProfile);
                getUserPlaylists.mockRejectedValue(new Error('User Playlists fetch error.'))

                await act(async () => {
                    render(<Dashboard/>);
                });

                expect( await screen.findByText('Error: An error occurred while fetching the user playlists.')).toBeInTheDocument();
            });
        });
    });

    describe('Testing Dashboard Pagination', () => {
        const mockUserPlaylists = {
            items: Array.from({ length: 12 }, (_, i) => ({
                name: `Playlist ${i + 1}`,
                images: [{ url: 'http://example.com/playlist.jpg' }],
                id: `playlistId${i + 1}`,
            }))
        };

        it('test that pagination works as expected and updates the displayed playlists', async () => {

            getUserProfile.mockResolvedValue(mockUserProfile);
            getUserPlaylists.mockResolvedValue(mockUserPlaylists);

            await act(async () => {
                render(<Dashboard/>);
            });

            // Expect Playlist 1 - 5 to render
            expect( await screen.findByText('Playlist 1')).toBeInTheDocument();
            expect( await screen.findByText('Playlist 5')).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(screen.getByText('Next'));
            });

            // Expect Playlist 6 - 10 to render
            expect( await screen.findByText('Playlist 6')).toBeInTheDocument();
            expect( await screen.findByText('Playlist 10')).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(screen.getByText('Next'));
            });

            // Expect Playlist 11 - 12 to render
            expect( await screen.findByText('Playlist 11')).toBeInTheDocument();
            expect( await screen.findByText('Playlist 12')).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(screen.getByText('Previous'));
            });

            // Expect Playlist 6 - 10 to render
            expect( await screen.findByText('Playlist 6')).toBeInTheDocument();
            expect( await screen.findByText('Playlist 10')).toBeInTheDocument();

        });

    });

    describe('Testing Playlist Syncing', () => {

        const mockUserPlaylists = {
            items: Array.from({ length: 3 }, (_, i) => ({
                name: `Playlist ${i + 1}`,
                images: [{ url: 'http://example.com/playlist.jpg' }],
                id: `playlistId${i + 1}`,
            }))
        };

        // Make sure getUserProfile and getUserPlaylists data are in before continuing. 
        beforeEach(() => {
            getUserProfile.mockResolvedValue(mockUserProfile);
            getUserPlaylists.mockResolvedValue(mockUserPlaylists);
        });

        it('should call makeSpotifyRequest within the handlePlaylistSync function when sync button is clicked', async () => {
            makeSpotifyRequest.mockResolvedValueOnce({});

            await act(async () => {
                render(<Dashboard setExistingPlaylist={jest.fn()}/>);
            });

            const syncButtons = await screen.findAllByText('Sync');


            await act(async () => {
                fireEvent.click(syncButtons[0]);
            });

            await waitFor(() => expect(makeSpotifyRequest).toHaveBeenCalled());
            expect(makeSpotifyRequest).toHaveBeenCalledWith(expect.stringContaining('playlists/playlistId1/tracks'), 'GET');

        });

        describe('Further handlePlaylistSync Testing', () => {
        
            it('should fetch playlists with less than 100 tracks without batches', async () => {

                const mockPlaylist = {
                    id: 'playlistId1',
                    name: 'Test Playlist',
                    tracks: Array.from({ length: 50 }, (_, i) => ({
                        id: `track${i}`,
                        name: `Track ${i + 1}`,
                        artist: `Artist ${i + 1}`,
                        album: `Album ${i + 1}`,
                        uri: `spotify:track:${i + 1}`
                    }))
                };

                makeSpotifyRequest.mockResolvedValueOnce({ items: mockPlaylist.tracks, total: 50 });
                
                await act(async () => {
                    render(<Dashboard setExistingPlaylist={jest.fn()}/>);
                });                
                
                const syncButton = await screen.findAllByText('Sync');

                await act(async () => {
                    fireEvent.click(syncButton[0]);
                });

                await waitFor(() => expect(makeSpotifyRequest).toHaveBeenCalledTimes(1));
            });

            it('should fetch playlists with more than 100 tracks in batches of 100', async () => {
                
                const mockPlaylist = {
                    id: 'playlistId1',
                    name: 'Test Playlist',
                    tracks: Array.from({ length: 439 }, (_, i) => ({
                        id: `track${i}`,
                        name: `Track ${i + 1}`,
                        artist: `Artist ${i + 1}`,
                        album: `Album ${i + 1}`,
                        uri: `spotify:track:${i + 1}`
                    }))
                };

                makeSpotifyRequest.mockResolvedValue({ items: mockPlaylist.tracks, total: 439 });
                await act(async () => {
                    render(<Dashboard setExistingPlaylist={jest.fn()}/>);
                });
                const syncButtons = await screen.findAllByText('Sync');

                await act(async () => {
                    fireEvent.click(syncButtons[0]);
                });

                await waitFor(() => expect(makeSpotifyRequest).toHaveBeenCalledTimes(5))

            });

            describe('Error Handling for handlePlaylistSync', () => {
                const mockPlaylist = { id: 'playlistId1', name: 'Test Playlist' };

                it('handles errors in API fetch', async () => {

                    makeSpotifyRequest
                        .mockResolvedValueOnce({ items: Array.from({ length: 100 }), total: 150 })
                        .mockRejectedValueOnce(new Error ('API Error'));

                    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

                    await act(async () => {
                        render(<Dashboard setExistingPlaylist={jest.fn()}/>);
                    });

                    const syncButtons = await screen.findAllByText('Sync');

                    await act(async () => {
                        fireEvent.click(syncButtons[0]);
                    });

                    await waitFor(() => {
                        expect(consoleErrorSpy).toHaveBeenCalled();
                    });

                    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching playlist tracks:'), expect.any(Error));
                    consoleErrorSpy.mockRestore();
                });
            });
        });
    });
});