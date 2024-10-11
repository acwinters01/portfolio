    import React, { useState, useEffect } from 'react';
    import TrackList from '../Tracklist/Tracklist'

    function CustomPlaylist(props) {

        const selectedPlaylistObj = props.existingPlaylist[props.selectedPlaylist];
        const [isEditingName, setIsEditingName] = useState(false);
        const [playlistName, setPlaylistName] = useState(selectedPlaylistObj ? selectedPlaylistObj.playlistName : '')

          // Effect to update playlistName when selectedPlaylistObj changes
        useEffect(() => {
            if (selectedPlaylistObj) {
                setPlaylistName(selectedPlaylistObj.playlistName);
            }
        }, [selectedPlaylistObj]);

        const handleSavingEditedPlaylist = () => {
            if (props.selectedPlaylist !== null) {
                props.onEdit(props.selectedPlaylist, props.tracksEdited);
                props.onNameChange(playlistName, props.selectedPlaylist)
                props.setSelectedPlaylist(null);
                props.setTracksEdited([])
            }
        }

        const handleNameSave = () => {
            setIsEditingName(false);
        }

       

        return (
            <div>
                {/* Creates a Div for Editing Custom Playlists*/}
                {props.selectedPlaylist !== null && (
                    <div>
                        {isEditingName ? (
                            <input
                                type="text"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                onBlur={handleNameSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                autoFocus
                            />
                        ) : (
                            <h4 onClick={() => setIsEditingName(true)}>{playlistName}</h4>
                        )}
                        <TrackList
                            key={props.selectedPlaylist}
                            tracks={props.tracks}
                            onAdd={(track) => props.setTracksEdited((prev) => [...prev, track])} 
                            onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                            playlistTracks={props.tracksEdited}
                        />
                        <button onClick={handleSavingEditedPlaylist}>Save</button>
                        
                    </div>
                )}
            </div>
        );
    }

    export default CustomPlaylist;