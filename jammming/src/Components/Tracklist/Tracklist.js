import React from 'react';
import Track from '../Track/Track';

const TrackList = (props) => {
    return (
        <div>
            <h2>Tracklist</h2>
            {props.tracks.map(track => (
                <Track
                   key={track.id}  // Pass id as a normal prop
                   track={track.name}
                />
            ))}
        </div>
    );
};

export default TrackList;
