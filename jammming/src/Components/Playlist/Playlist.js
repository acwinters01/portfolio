import React, { useCallback } from 'react';
import TrackList from '../Tracklist/Tracklist';

export default function Playlist(props) {

    const handleNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value);
        }, 
        [props.onNameChange]
    );

    return (
        <div>
            <input 
                onChange={handleNameChange} 
                defaultValue={"New Playlist"}/>
            <button onClick={props.onSave}>Save Playlist</button>
            <TrackList
                tracks={props.playlistTracks}
                onAdd={props.onAdd}
            />
            <div>
            {props.existingPlaylist.map((playlist, index) => (
                <div key={index}>
                    <h4>{playlist.playlistName}</h4>
                    <ul>
                        {playlist.tracks.map((track, i) => (
                            <li key={i}>{track.name} by {track.artist}</li>
                        ))}
                    </ul>
                </div>
            ))}
            </div>
        </div>
            
    );
}
