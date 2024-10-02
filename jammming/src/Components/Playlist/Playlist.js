import React, { useCallback, useState } from 'react';
import TrackList from '../Tracklist/Tracklist';
import CustomPlaylist from './CustomPlaylist';

export default function Playlist(props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracksEdited, setTracksEdited] = useState([]);

    const handleNewPlaylistNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value, null);
        }, 
        [props.onNameChange]
    );

    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(props.existingPlaylist[index].tracks);
    }

    return (
        <div>
            <input 
                onChange={handleNewPlaylistNameChange} 
                value={props.playlistName}
                placeholder="New Playlist"/>

            <button onClick={props.onSave}>Save Playlist</button>

            <TrackList
                tracks={props.playlistTracks}
                onAdd={props.onAdd} 
                onRemove={props.onRemove}
                playlistTracks={props.playlistTracks}
            />
            <div>
                {props.existingPlaylist.map((playlist, index) => (
                    <div key={index}>
                        <div>
                            <h4>{playlist.playlistName}</h4>
                            <button onClick={() => handleEditTracks(index)}>Edit</button>
                        </div>
                        <ul>
                            {playlist.tracks.map((track, i) => (
                                <li key={i}>{track.name} by {track.artist} | ID: {track.id}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <CustomPlaylist 
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
                tracks={props.tracks}
                onNameChange = {props.onNameChange}
                existingPlaylist={props.existingPlaylist}
                tracksEdited={tracksEdited}
                setTracksEdited={setTracksEdited}
                onEdit={props.onEdit}
                />
        </div>
            
    );
}
