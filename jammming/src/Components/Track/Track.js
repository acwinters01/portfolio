import React, { useCallback, useMemo } from 'react';


const Track = ({uniqueKey, id, name, artist, album, uri, imageUri, image, isSelected, onRemove, onAdd}) => {

    const track = useMemo (() => ({
        uniqueKey,
        id,
        name,
        artist,
        album,
        uri,
        imageUri: imageUri || image || '/music_note_baseImage.jpg'
    }), [uniqueKey, id, name, artist, album, uri, imageUri, image])

    // Handles Track selection
    const handleTrackAction = useCallback(() => {
        if (isSelected(track)) {
            onRemove(track);  // Remove the track if it is already selected
        } else {
            onAdd(track);     // Add the track if it's not selected
        }
    }, [isSelected, onAdd, onRemove, track]);
  
    return (
        <div className='displaytrackContainer'>
            <div className='trackBlock'>
                <div className='trackImage'>
                    <img src={track.imageUri} alt={`Album art for ${track.name}`}/>
                </div>
                <div className='trackText' id={track.id}>
                    <h4>{track.name}</h4>
                    <p id="artist">{track.artist}</p> 
                    <p id="album">{track.album}</p>
                </div>
                <button id='trackButton' data-testid={`track-${track.id}`} onClick={handleTrackAction}>{isSelected(track) ? '-' : '+'}</button>
            </div>
        </div>
    );
};

export default Track;
