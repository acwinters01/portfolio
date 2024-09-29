import React, { useState } from 'react';
import TrackList from '../Tracklist/Tracklist';

export default function Playlist(props) {
    
    const [savedName, setSavedName] = useState('');
    const [savedTracks, setSavedTracks] = useState([]);
    const [showInput, setShowInput] = useState(false);

    const handlePlaylistNameChange = (event) => {
        props.onNameChange(event.target.value);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        setShowInput((prev) => !prev);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSavedName(playlistName);
        setShowInput(false);
    };

    const addTrackToPlaylist = (selectedTrack) => {
        setSavedTracks((prevTracks) => [...prevTracks, selectedTrack]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button onClick={handleButtonClick}>Create New Playlist</button>

                {showInput && (
                    <div>
                        <label>Name of Playlist:</label>
                        <input
                            type="text"
                            value={playlistName}
                            onChange={handlePlaylistNameChange}
                            placeholder="Type name here"
                        />

                        <button type="submit">✅</button>
                        <button onClick={handleButtonClick}>Cancel</button>
                    </div>
                )}
            </form>

            {savedName && <label>Playlist Name: {savedName}</label>}

            <TrackList tracks={savedTracks} addTrackToPlaylist={addTrackToPlaylist} />

            {savedTracks.length > 0 && (
                <div>
                    <h4>Tracks in Playlist:</h4>
                    {savedTracks.map((track) => (
                        <div key={track.id}>
                            <p>{track.name} by {track.artist} from the album {track.album}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
