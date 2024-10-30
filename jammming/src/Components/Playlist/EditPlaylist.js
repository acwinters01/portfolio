    import React, { useState, useEffect, useCallback } from 'react';
    import TrackList from '../Tracklist/Tracklist'
    import PagesSetUp from './PagesSetUp';
    import SearchBar from '../SearchBar/SearchBar';
    import SearchResults from '../SearchResults/SearchResults';
    import DuplicateTrackModal from '../Track/DuplicateTrackModal';
    


    function EditingPlaylist(props) {

        const selectedPlaylistObj = props.existingPlaylist[props.selectedPlaylist];
        const [isEditingName, setIsEditingName] = useState(false);
        const [ duplicateTrack, setDuplicateTrack ] = useState(null);
        const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);
        const [playlistName, setPlaylistName] = useState(selectedPlaylistObj ? selectedPlaylistObj.playlistName : '');
        const [searchResults, setSearchResults] = useState([]); // New state for search results
        const [trackCurrentPage, setTrackCurrentPage] = useState(0);
        const tracksPerTrackPage = 5; // Adjust as needed for display


        // Effect to update playlistName when selectedPlaylistObj changes
        useEffect(() => {
            if (selectedPlaylistObj) {
                setPlaylistName(selectedPlaylistObj.playlistName);
                props.setTracksEdited(selectedPlaylistObj.tracks);
            }
        }, [selectedPlaylistObj, props.setTracksEdited]);

        // Saves a playlist that has been edited
        const handleSavingEditedPlaylist = () => {
            if (props.selectedPlaylist !== null) {
                props.onEdit(props.selectedPlaylist, props.tracksEdited);
                props.onNameChange(playlistName, props.selectedPlaylist)
                props.handleExitEditMode();
            }
        }

        const handleConfirmAdd = (track) => {
            props.setTracksEdited((prevTracks) => [...prevTracks, track]);
            setIsDuplicateModalVisible(false);
            setDuplicateTrack(null);
          }
        
          const handleCancelAdd = () => {
            setIsDuplicateModalVisible(false);
            setDuplicateTrack(null); // Hide modal without adding
          };

        // Enables user to click on Playlist title to edit the name
        const handleNameSave = () => {
            setIsEditingName(false);
        } 

        // Gets search results from searchbar.js
        const handleSearchResults = useCallback((results) => {
            setSearchResults(results || []);
        }, []);

        const addTracksEditingPlaylist = useCallback(
            (track) => {
                if (props.tracksEdited.some((savedTrack) => savedTrack.id === track.id)) {
                    setDuplicateTrack(track);
                    setIsDuplicateModalVisible(true);
                    return;
                }
                 props.setTracksEdited((prevTracks) => [...prevTracks, track]);
            },
            [props.tracksEdited]
        )
        
          // Slice the tracks based on pagination
        const startIndex = trackCurrentPage * tracksPerTrackPage;
        const currentTracks = props.tracksEdited.slice(startIndex, startIndex + tracksPerTrackPage);

        return (
            <div className='displayEditingPlaylist'>
                {/* Creates a Div for Editing Playlists */}
                <div className='editingSection'>
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
                                <h3 onClick={() => setIsEditingName(true)}>{`Editing: ${playlistName}`}</h3>
                            )}

                            <div className='editingButtons'>
                                <button onClick={handleSavingEditedPlaylist}>Save</button>
                                <button onClick={props.handleExitEditMode}>Cancel</button>
                            </div>
                            {/* TrackList for the current playlist */}
                            <TrackList
                                key={props.selectedPlaylist}
                                tracks={currentTracks}
                                onAdd={(track) => props.setTracksEdited((prev) => [...prev, track])}
                                onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                                playlistTracks={props.tracksEdited}
                            />
               
                            <DuplicateTrackModal
                                track={duplicateTrack}
                                onConfirm={handleConfirmAdd}
                                onCancel={handleCancelAdd}
                            />

                        </div>
                    )}
                </div>
        
                {/* Search Bar to add new tracks */}
                <div className='editingSearch'>
                    <div className="searchForNewTracks">
                        <h3>Search</h3>
                        <SearchBar onSearchResults={handleSearchResults} />
        
                        {/* Display search results in a TrackList */}
                        <SearchResults
                            tracks={searchResults}
                            onAdd={addTracksEditingPlaylist}
                            onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.id !== track.id))}
                            tracksEdited={props.tracksEdited}
                            selectedPlaylist={props.selectedPlaylist}
                        />
                    </div>
                    
                </div>
            </div>
        );
        
        
    }
    
    export default EditingPlaylist;