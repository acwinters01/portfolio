import React, { useCallback } from 'react';

const Track = (props) => {
    console.log('In Track component:', props);
   
    const track = {
        id: props.id,
        name: props.name,
        artist: props.artist,
        album: props.album,
        uri: props.uri,
        imageUri: props.imageUri || props.image || '/music_note_baseImage.jpg'
    };

    const handleTrackAction = useCallback(() => {
        if (props.isSelected(track)) {
            props.onRemove(track);  // Remove the track if it is already selected
        } else {
            props.onAdd(track);     // Add the track if it's not selected
        }
    }, [props, track]);
  
    return (
        <div className='displaytrackContainer'>
            <button onClick={handleTrackAction}>{props.isSelected(props) ? '-' : '+'}</button>
            <div className='trackBlock'>
                <div className='trackImage'>
                    <img src={track.imageUri} alt={`Album art for ${track.name}`}/>
                </div>
                <div className='trackText'>
                    <p><strong>{track.name}</strong></p>
                    <p>{track.artist} | {track.album}</p>
                    <p>{track.id}</p>
                </div>
            </div>
        </div>
    );
}

export default Track;
