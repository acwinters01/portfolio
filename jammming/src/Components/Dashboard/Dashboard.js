import React, { useState, useEffect, useCallback } from 'react';
import { getUserPlaylists, getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';

const Dashboard = (props) => {
    let index = 0;
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylistData, setUserPlaylistData] = useState(null)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch the user profile
                const profileData = await getUserProfile();
                setUserProfile(profileData);

                // Fetch the user's playlists
                const playlistsData = await getUserPlaylists(profileData.id);
                setUserPlaylistData(playlistsData);
                // console.log("Calling User Playlists in Dashboard:", userPlaylistData);

            } catch (err) {
                setError("An error occurred while fetching the user profile or playlists.");
                console.error("Error fetching profile or playlists:", err);
            }
        };

        fetchProfile();
    }, []);

    const handlePlaylistSync = useCallback(async(playlist) => {

        let prevPlaylistTracks = []

        try {
            const initalTracksResponse = await makeSpotifyRequest(`playlists/${playlist.id}/tracks`, 'GET', );
            let getTracksResponse = [];

            if (initalTracksResponse.total > 101) {
                console.log(`total songs: ${initalTracksResponse.total}`);

                const count = Math.ceil(initalTracksResponse.total/100);
                console.log('Tracks in Playlist ' + playlist.name + 'Count: ' + count, initalTracksResponse);

                getTracksResponse.push(initalTracksResponse.items)
                
                for(let i = 1; i < count; i++) {
                    let offsetCount = (i * initalTracksResponse.limit);

                    let queryParams = new URLSearchParams({
                        offset: offsetCount,
                        limit: initalTracksResponse.limit
                    });

                    let newResponse = await makeSpotifyRequest(`playlists/${playlist.id}/tracks?${queryParams.toString()}`, 'GET');
                    getTracksResponse.push(newResponse.items)
                }

                console.log(getTracksResponse)
                
            } else { 
                getTracksResponse = initalTracksResponse;
            }

            getTracksResponse.forEach((array) => {
                array.forEach((trackInfo) => {
                    let track = {
                        id: trackInfo.track.id,
                        name: trackInfo.track.name,
                        artist: trackInfo.track.artists.map(artist => artist.name).join(', '),
                        album: trackInfo.track.album.name,
                        uri: trackInfo.track.uri
                    }
                    
                    prevPlaylistTracks.push(track)
                })
            });


        } catch (error) {
            console.log(error)
        }

       let customPlaylist = {
            playlistName: playlist.name,
            tracks: prevPlaylistTracks
        };

        console.log(customPlaylist);

        props.setExistingPlaylist((prevPlaylists)=> [...prevPlaylists, customPlaylist])
        console.log('Logging existing playlist...');

     }, []);

    return(
        <div className='dashboard'>
            {error && <p>Error: {error}</p>}
            {userProfile ? (
                <div className='userInfo'>
                    <img src={userProfile.images[1].url}/>
                    <h2>{userProfile.display_name}</h2>
                    <p>Email: {userProfile.email}</p>
                    <p>Country: {userProfile.country}</p>
                    <div key={index+2}>
                        <h3>Playlists Listed Under {userProfile.display_name}:</h3>
                        {userPlaylistData && (
                            <div>
                                {userPlaylistData.items.map((playlist, index) => (
                                    <div>
                                        <p key={index}>{playlist.name}</p>
                                        <button onClick={() => handlePlaylistSync(playlist, index)}>+</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Dashboard;