import React, { useState } from 'react';
import Track from '../Track/Track';
import PagesSetUp from '../Playlist/PagesSetUp';


const TrackList = ({ tracks, tracksPerPage = 5, onAdd, onRemove, playlistTracks = [], tracksEdited = [] }) => {
    // Add these logs at the start of TrackList to verify props received

    const [currentPage, setCurrentPage] = useState(0);
    const startIndex = currentPage * tracksPerPage;
    const endIndex = startIndex + tracksPerPage;
    const currentTracks = tracks ? tracks.slice(startIndex, endIndex) : [];
    // console.log(currentTracks)
    
    // Safeguard for fewer tracks than expected
    if (currentTracks.length === 0 && tracks.length > 0) {
        console.log('There are fewer tracks than the tracks per page')
        return <p>There are fewer tracks than the tracks per page.</p>;
    };

    // If currentTracks is falsy or the array length is 0, display no tracks found
    if (!currentTracks || currentTracks.length === 0) {
        return;
    };

    // Selects playlist track by id
    const isSelected = (track) => {
        const inPlaylist = Array.isArray(playlistTracks) && playlistTracks.some((playlistTrack) => playlistTrack.id === track.id);
        // const inEdited = Array.isArray(tracksEdited) && tracksEdited.some((editedTrack) => editedTrack.id === track.id);
        return inPlaylist;
    }
    
    
    // Pagination controls
    const goToNextPage = () => {
        if ((currentPage + 1) * tracksPerPage < tracks.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };
    // console.log(`List of tracks: ${props.tracks}`)

    return (
        <div className='displayTrackList'>
            {currentTracks.length === 0 ? (
                <p>No tracks found</p>
                
            ) : (
                currentTracks.map((track) => (
                    <Track
                        key={track.id}
                        id={track.id}  // Pass id as a normal prop
                        name={track.name}
                        artist={track.album?.artists ? track.album.artists.map(artist => artist.name).join(', ') : track.artist}
                        album={track.album.name || track.album || 'Unknown Album'}
                        imageUri={track.album?.images?.[1]?.url || track.image || track.imageUri || 'Image not Found'}
                        uri={track.uri}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        isSelected={isSelected}
               
                    />
                ))
            )}

            {/* Add pagination controls */}
            {tracks.length > tracksPerPage && (
                <PagesSetUp
                    currentPage={currentPage}
                    totalPages={Math.ceil(tracks.length / tracksPerPage)}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                />
            )}

        </div>
    );
};

export default TrackList;
