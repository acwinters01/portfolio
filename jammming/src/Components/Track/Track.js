import React, { useCallback } from 'react';

const Track = (props) => {

    const addTrack = useCallback(
        () => {
            const track = {
                id: props.id,
                name: props.name,
                artist: props.artist,
                album: props.album,
            }
            props.onAdd(track);
        }, 
        [props]
    );
  
    return (
        <div>
            <button onClick={addTrack}>+</button>
            <div>
                <p><strong>{props.name}</strong></p>
                <p>{props.artist}</p>
                <p>{props.album}</p>
            </div>
        </div>
    );
}

export default Track;
