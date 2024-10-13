import React, { useCallback, useMemo } from 'react';

const Track = ({id, name, artist, album, uri, imageUri, image, isSelected, onRemove, onAdd}) => {

    const track = useMemo (() => ({
        id,
        name,
        artist,
        album,
        uri,
        imageUri: imageUri || image || '/music_note_baseImage.jpg'
    }), [id, name, artist, album, uri, imageUri, image])

    const handleTrackAction = useCallback(() => {
        if (isSelected(track)) {
            onRemove(track);  // Remove the track if it is already selected
        } else {
            onAdd(track);     // Add the track if it's not selected
        }
    }, [isSelected, onAdd, onRemove, track]);
  
    return (
        <div className='displaytrackContainer'>
            <button onClick={handleTrackAction}>{isSelected(track) ? '-' : '+'}</button>
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
