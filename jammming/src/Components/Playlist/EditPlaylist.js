    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import TrackList from '../Tracklist/Tracklist'
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
        const [trackDuplicationCounts, setTrackDuplicationCounts] = useState({});
        const editingSearchRef = useRef(null);
        const editingSectionRef = useRef(null);


        const adjustMargin = useCallback(() => {
            if (editingSearchRef.current && editingSectionRef.current) {
                const height = editingSearchRef.current.offsetHeight;
                console.log("Height of .editingSearch:", height); // Debugging
    
                if (height > 200) {
                    editingSectionRef.current.classList.add('large-height');
                } else {
                    editingSectionRef.current.classList.remove('large-height');
                }
            }
        }, []);

        // Initialize margin check and MutationObserver
        useEffect(() => {
            // Initial check on load
            adjustMargin();

            // Listen for window resize to re-check height
            window.addEventListener('resize', adjustMargin);

            // Set up MutationObserver to detect content changes affecting height
            const observer = new MutationObserver(adjustMargin);
            if (editingSearchRef.current) {
                observer.observe(editingSearchRef.current, { childList: true, subtree: true });
            }

            // Cleanup
            return () => {
                window.removeEventListener('resize', adjustMargin);
                observer.disconnect();
            };
        }, [adjustMargin]);


        // Effect to update playlistName when selectedPlaylistObj changes
        useEffect(() => {
            if (selectedPlaylistObj) {
                setPlaylistName(selectedPlaylistObj.playlistName);
                props.setTracksEdited(selectedPlaylistObj.tracks);
            }

            const duplicationCounts = {};
            selectedPlaylistObj.tracks.forEach(track => {
                const baseKey = track.id;
                duplicationCounts[baseKey] = (duplicationCounts[baseKey] || 0) + 1;
            });

            setTrackDuplicationCounts(duplicationCounts);
        }, [selectedPlaylistObj, props.setTracksEdited]);

        // Saves a playlist that has been edited
        const handleSavingEditedPlaylist = () => {
            if (props.selectedPlaylist !== null) {
                props.onEdit(props.selectedPlaylist, props.tracksEdited);
                props.onNameChange(playlistName, props.selectedPlaylist)
                props.handleExitEditMode();
            }
        };

        const handleConfirmAdd = (track) => {
            handleAddingDuplicateTracks(track);
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
        };

        // Gets search results from searchbar.js
        const handleSearchResults = useCallback((results) => {
            setSearchResults(results || []);
        }, []);

        const handleAddingDuplicateTracks = useCallback((track) => {
            const baseKey = track.id;

            setTrackDuplicationCounts(prevCounts => {
                const newCounts = {...prevCounts};
                newCounts[baseKey] = (newCounts[baseKey] || 1) + 1;

                const uniqueKey = `${baseKey}-${newCounts[baseKey]}`;
                
                const trackWithUniqueKey = {
                    ...track,
                    uniqueKey: uniqueKey
                };
                
                setTimeout(() => {
                    props.setTracksEdited(prevTracks => {
                        if (prevTracks.some(t => t.uniqueKey === uniqueKey)) return prevTracks;
                        return [trackWithUniqueKey, ...prevTracks];
                    });
                }, 0);
                return newCounts;
            });
        }, [props.setTracksEdited]);

        const addTracksEditingPlaylist = useCallback(
            (track) => {

                if (props.tracksEdited.some((savedTrack) => savedTrack.id === track.id)) {
                    setDuplicateTrack(track);
                    setIsDuplicateModalVisible(true);
                    return;
                }

                 props.setTracksEdited((prevTracks) => [{ ...track, uniqueKey: `${track.id}-1` }, ...prevTracks]);
            },
            [props.tracksEdited, props.setTracksEdited]
        );
        
          // Slice the tracks based on pagination
        const startIndex = trackCurrentPage * tracksPerTrackPage;
        const currentTracks = props.tracksEdited.slice(startIndex, startIndex + tracksPerTrackPage);


        return (
            <div className='displayEditingPlaylist'>
                {/* Creates a Div for Editing Playlists */}
                <div className='editingSection' ref={editingSectionRef}>
                    {props.selectedPlaylist !== null && (
                        <div className={`EditingPlaylist`} id={`EditingPlaylist-${selectedPlaylistObj.playlistId}`}>
                            <div className='editingMainContainer'>
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
                            </div>
                            {/* TrackList for the current playlist */}
                            <TrackList
                                key={props.selectedPlaylist + 1}
                                tracks={props.tracksEdited}
                                onAdd={addTracksEditingPlaylist}
                                onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.uniqueKey !== track.uniqueKey))}
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
                <div className='editingSearch' ref={editingSearchRef}>
                    <div className="searchForNewTracks">
                        <h3>Search</h3>
                        <SearchBar onSearchResults={handleSearchResults} setSearchLoading={props.setSearchLoading}/>
        
                        {/* Display search results in a TrackList */}
                        <SearchResults
                            tracks={searchResults}
                            onAdd={addTracksEditingPlaylist}
                            onRemove={(track) => props.setTracksEdited((prev) => prev.filter((t) => t.uniqueKey !== track.uniqueKey))}
                            tracksEdited={props.tracksEdited}
                            selectedPlaylist={props.selectedPlaylist}
                        />
                    </div>
                    
                </div>
            </div>
        );
        
        
    }
    
    export default EditingPlaylist;