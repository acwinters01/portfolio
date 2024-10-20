    import React, { useState, useEffect, useCallback } from 'react';
    import TrackList from '../Tracklist/Tracklist'
    import PagesSetUp from './PagesSetUp';
    import SearchBar from '../SearchBar/SearchBar';
    


    function EditingPlaylist(props) {

        const selectedPlaylistObj = props.existingPlaylist[props.selectedPlaylist];
        const [isEditingName, setIsEditingName] = useState(false);
        const [playlistName, setPlaylistName] = useState(selectedPlaylistObj ? selectedPlaylistObj.playlistName : '');
        const [searchResults, setSearchResults] = useState([]); // New state for search results

        // Effect to update playlistName when selectedPlaylistObj changes
        useEffect(() => {
            if (selectedPlaylistObj) {
                setPlaylistName(selectedPlaylistObj.playlistName);
            }
        }, [selectedPlaylistObj]);

        // Saves a playlist that has been edited
        const handleSavingEditedPlaylist = () => {
            if (props.selectedPlaylist !== null) {
                props.onEdit(props.selectedPlaylist, props.tracksEdited);
                props.onNameChange(playlistName, props.selectedPlaylist)
                props.setSelectedPlaylist(null);
                props.setTracksEdited([])
            }
        }

        // Enables user to click on Playlist title to edit the name
        const handleNameSave = () => {
            setIsEditingName(false);
        } 

        // Gets search results from searchbar.js
        const handleSearchResults = useCallback((results) => {
            setSearchResults(results || []);
        }, []);
        
          // Slice the tracks based on pagination
        const startIndex = props.trackCurrentPage * props.tracksPerTrackPage;
        const currentTracks = props.tracks.slice(startIndex, startIndex + props.tracksPerTrackPage);

        return (
            <div className='displayEditingPlaylist'>
                {/* Creates a Div for Editing Playlists */}
                {props.selectedPlaylist !== null && (
                    <div className={`EditingPlaylist`} id={`EditingPlaylist-${selectedPlaylistObj.playlistId}`}>
                        {isEditingName ? (
                            <input
                                type="text"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                onBlur={handleNameSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                autoFocus
                            />
                        ) : (
                            <h4 onClick={() => setIsEditingName(true)}>{playlistName}</h4>
                        )}
    
                        {/* TrackList for the current playlist */}
                        <TrackList
                            key={props.selectedPlaylist}
                            tracks={currentTracks}
                            onAdd={(track) => props.setTracksEdited((prev) => [...prev, track])}
                            onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                            playlistTracks={props.tracksEdited}
                        />
    
                        {/* Search Bar to add new tracks */}
                        <div className="searchForNewTracks">
                            <h4>Search for New Tracks to Add</h4>
                            <SearchBar onSearchResults={handleSearchResults} />
                            
                            {/* Display search results in a TrackList */}
                            <TrackList
                                tracks={searchResults}
                                onAdd={(track) => props.setTracksEdited((prev) => [...prev, track])}
                                onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                                playlistTracks={props.tracksEdited}
                            />
                        </div>
    
                        {/* Pagination for editing tracks */}
                        <PagesSetUp
                            currentPage={props.trackCurrentPage}
                            totalPages={Math.ceil(props.tracks.length / props.tracksPerTrackPage)}
                            goToNextPage={props.goToNextTrackPage}
                            goToPreviousPage={props.goToPreviousTrackPage}
                        />
    
                        <button onClick={handleSavingEditedPlaylist}>Save</button>
                    </div>
                )}
            </div>
        );
    }
    
    export default EditingPlaylist;