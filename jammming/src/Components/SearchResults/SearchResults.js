import React, { useState }from 'react';
import TrackList from '../Tracklist/Tracklist';
import PagesSetUp from '../Playlist/PagesSetUp';
import { getSearchResponse } from '../SearchBar/SearchBar'


const SearchResults = ({ tracks, onAdd, onRemove, playlistTracks}) => {

    // If there are no search results
    if (!tracks || tracks.length === 0) {
        return;
    }

    return (
        <div className='displaySearchResults'>
            {/* Add pagination controls to Search Results */}
            <TrackList 
                tracks={tracks}
                onAdd={onAdd}
                onRemove={onRemove}
                playlistTracks={playlistTracks}
        
            />
        </div>
    )
}

export default SearchResults;