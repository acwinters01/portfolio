import React, { useEffect } from 'react';

export default function Track({props}) {

    const addTrack = useEffect((event) => {
        props.onAdd(props.track)
    }, 
    [props.onAdd, props.track]
    );
  
    return (
        <div>
            <button onClick={props.addTrack}>+</button>
            <div>
                <p><strong>{props.name}</strong></p>
                <p>{props.artist}</p>
                <p>{props.album}</p>
            </div>
        </div>
    );
}
