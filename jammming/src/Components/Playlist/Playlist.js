import React, { useCallback, useState } from 'react';
import TrackList from '../Tracklist/Tracklist';
import EditingPlaylist from './EditPlaylist';
import { makeSpotifyRequest } from '../Authorization/Requests';
import PagesSetUp from './PagesSetUp';

export default function Playlist({existingPlaylist, setExistingPlaylist, onNameChange, onEdit, onAdd, 
                                onRemove, onSave, playlistTracks, playlistName, searchResults, 
                                setTransferLoading, transferLoading}) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [ currentPlaylistPage, setCurrentPlaylistPage ] = useState(0);
    const [tracksEdited, setTracksEdited] = useState([]);
    const playlistPerPage = 5;
    const startIndex = currentPlaylistPage * playlistPerPage;
    const currentPlaylists = existingPlaylist.slice(startIndex, startIndex + playlistPerPage);
    
    
    // Playlist Name Change
    const handleNewPlaylistNameChange = useCallback(
        (event) => {
            onNameChange(event.target.value, null);
        }, 
        [onNameChange]
    );

    // Edit Tracks in selected playlist
    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(existingPlaylist[index].tracks);
    };  
    
    // Reset editing mode on save or cancel
    const handleExitEditMode = () => {
        setSelectedPlaylist(null);
        setTracksEdited([]);
    };

    // Add tracks to existing playlist
    const handlePlaylistTracks = async (index) => {
        let tracksToAdd = [];

        existingPlaylist[index].tracks.forEach((track) => {

            if (track.uri) {
                tracksToAdd.push(track.uri);
            } else {
                console.warn(`Track URI missing for ${track.name}`);
            }
        });
        return tracksToAdd;
    };

    // Remove Playlist from the App
    const handlePlaylistRemove = (playlist_id) => {

        try {
            setExistingPlaylist((prev) => {
                prev.filter((playlistToRemove) => playlistToRemove.playlistId !== playlist_id)
            })
        } catch (error) {
            console.log(error)
        }
    };


    // Calculate the total pages and control pagination for each playlist
    const goToNextPlaylistPage = () => {
        if ((currentPlaylistPage + 1) * playlistPerPage < existingPlaylist.length) {
            setCurrentPlaylistPage(prev => prev + 1);
        }  
    };

    const goToPreviousPlaylistPage = () => {
        if (currentPlaylistPage > 0) {
            setCurrentPlaylistPage(prev => prev - 1);
        }
    };

     // Transfers Custom playlist made in app to Spotify
     const transferToSpotify = async (index) => {
        setTransferLoading(true);
        try {
            const tracksToAdd = await handlePlaylistTracks(index);
            const createPlaylistPayload = {
                name: existingPlaylist[index].playlistName,
                description: 'New playlist created from Jammming app',
                public: true
            };

            const createPlaylistResponse = await makeSpotifyRequest(`me/playlists`, 'POST', createPlaylistPayload);
            const playlistId = createPlaylistResponse.id;

            setExistingPlaylist((prevPlaylists) => {
                const updatedPlaylists = [...prevPlaylists];
                updatedPlaylists[index].playlistId = playlistId;  // Replace local ID with Spotify ID
                return updatedPlaylists;
            });


            try {
                const addTracksPayload = { uris: tracksToAdd };
                await makeSpotifyRequest(`playlists/${playlistId}/tracks`, 'POST', addTracksPayload);
            } catch (error) {
                console.error('Error adding tracks to the playlist:', error);
            }

        } catch (error) {
            console.error('Error transferring playlist to Spotify:', error);
        } finally {
            setTransferLoading(false);
        }
    };

   
    return (
        <div className='displayPlaylistsContainer'>
            <div className='playlistNameInput'>
                <input 
                    onChange={handleNewPlaylistNameChange} 
                    value={playlistName}
                    placeholder="New Playlist"
                />
            
                <button onClick={onSave}>Save</button>
            </div>

            <TrackList
                keyPrefix='playlist-'
                tracks={playlistTracks}
                onAdd={onAdd} 
                onRemove={onRemove}
                playlistTracks={playlistTracks}
            />

            <div className='allPlaylists'>
                {/*  Checks if playlist is an array and if there are any playlists to filter through and display */}
                {Array.isArray(currentPlaylists) && currentPlaylists.length > 0 ? (
                    currentPlaylists.map((playlist, index) => {
                        const playlistKey = playlist.playlistId;
                        return (
                            <div className={`Playlist`} id={`playlist-${playlistKey}`} key={playlistKey}>
                                <div className='playlistSectionOne'>
                                    <div className='playlistImage'>
                                        <img 
                                            src={playlist.tracks[0].imageUri || '/music_note_baseImage.jpg'}
                                            alt="Track artwork"
                                        />
                                        <button id='transferToSpotify' data-testid={`${playlist.playlistId}-Transfer`} onClick={() => transferToSpotify(index + startIndex)}>Save On Spotify</button>

                                    </div>
                                    <div className='playlistText'>
                                        
                                        <div className='playlistTitleInfo'>
                                            <h4>{playlist.playlistName}</h4>
                                            <p>Tracks: {playlist.tracks.length}</p>
                                        </div>
                                        <div className='playlistButtons'>
                                            <button 
                                                data-testid={`${playlist.playlistId}-Remove`} 
                                                onClick={() => handlePlaylistRemove(playlist.playlistId)}>
                                                    Remove
                                            </button>

                                            <button 
                                                data-testid={`${playlist.playlistId}-EditPlaylist`} 
                                                onClick={() => handleEditTracks(index + startIndex)}>
                                                    Edit
                                            </button>
                                        </div>
                                    

                                    </div>
                                </div>

                            </div>
                        
                        )
                    })
                ) : (
                    <div className='playlistsNotFound'>
                        <p>No playlists available</p>
                    </div>
                )}
                <div className='pagination'>
                    {/* Playlist Pagination */}
                    <PagesSetUp
                        currentPage={currentPlaylistPage}
                        setCurrentPage={setCurrentPlaylistPage}
                        totalPages={Math.ceil(existingPlaylist.length / playlistPerPage)}
                        goToNextPage={goToNextPlaylistPage}
                        goToPreviousPage={goToPreviousPlaylistPage}
                    />
                </div>
                {/* Editing Selected Playlist */}
                {selectedPlaylist !== null && (
                    <div className='editPlaylistContainer'>
                        <EditingPlaylist 
                            selectedPlaylist={selectedPlaylist}
                            setSelectedPlaylist={setSelectedPlaylist}
                            tracks={existingPlaylist[selectedPlaylist]?.tracks}
                            searchResults={searchResults}
                            onNameChange={onNameChange}
                            existingPlaylist={existingPlaylist}
                            tracksEdited={tracksEdited}
                            setTracksEdited={setTracksEdited}
                            onEdit={onEdit}
                            handleExitEditMode={handleExitEditMode} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}