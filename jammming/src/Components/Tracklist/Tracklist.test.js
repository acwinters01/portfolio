import Playlist from '../Playlist/Playlist';
import TrackList from './Tracklist';
import { mockPlaylists } from '../../test/MockTestData';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { makeSpotifyRequest } from '../Authorization/Requests';


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
jest.mock('../Authorization/Requests');

const mockOnAdd = jest.fn();
const mockOnRemove = jest.fn();
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


describe('Tracklist Component Testing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing Track Addition', () => {
        // Track Addition and Removal
        it('should add a track to the playlist when onAdd is triggered', () => {
    
          const { getAllByText, getByText } = render(
            <div>
              <TrackList 
                tracks={mockTracks}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
                playlistTracks={mockExistingPlaylist[0].tracks}
              />
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
            </div>
    
          );
          // Check that new tracks displays '+' button
          const addButton = getAllByText('+');
          expect(addButton.length).toBe(3);
    
          const editButton = screen.getByTestId('12345-EditPlaylist');
          fireEvent.click(editButton);
    
          fireEvent.click(addButton[0])
          expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
            id: 'alpha1',
          }))
    
    
          // expect(mockOnAdd).toHaveBeenCalled();
        });
    });

    describe('Testing Spotify API Interaction', () => {
        describe('Testing Track Addition to Newly Created Playlist', () => {
            it('should add tracks to the new created playlist on Spotify', async () => {

                makeSpotifyRequest
                .mockResolvedValueOnce({ id: 'newPlaylistId' })
                .mockResolvedValueOnce({ snapshot_id: 'lexi' });
        
                const { getByTestId } = render(
                <Playlist
                    existingPlaylist={mockExistingPlaylist}
                    setExistingPlaylist={jest.fn()}
                    onNameChange={jest.fn()}
                    onEdit={jest.fn()}
                    onAdd={mockOnAdd}
                    onRemove={mockOnRemove}
                    onSave={jest.fn()}
                    playlistTracks={mockExistingPlaylist[0].tracks}
                    playlistName='Test Playlist'
                />
                );
        
                const saveButton = getByTestId('12345-Transfer');
                fireEvent.click(saveButton);
        
                // Wait for the track addition call
                await waitFor(() => expect(makeSpotifyRequest).toHaveBeenCalledWith(
                'playlists/newPlaylistId/tracks',
                'POST',
                expect.objectContaining({
                    uris: ["spotify:track:1", "spotify:track:2"]
                })
                ));
                
            });
        });
    });
});

