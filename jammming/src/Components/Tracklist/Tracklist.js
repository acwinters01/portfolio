import React from 'react';
import Track from '../Track/Track';
import PagesSetUp from '../Playlist/PagesSetUp';


const TrackList = (props) => {
    //console.log('In TrackList component:', props);

    const trackCurrentPage = props.trackCurrentPage || 0;
    const tracksPerTrackPage = props.tracksPerTrackPage || 5;
    const startIndex = trackCurrentPage * tracksPerTrackPage;
    const endIndex = startIndex + tracksPerTrackPage;
    const currentTracks = props.tracks ? props.tracks.slice(startIndex, endIndex) : [];
    console.log(currentTracks)
    
    // Safeguard for fewer tracks than expected
    if (currentTracks.length === 0 && props.tracks.length > 0) {
        console.log('There are fewer tracks than the tracks per page')
        return <p>There are fewer tracks than the tracks per page.</p>;
    }

    if (!currentTracks || currentTracks.length === 0) {
        return <div>No tracks found</div>;
    }
    const isSelected = (track) => {
        return props.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    }
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
                        onAdd={props.onAdd}
                        onRemove={props.onRemove}
                        isSelected={isSelected}
               
                    />
                ))
            )}

            {/* Add pagination controls */}
            {props.tracks.length > tracksPerTrackPage && (
                <PagesSetUp
                    currentPage={trackCurrentPage}
                    totalPages={Math.ceil(props.tracks.length / tracksPerTrackPage)}
                    goToNextPage={props.goToNextTrackPage}
                    goToPreviousPage={props.goToPreviousTrackPage}
                />
            )}

        </div>
    );
};

export default TrackList;
