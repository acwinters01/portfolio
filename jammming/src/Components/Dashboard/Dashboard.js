import React, { useState, useEffect, useCallback } from 'react';
import { getUserPlaylists, getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';
import PagesSetUp from '../Playlist/PagesSetUp';

const Dashboard = (props) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylistData, setUserPlaylistData] = useState(null)
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const playlistsPerPage = 5;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch the user profile
                const profileData = await getUserProfile();
                setUserProfile(profileData);
                // console.log("Calling User in Dashboard:", profileData);

                try {
                    // Fetch the user's playlists
                    const playlistsData = await getUserPlaylists(profileData.id);
                    // console.log("Calling User Playlists in Dashboard:", playlistsData);
                    setUserPlaylistData(playlistsData);
                } catch (err) {
                    setError("An error occurred while fetching the user playlists.");
                    console.error("Error fetching playlists:", err);
                }
                     
            } catch (err) {
                setError("An error occurred while fetching the user profile.");
                console.error("Error fetching profile:", err);

            } finally {
                setIsLoading(false); // Stop loading once the data is fetched
            }
        };
    
        fetchProfile();
    }, []);


    // Pagination handlers
    const goToNextPage = () => {
        if (!userPlaylistData || !userPlaylistData.items) return;
        const totalPlaylists = userPlaylistData.items.length;
        const totalPages = Math.ceil(totalPlaylists / playlistsPerPage);

        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };



    const handlePlaylistSync = useCallback(async (playlist) => {
        let prevPlaylistTracks = [];

        try {
            const initalTracksResponse = await makeSpotifyRequest(`playlists/${playlist.id}/tracks`, 'GET');
            let getTracksResponse = initalTracksResponse.items || []; // Extract the tracks safely

            // Handle cases with more than 100 tracks (pagination)
            if (initalTracksResponse.total > 100) {
                const count = Math.ceil(initalTracksResponse.total/100);
                getTracksResponse = [...initalTracksResponse.items]
                
                for(let i = 1; i < count; i++) {
                    let offsetCount = (i * 100);

                    let queryParams = new URLSearchParams({
                        offset: offsetCount,
                        limit: 100
                    });

                    let newResponse = await makeSpotifyRequest(`playlists/${playlist.id}/tracks?${queryParams.toString()}`, 'GET');
                    // console.log(`Tracks batch ${i}:`, newResponse.items); // Log each batch
                    getTracksResponse = [...getTracksResponse, ...newResponse.items];
                };
                
            };

            // Check if we actually have tracks to process
            if (!Array.isArray(getTracksResponse) || getTracksResponse.length === 0) {
                //console.log("No tracks found in the playlist.");
            };

            getTracksResponse.forEach((trackInfo) => {
                if (trackInfo && trackInfo.track) {
                    let track = {
                        id: trackInfo.track.id,
                        name: trackInfo.track.name,
                        artist: trackInfo.track.artists.map((artist) => artist.name).join(', '),
                        album: trackInfo.track.album.name,
                        uri: trackInfo.track.uri,
                        image: trackInfo.track.album.images[1]?.url || './public/music_note_baseImage.jpg' // Fallback for missing image
                    };
                    prevPlaylistTracks.push(track);
                };
            });


        } catch (error) {
            console.error("Error fetching playlist tracks:", error);
        }

       let editingPlaylist = {
            playlistName: playlist.name,
            playlistId: playlist.id,
            tracks: prevPlaylistTracks
        };

        // console.log("Edit Playlist Updated:", editingPlaylist);

        props.setExistingPlaylist((prevPlaylists) => {
            // Ensure prevPlaylists is an array and editingPlaylist has tracks
            const validPrevPlaylists = Array.isArray(prevPlaylists) ? prevPlaylists : [];
            
            if (editingPlaylist.tracks && editingPlaylist.tracks.length > 0) {
                return [...validPrevPlaylists, editingPlaylist];
            } else {
                console.log("No tracks available in editing playlist, skipping update.");
                return validPrevPlaylists; // Return the previous state without changes if no tracks
            }
        });

        // console.log('Logging existing playlist...');

    }, [props]);

    return (
        <div className='displayDashboard'>
           
            {isLoading ? (
                <div className='dashboardLoading'>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    {error && <p>Error: {error}</p>}
                    {userProfile ? (
                        <div className='userInfoContainer'>
                            <div className='userInfo'>
                                <img src={userProfile.images[0]?.url} alt="Profile" />
                                <h2>{userProfile.display_name}</h2>
                                <p>Email: {userProfile.email}</p>
                                <p>Country: {userProfile.country}</p>
                            </div>
                            <div className='usersPlaylist-TitleContainer'>
                                <h3>Playlists Listed Under {userProfile.display_name}:</h3>

                                {userPlaylistData && userPlaylistData.items && userPlaylistData.items.length > 0 ? (
                                    <div className='usersPlaylistsContainer'>
                                        {/* Paginate playlists */}

                                        {userPlaylistData.items
                                            .slice(currentPage * playlistsPerPage, (currentPage + 1) * playlistsPerPage)
                                            .map((playlist, index) => (
                                                <div key={index} className={`dashboardPlaylist-${index}`}>
                                                    
                                                    {/* Add check for playlist.images */}
                                                    {playlist.images && playlist.images.length > 0 ? (
                                                        <img src={playlist.images[0]?.url || ''} alt="Playlist" />
                                                    ) : (
                                                        <div>No Image</div> // Placeholder if no image
                                                    )}
                                                    
                                                    <div className='playlistText'>
                                                        <p>{playlist.name}</p>
                                                        <button id={`${index}-toApp`} onClick={() => handlePlaylistSync(playlist)}>Sync</button>
                                                    </div>
                                                </div>
                                            ))
                                        }
    
                                        {/* Pagination Component */}
                                        <PagesSetUp
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(userPlaylistData.items.length / playlistsPerPage)}
                                            goToNextPage={goToNextPage}
                                            goToPreviousPage={goToPreviousPage}
                                        />
                                    </div>
                                ) : (
                                    <p>No playlists available</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='userProfileLoading'>
                            <p>Loading profile...</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
};

export default Dashboard;