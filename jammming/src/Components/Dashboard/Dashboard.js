import React, { useState, useEffect } from 'react';
import { getUserPlaylists, getUserProfile } from '../Authorization/Requests';

const Dashboard = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch the user profile
                const profileData = await getUserProfile();
                setUserProfile(profileData);

                // Fetch the user's playlists
                const playlistsData = await getUserPlaylists(profileData.id);
                // console.log("Calling User Playlists in Dashboard:", playlistsData);

            } catch (err) {
                setError("An error occurred while fetching the user profile or playlists.");
                console.error("Error fetching profile or playlists:", err);
            }
        };

        fetchProfile();
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
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Dashboard;