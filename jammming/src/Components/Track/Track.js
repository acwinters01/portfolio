import React, { useCallback } from 'react';

const Track = (props) => {

    const handleTrackAction = useCallback(
        () => {
            const track = {
                id: props.id,
                name: props.name,
                artist: props.artist,
                album: props.album,
            };

            if(props.isSelected(track)) {
                props.onRemove(track);
                
            } else {
                props.onAdd(track);
            }
        }, 
        [props]
    );
  
    return (
        <div>
            <button onClick={handleTrackAction}>{props.isSelected(props) ? '-' : '+'}</button>
            <div>
                <p><strong>{props.name}</strong></p>
                <p>{props.artist}</p>
                <p>{props.album} | {props.id}</p>
            </div>
        </div>
    );
}

export default Track;
