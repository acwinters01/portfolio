import React, { useCallback, useState, useEffect } from 'react';
import TrackList from '../Tracklist/Tracklist';
import EditingPlaylist from './EditPlaylist';
import { makeSpotifyRequest } from '../Authorization/Requests';
import PagesSetUp from './PagesSetUp';

export default function Playlist({existingPlaylist, setExistingPlaylist, onNameChange, onEdit, onAdd, onRemove, onSave, playlistTracks, playlistName, }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracksEdited, setTracksEdited] = useState([]);
    const [playlistPages, setPlaylistPages] = useState(
        Array.isArray(existingPlaylist) && existingPlaylist.length > 0 
        ? existingPlaylist.map(() => 0) 
        : [] 
    );
    const tracksPerPage = 10; // Number of tracks to display per page
    const [trackCurrentPage, setTrackCurrentPage] = useState(0);
    const tracksPerTrackPage = 5; // Number of tracks to display per page in edit mode

    // Ensure playlistPages has the correct length when existingPlaylist changes
    useEffect(() => {
        if (Array.isArray(existingPlaylist) && existingPlaylist.length > 0) {
            setPlaylistPages(Array(existingPlaylist.length).fill(0));
        } else {
            setPlaylistPages([]); // Handle the case where there are no playlists by setting an empty array
        }
    }, [existingPlaylist]);

    const handleNewPlaylistNameChange = useCallback(
        (event) => {
            onNameChange(event.target.value, null);
        }, 
        [onNameChange]
    );

    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(existingPlaylist[index].tracks);
        setTrackCurrentPage(0); // Reset track pagination when a new playlist is selected
    };    

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

    const handlePlaylistRemove = (playlist_id) => {

        try {
            setExistingPlaylist((prev) => {
                prev.filter((playlistToRemove) => playlistToRemove.playlistId !== playlist_id)
            })
        } catch (error) {
            console.log(error)
        }
    };

    const transferToSpotify = async (index) => {
        try {
            const tracksToAdd = await handlePlaylistTracks(index);
            const createPlaylistPayload = {
                name: existingPlaylist[index].playlistName,
                description: 'New playlist created from Jammming app',
                public: true
            };

            const createPlaylistResponse = await makeSpotifyRequest(`me/playlists`, 'POST', createPlaylistPayload);
            const playlistId = createPlaylistResponse.id;

            try {
                const addTracksPayload = { uris: tracksToAdd };
                await makeSpotifyRequest(`playlists/${playlistId}/tracks`, 'POST', addTracksPayload);
            } catch (error) {
                console.error('Error adding tracks to the playlist:', error);
            }

        } catch (error) {
            console.error('Error transferring playlist to Spotify:', error);
        }
    };


    // Pagination for track list inside selected playlist
    const goToNextTrackPage = () => {
        const totalTracks = existingPlaylist[selectedPlaylist]?.tracks.length || 0;
        const totalPages = Math.ceil(totalTracks / tracksPerTrackPage);
        if (trackCurrentPage < totalPages - 1) {
            setTrackCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousTrackPage = () => {
        if (trackCurrentPage > 0) {
            setTrackCurrentPage((prevPage) => prevPage - 1);
        }
    }


    // Calculate the total pages and control pagination for each playlist
    const goToNextPage = (playlistIndex) => {
        const totalTracks = existingPlaylist[playlistIndex]?.tracks.length || 0;
        const totalPages = Math.ceil(totalTracks / tracksPerPage);

        if (playlistPages[playlistIndex] < totalPages - 1) {
            setPlaylistPages((prevPages) =>
                prevPages.map((page, idx) => (idx === playlistIndex ? page + 1 : page))
            );
        }
    };

    const goToPreviousPage = (playlistIndex) => {
        if (playlistPages[playlistIndex] > 0) {
            setPlaylistPages((prevPages) =>
                prevPages.map((page, idx) => (idx === playlistIndex ? page - 1 : page))
            );
        }
    };


    return (
        <div className='displayPlaylistsContainer'>
            <input 
                onChange={handleNewPlaylistNameChange} 
                value={playlistName}
                placeholder="New Playlist"
            />

            <button onClick={onSave}>Save</button>

            <TrackList
                tracks={playlistTracks}
                onAdd={onAdd} 
                onRemove={onRemove}
                playlistTracks={playlistTracks}
            />

            <div className='playlists'>
                {Array.isArray(existingPlaylist) && existingPlaylist.length > 0 ? (
                    existingPlaylist.filter((_, playlistIndex) => selectedPlaylist !== playlistIndex).map((playlist, playlistIndex) => {

                        const totalTracks = playlist.tracks?.length || 0; // Safeguard against undefined playlist.tracks
                        const totalPages = totalTracks > 0 ? Math.ceil(totalTracks / tracksPerPage) : 1;
                        const startIndex = playlistPages[playlistIndex] * tracksPerPage;
                        const currentTracks = playlist?.tracks?.slice(startIndex, startIndex + tracksPerPage) || []; // Safeguard

                        return (
                            <div className={`Playlist-${playlist.playlistId}`} key={playlist.playlistId}>
                                <div className='playlistTitleInfo'>
                                    <h4>{playlist.playlistName}</h4>
                                    <button data-testid={`${playlist.playlistId}-Remove`} onClick={() => handlePlaylistRemove(playlist.playlistId)}>-</button>
                                    <p>Tracks: {totalTracks}</p>
                                    <button data-testid={`${playlist.playlistId}-EditPlaylist`} onClick={() => handleEditTracks(playlistIndex)}>{selectedPlaylist === playlistIndex ? 'Editing': 'Edit'}</button>
                                </div>

                                <div className='playlistTracksContainer'>
                                    {currentTracks.map((track) => (
                                        <div className='playlistTrack' key={track.id}>
                                            <img src={track.image || track.imageUri || '/music_note_baseImage.jpg'} alt="Track artwork"/>
                                            <p>{track.name} by {track.artist}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Playlist Pagination */}
                                <PagesSetUp
                                    currentPage={playlistPages[playlistIndex]}
                                    totalPages={totalPages}
                                    goToNextPage={() => goToNextPage(playlistIndex)}
                                    goToPreviousPage={() => goToPreviousPage(playlistIndex)}
                                />
                                <button data-testid={`${playlist.playlistId}-Transfer`} onClick={() => transferToSpotify(playlistIndex)}>Save On Spotify</button>
                            </div>
                        );
                    })
                ) : (
                    <div className='playlistsNotFound'>
                        <p>No playlists available</p>
                    </div>
                )}

                {/* Editing Selected Playlist */}
                {selectedPlaylist !== null && (
                    <div className='editPlaylistContainer'>
                        <EditingPlaylist 
                            selectedPlaylist={selectedPlaylist}
                            setSelectedPlaylist={setSelectedPlaylist}
                            tracks={existingPlaylist[selectedPlaylist]?.tracks}
                            onNameChange={onNameChange}
                            existingPlaylist={existingPlaylist}
                            tracksEdited={tracksEdited}
                            setTracksEdited={setTracksEdited}
                            onEdit={onEdit}
                            trackCurrentPage={trackCurrentPage}
                            tracksPerTrackPage={tracksPerTrackPage}
                            goToNextTrackPage={goToNextTrackPage}
                            goToPreviousTrackPage={goToPreviousTrackPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}