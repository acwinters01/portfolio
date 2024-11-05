import React from 'react';
import TrackList from '../Tracklist/Tracklist';



const SearchResults = ({ tracks, onAdd, onRemove, playlistTracks}) => {

    // If there are no search results
    if (!tracks || tracks.length === 0) {
        return;
    }

    return (
        <div className='displaySearchResults'>
            {/* Add pagination controls to Search Results */}
            <TrackList 
                keyPrefix='search-'
                tracks={tracks}
                onAdd={onAdd}
                onRemove={onRemove}
                playlistTracks={playlistTracks}
            />
        </div>
    )
}

export default SearchResults;