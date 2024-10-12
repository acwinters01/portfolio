import React from 'react';
import Track from '../Track/Track';

const TrackList = (props) => {
    console.log('in tracklist')
    console.log('Props:', props); 
    // Ensure tracks array is not undefined or null

    const tracks = props.tracks; // Ensures it's an array

    if (!props.tracks || props.tracks.length === 0) {
        return <div>No tracks found</div>;
    }

    const isSelected = (track) => {
        return props.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    }
    console.log(`List of tracks: ${props.tracks}`)

    return (
        <div>
            {tracks.length === 0 ? (
                <div>No tracks found</div>
            ) : (
                tracks.map((track) => (
                    <Track
                        key={track.id}
                        id={track.id}  // Pass id as a normal prop
                        name={track.name}
                        artist={track.album?.artists ? track.album.artists.map(artist => artist.name).join(', ') : track.artist}
                        album={track.album.name || track.album}
                        imageUri={track.album?.images?.[2]?.url || track.imageUri}
                        uri={track.uri}
                        onAdd={props.onAdd}
                        onRemove={props.onRemove}
                        isSelected={isSelected}
                    />
                ))
            )}
        </div>
    );
};

export default TrackList;
