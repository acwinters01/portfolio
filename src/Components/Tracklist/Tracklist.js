import React from 'react';
import Track from '../Track/Track';


const Tracklist = ({tracks}) => {
    return (
        <div>
            <h2>Tracklist</h2>
            {tracks.map(track => (
                <Track
                   key= {track.id}
                   name= {track.name}
                   artist= {track.artist}
                   album= {track.album}
                />
            ))}
        </div>
    )
}




export default Tracklist;