import React, { useCallback, useState } from 'react';
import TrackList from '../Tracklist/Tracklist';

export default function Playlist(props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracksEdited, setTracksEdited] = useState([]);
    let playlistID = props.existingPlaylist.indexOf(selectedPlaylist);

    const handleNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value);
        }, 
        [props.onNameChange]
    );

    const handleNameEdit = useCallback(
        (index) => {
            
        }, 
        [props.onNameChange]
    );

    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(props.existingPlaylist[index].tracks);
    }

    const handleSavingEditedPlaylist = () => {
        if (selectedPlaylist !== null) {
            props.onEdit(selectedPlaylist, tracksEdited);
            setSelectedPlaylist(null);
            setTracksEdited([])
        }
    }

    return (
        <div>
            <input 
                onChange={handleNameChange} 
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

            {selectedPlaylist !== null && (
                <div>
                    <h4 onClick={handleNameChange}>{props.existingPlaylist[selectedPlaylist].playlistName}</h4>
                    <TrackList
                        key={selectedPlaylist}
                        tracks={props.tracks}
                        onAdd={(track) => setTracksEdited((prev) => [...prev, track])} 
                        onRemove={(track) => setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                        playlistTracks={tracksEdited}
                    />
                    <button onClick={handleSavingEditedPlaylist}>Save</button>
                </div>
            )}
        </div>
            
    );
}
