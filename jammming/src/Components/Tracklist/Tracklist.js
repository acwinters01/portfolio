import React from 'react';
import Track from '../Track/Track';

const TrackList = (props) => {
    // Ensure tracks array is not undefined or null
    if (!props.tracks || props.tracks.length === 0) {
        return <div>No tracks found</div>;
    }

    const isSelected = (track) => {
        return props.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    }

    return (
        <div>
            {props.tracks.map((track) => (
            <Track
                key={track.id}
                id={track.id}  // Pass id as a normal prop
                name={track.name}
                artist={track.artist}
                album={track.album}
                onAdd={props.onAdd}
                onRemove={props.onRemove}
                isSelected={isSelected}
            />
            ))}
        </div>
    );
};

export default TrackList;
