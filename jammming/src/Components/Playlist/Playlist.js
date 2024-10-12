import React, { useCallback, useState, useEffect } from 'react';
import TrackList from '../Tracklist/Tracklist';
import CustomPlaylist from './CustomPlaylist';
import { makeSpotifyRequest } from '../Authorization/Requests';
import PagesSetUp from './PagesSetUp';

export default function Playlist(props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracksEdited, setTracksEdited] = useState([]);

    const [playlistPages, setPlaylistPages] = useState(
        props.existingPlaylist.map(() => 0)
    );
    const tracksPerPage = 10; // Number of tracks to display per page

    // Ensure playlistPages has the correct length when existingPlaylist changes
    useEffect(() => {
        setPlaylistPages(Array(props.existingPlaylist.length).fill(0));
    }, [props.existingPlaylist]);

    const handleNewPlaylistNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value, null);
        }, 
        [props.onNameChange]
    );

    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(props.existingPlaylist[index].tracks);
    };    

    const handlePlaylistTracks = async (index) => {
        let tracksToAdd = [];
        props.existingPlaylist[index].tracks.forEach((track) => {
            if (track.uri) {
                console.log(`Track URI for ${track.name}: ${track.uri}`);
                tracksToAdd.push(track.uri);
            } else {
                console.warn(`Track URI missing for ${track.name}`);
            }
        });
        console.log(`Tracks being added: ${tracksToAdd}`);
        return tracksToAdd;
    };

    const transferToSpotify = async (index) => {
        try {
            const tracksToAdd = await handlePlaylistTracks(index);
            const createPlaylistPayload = {
                name: props.existingPlaylist[index].playlistName,
                description: 'New playlist created from Jammming app',
                public: true
            };
            const createPlaylistResponse = await makeSpotifyRequest(`me/playlists`, 'POST', createPlaylistPayload);
            const playlistId = createPlaylistResponse.id;
            const addTracksPayload = { uris: tracksToAdd };
            await makeSpotifyRequest(`playlists/${playlistId}/tracks`, 'POST', addTracksPayload);
        } catch (error) {
            console.error('Error transferring playlist to Spotify:', error);
        }
    };

    // Calculate the total pages and control pagination for each playlist
    const goToNextPage = (playlistIndex) => {
        const totalTracks = props.existingPlaylist[playlistIndex]?.tracks.length || 0;
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
        <div className='playlistReturn'>
            <input 
                onChange={handleNewPlaylistNameChange} 
                value={props.playlistName}
                placeholder="New Playlist"
            />

            <button onClick={props.onSave}>Save</button>

            <TrackList
                tracks={props.playlistTracks}
                onAdd={props.onAdd} 
                onRemove={props.onRemove}
                playlistTracks={props.playlistTracks}
            />

            <div className='displayPlaylistInfo'>
                {props.existingPlaylist.map((playlist, playlistIndex) => {
                    const totalTracks = playlist.tracks.length;
                    const totalPages = totalTracks > 0 ? Math.ceil(totalTracks / tracksPerPage) : 1;

                    const startIndex = playlistPages[playlistIndex] * tracksPerPage;
                    const currentTracks = playlist.tracks.slice(startIndex, startIndex + tracksPerPage);

                    return (
                        <div key={playlistIndex}>
                            <div>
                                <h4>{playlist.playlistName}</h4>
                                <button onClick={() => handleEditTracks(playlistIndex)}>Edit</button>
                            </div>

                            <ul>
                                {currentTracks.map((track, i) => (
                                    <li key={i}>{track.name} by {track.artist}</li>
                                ))}
                            </ul>

                            {/* Pass necessary data to PagesSetUp */}
                            <PagesSetUp
                                playlistIndex={playlistIndex}
                                playlistPages={playlistPages}
                                totalPages={totalPages}
                                goToNextPage={goToNextPage}
                                goToPreviousPage={goToPreviousPage}
                            />

                            <button onClick={() => transferToSpotify(playlistIndex)}>Save On Spotify</button>
                        </div>
                    );
                })}
            </div>

            {selectedPlaylist !== null && (
                <div className='customPlaylistContainer'>
                    <CustomPlaylist 
                        selectedPlaylist={selectedPlaylist}
                        setSelectedPlaylist={setSelectedPlaylist}
                        tracks={props.existingPlaylist[selectedPlaylist]?.tracks}
                        onNameChange={props.onNameChange}
                        existingPlaylist={props.existingPlaylist}
                        tracksEdited={tracksEdited}
                        setTracksEdited={setTracksEdited}
                        onEdit={props.onEdit}
                    />
                </div>
            )}
        </div>
    );
}
