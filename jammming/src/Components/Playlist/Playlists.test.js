import Playlist from './Playlist';
import TrackList from '../Tracklist/Tracklist';
import { mockPlaylists } from '../../test/MockTestData';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { makeSpotifyRequest } from '../Authorization/Requests';


// Mock only the necessary part of TrackList, but render the real Track component
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

describe('Playlist component Testing', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock varaiables and playlists
  const mockSetExistingPlaylist = jest.fn();
  const mockOnNameChange = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnSave = jest.fn();
  const mockExistingPlaylist = [
    {
      playlistName: 'Cello + Lofi + Chill',
      playlistId: '12345',
      tracks: [
        {
          id: 'track1',
          name: 'Track 1',
          artist: 'Artist 1',
          album: 'Album 1',
          uri: 'spotify:track:1',
          imageUri: 'https://example.com/image1.jpg',
        },
        {
          id: 'track2',
          name: 'Track 2',
          artist: 'Artist 2',
          album: 'Album 2',
          uri: 'spotify:track:2',
          imageUri: 'https://example.com/image2.jpg',
        },
      ],
    },
    { 
      playlistName: 'Playlist 3', 
      playlistId: '3', 
      tracks: [
        {
          id: 'track3',
          name: 'Track 3',
          artist: 'Artist 3',
          uri: 'spotify:track:3',
          imageUri: 'https://example.com/image3.jpg'
        }
      ],
    }
  ];
  const mockTracks =  [
    {
      id: 'alpha1',
      imageUri: 'https://example.com/alphaimage1.jpg',
      album: 'album alpha',
      artist: 'alpha',
      name: 'alpha song',
      isSelected: jest.fn(), 
      onAdd: {mockOnAdd},
      onRemove: jest.fn(),
      uri: 'alphatrackuri',
    },
    {
      id: 'alpha2',
      imageUri: 'https://example.com/betaimage2.jpg',
      album: 'album beta',
      artist: 'beta',
      name: 'beta song',
      isSelected: jest.fn(), 
      onAdd: {mockOnAdd},
      onRemove: jest.fn(),
      uri: 'betatrackuri',
    },
    {
      id: 'alpha3',
      imageUri: 'https://example.com/gammaimage3.jpg',
      album: 'album gamma',
      artist: 'gamma',
      name: 'gamma song',
      isSelected: jest.fn(), 
      onAdd: {mockOnAdd},
      onRemove: jest.fn(),
      uri: 'gammatrackuri',
    },
  ];

  describe('Testing Component Render', () => {
    // Render Tests
    it('renders without crashing and provides valid props to Tracklist', () => {

      const { getByText } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={mockExistingPlaylist[0].tracks}
          playlistName="Test Playlist"
        />
      );

    
      expect(getByText('Cello + Lofi + Chill')).toBeInTheDocument();

    });

    it('renders no playlists without crashing', () => {

      const mockExistingPlaylist = [];
      const mockPlaylistTracks = mockExistingPlaylist ? mockExistingPlaylist.map(playlist => playlist.tracks) : 'No playlists available';

      const { getByText } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={mockPlaylistTracks}
          playlistName="Test Playlist"
        />
      );

      expect(getByText('No playlists available')).toBeInTheDocument();
    });
  });


  describe('Testing Input Handling', () => {
    // Input Handling Tests
    it('playlist name input changes correctly and triggers the onNameChange callback with updated value', () => {
      // Set up
      const mockOnNameChange = jest.fn();
      render(<Playlist existingPlaylist={mockPlaylists} onNameChange={mockOnNameChange} />);
      fireEvent.change(screen.getByPlaceholderText(/New Playlist/i), { target: { value: 'New Name' } });

      // Test
      expect(mockOnNameChange).toHaveBeenCalledWith('New Name', null);
    });
  });


  describe('Testing Playlist Display', () => {
    // Playlist Display Tests
    it('testing that the correct number of playlists will render when existingPlaylist contains playlists', () => {

      const testExistingPlaylist = [
        { playlistName: 'Playlist 1', playlistId: '1', tracks: [] },
        { playlistName: 'Playlist 2', playlistId: '2', tracks: [] },
      ];

      const { getAllByText } = render(
        <Playlist
          existingPlaylist={testExistingPlaylist}
          setExistingPlaylist={jest.fn()}
          onNameChange={jest.fn()}
          onEdit={jest.fn()}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          onSave={jest.fn()}
          playlistTracks={[]}
          playlistName="Test Playlist"
        />
      );

      // Verify that both playlist names from the mockExistingPlaylist are rendered
      expect(getAllByText(/Playlist/).length).toBe(2);
  
    })

    it('verify each playlist displays the correct name, number of tracks, and track details', () => {
      const testExistingPlaylist = [
        {
          playlistName: 'With Devin',
          playlistId: '1991',
          tracks: [
            { id: 'track1', name: 'Track 1', artist: 'Artist 1'},
            {id: 'track2', name: 'Track 2', artist: 'Artist 2'}
          ],
        },
      ];
      const mockPlaylistTracks = testExistingPlaylist ? testExistingPlaylist.map(playlist => playlist.tracks) : 'No playlists available';

      const { getByText } = render(
        <Playlist 
          existingPlaylist={testExistingPlaylist}
          setExistingPlaylist={jest.fn()}
          onNameChange={jest.fn()}
          onEdit={jest.fn()}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          onSave={jest.fn()}
          playlistTracks={mockPlaylistTracks}
          playlistName="Test Playlist"
        />
      );

      // Check Playlist name
      expect(getByText('With Devin')).toBeInTheDocument();

      // Check number of tracks
      expect(getByText('Tracks: 2')).toBeInTheDocument();

      // Check track details
      expect(getByText('Track 1 by Artist 1')).toBeInTheDocument();
      expect(getByText('Track 2 by Artist 2')).toBeInTheDocument();

    });
  });


  describe('Testing Pagination Display', () => {
    // Pagination Display Tests
    it('handles pagination correctly in a playlist with tracks', () => {
      const testExistingPlaylist = [
        {
          playlistName: 'Chill Vibes',
          playlistId: '1',
          tracks: Array.from({ length: 15 }, (_, i) => ({
            id: `track${i}`,
            name: `Track ${i + 1}`,
            artist: `Artist ${i + 1}`,
          })),
        },
      ];

      const { getByText } = render(
        <Playlist 
          existingPlaylist={testExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={mockExistingPlaylist[0].tracks}
          playlistName="Test Playlist"
        />
      );

      // First page should display Tracks 1 - 10
      expect(getByText('Track 1 by Artist 1')).toBeInTheDocument();
      expect(getByText('Track 10 by Artist 10')).toBeInTheDocument();

      // Go to next 
      fireEvent.click(getByText('Next'));

      // Should display Tracks 11 - 15
      expect(getByText('Track 11 by Artist 11')).toBeInTheDocument();
      expect(getByText('Track 15 by Artist 15')).toBeInTheDocument();

      // Go to previous
      fireEvent.click(getByText('Previous'));

      // Should display Tracks 1 - 10 again
      expect(getByText('Track 1 by Artist 1')).toBeInTheDocument();
      expect(getByText('Track 10 by Artist 10')).toBeInTheDocument();


    });

    it('updates playlist pages properly based on the number of tracks', () => {
      const mockExistingPlaylist = [
        {
          playlistName: 'Chill Vibes',
          playlistId: '1',
          tracks: Array.from({ length: 12 }, (_, i) => ({
            id: `track${i}`,
            name: `Track ${i + 1}`,
            artist: `Artist ${i + 1}`,
          })),
        },
      ];
    
      const { getByText, getAllByText, container } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={jest.fn()}
          onNameChange={jest.fn()}
          onEdit={jest.fn()}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          onSave={jest.fn()}
          playlistTracks={mockExistingPlaylist[0].tracks}
          playlistName="Test Playlist"
        />
      );
    
      // First page should display Tracks 1 - 10
      expect(getByText('Track 1 by Artist 1')).toBeInTheDocument();
      expect(getByText('Track 10 by Artist 10')).toBeInTheDocument();
    
      // Go to next page
      fireEvent.click(getByText('Next'));
    
      // Should display Tracks 11 - 12
      expect(getByText('Track 11 by Artist 11')).toBeInTheDocument();
      expect(getByText('Track 12 by Artist 12')).toBeInTheDocument();



      // Test Pagination on Edited Playlists
      const playlistContainer = container.querySelector('.Playlist')
      const editButton = within(playlistContainer).getByText('Edit');

      // Check if the editButton selected is the right one.
      expect(editButton.getAttribute('data-testid')).toBe('1-EditPlaylist');

      fireEvent.click(editButton);

      const editContainer = container.querySelector('.EditingPlaylist');
      const { getByText: getByTextInEdit } = within(editContainer)

      // First page should display Tracks 1 - 5
      expect(getByTextInEdit('Track ID: track0')).toBeInTheDocument();
      expect(getByTextInEdit('Track ID: track4')).toBeInTheDocument();

      // Go to next 
      fireEvent.click(getByTextInEdit('Next'));

      // Should display Tracks 6 - 10
      expect(getByTextInEdit('Track ID: track5')).toBeInTheDocument();
      expect(getByTextInEdit('Track ID: track9')).toBeInTheDocument();

      // Go to previous
      fireEvent.click(getByTextInEdit('Previous'));

      // Should display Tracks 1 - 5 again
      expect(getByTextInEdit('Track ID: track0')).toBeInTheDocument();
      expect(getByTextInEdit('Track ID: track4')).toBeInTheDocument();
    });

  });


  describe('Testing Track Removal', () => {
    it('should remove a track to the playlist when onRemove is triggered', () => {

      const { getByTextId, getAllByTestId } = render(
        <div>
          <Playlist
            existingPlaylist={mockExistingPlaylist}
            setExistingPlaylist={jest.fn()}
            onNameChange={jest.fn()}
            onEdit={jest.fn()}
            onAdd={jest.fn()}
            onRemove={mockOnRemove}
            onSave={jest.fn()}
            playlistTracks={mockExistingPlaylist[0].tracks}
            playlistName="Test Playlist"
          />
        </div>

      );

      const editButton = screen.getByTestId('12345-EditPlaylist');
      fireEvent.click(editButton);

      const removeButtons = getAllByTestId('track-track1');
      fireEvent.click(removeButtons[0]); 
    
      expect(mockOnRemove).toHaveBeenCalledWith(expect.objectContaining({
        id: 'track1',
        name: 'Track 1',
      }));
    });
  });


  describe('Testing Playlist Removal', () => {
    // Playlist Removal
    it('should remove a playlist when handlePlaylistRemove is called', () => {
      const mockSetExistingPlaylist = jest.fn();

      const { getAllByText } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={jest.fn()}
          onEdit={jest.fn()}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          onSave={jest.fn()}
          playlistTracks={[]}
          playlistName="Test Playlist"
        />
      );

      const removeButtons = getAllByText('-');  // Assuming '-' is used for playlist remove button
      fireEvent.click(removeButtons[0]);  // Click the remove button for the first playlist

      expect(mockSetExistingPlaylist).toHaveBeenCalled(); 
    });
  });


  describe('Testing Spotify API Interaction', () => {
    // Spotify API Interaction
    it('should send a request to create a new playlist on Spotify', async () => {

      makeSpotifyRequest
        .mockResolvedValueOnce({ id: 'newPlaylistId' })

      const { getByTestId } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={mockExistingPlaylist[0].tracks}
          playlistName='Test Playlist'
        />
      );

      const saveButton = getByTestId('12345-Transfer');
      fireEvent.click(saveButton);

      // Wait for the Spotify API request to complete
      await waitFor(() => expect(makeSpotifyRequest).toHaveBeenCalledWith(
        'me/playlists',
        'POST',
        expect.objectContaining({
          name: 'Cello + Lofi + Chill',
          description: 'New playlist created from Jammming app',
          public: true
        })
      ));
    });

    describe('Testing Error Handling in Spotify API Interaction', () => {

      it('should handle errors correctly when the Spotify API fails during playlist creation', async () => {

        makeSpotifyRequest.mockRejectedValueOnce(new Error('Spotify API failed'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByTestId } = render(
          <Playlist
            existingPlaylist={mockExistingPlaylist}
            setExistingPlaylist={mockSetExistingPlaylist}
            onNameChange={mockOnNameChange}
            onEdit={mockOnEdit}
            onAdd={mockOnAdd}
            onRemove={mockOnRemove}
            onSave={mockOnSave}
            playlistTracks={mockExistingPlaylist[0].tracks}
            playlistName='Test Playlist'
          />
        );

        const saveButton = getByTestId('12345-Transfer');
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(makeSpotifyRequest).toHaveBeenCalledWith(
            'me/playlists',
            'POST',
            expect.any(Object)
          );
          expect(consoleErrorSpy).toHaveBeenCalledWith('Error transferring playlist to Spotify:', expect.any(Error));
        });

        // Clean up the console spy
        consoleErrorSpy.mockRestore();
      });

      it('should handle error correctly when adding tracks to a playlist fails', async () => {
        
        makeSpotifyRequest
          .mockResolvedValueOnce({ id: 'newPlaylistId' })
          .mockRejectedValueOnce(new Error('Track addition failed'));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByTestId } = render(
          <Playlist
            existingPlaylist={mockExistingPlaylist}
            setExistingPlaylist={mockSetExistingPlaylist}
            onNameChange={mockOnNameChange}
            onEdit={mockOnEdit}
            onAdd={mockOnAdd}
            onRemove={mockOnRemove}
            onSave={mockOnSave}
            playlistTracks={mockExistingPlaylist[0].tracks}
            playlistName='Test Playlist'
          />
        );

        const saveButton = getByTestId('12345-Transfer');
        fireEvent.click(saveButton);

        // Wait for the error to be caught during track addition
        await waitFor(() => {
          expect(makeSpotifyRequest).toHaveBeenCalledWith(
            'playlists/newPlaylistId/tracks',
            'POST',
            expect.any(Object)
          );
          expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding tracks to the playlist:', expect.any(Error));
        });

        consoleErrorSpy.mockRestore();

      });
    });
  });


  describe('Testing "Edit Playlist" Functionality', () => {
    it('should select the correct playlist for editing when "edit" is clicked', () => {
      const { container } = render(
        <Playlist
          existingPlaylist={mockExistingPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={mockExistingPlaylist[0].tracks}
          playlistName='Test Playlist'
        />
      );

      const playlistContainer = container.querySelector('.Playlist')
      const editButton = within(playlistContainer).getByText('Edit');

      // Check if the editButton selected is the right one.
      expect(editButton.getAttribute('data-testid')).toBe('12345-EditPlaylist');

      fireEvent.click(editButton);

      // Playlist Container will move to edit playlist check if this happened.
      const editPlaylistContainer = container.querySelector('.EditingPlaylist');
      expect(playlistContainer).not.toBeVisible();

      // Check if the Save button is within the playlist that is edited. 
      const saveButton = within(editPlaylistContainer).getByText('Save');

    });
  });


  describe('Edge Case Tests...', () => {
    it('Ensure that the component handles cases where a playlist has no tracks', () => {
      const emptyTrackPlaylist = [
        {
          playlistName: 'Empty Playlist', 
          playlistId: 0o0, 
          tracks: []
        }, 
      ];

      const { getByText } = render(
        <Playlist
          existingPlaylist={emptyTrackPlaylist}
          setExistingPlaylist={mockSetExistingPlaylist}
          onNameChange={mockOnNameChange}
          onEdit={mockOnEdit}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
          onSave={mockOnSave}
          playlistTracks={[]}
          playlistName="Test Playlist Edge Case"
        />
      );

      expect(getByText('No tracks found')).toBeInTheDocument();
        

    });

    it('Ensure the component handles cases where the playlist is saved without a name', () => {

    });
  });
});

