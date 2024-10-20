import { isTokenExpired, refreshToken } from "./Authorization";

// Gets stored token from local storage
const getStoredToken = () => { 
    try {
        const token = localStorage.getItem('access_token');
        return token
    } catch (error) {
        console.error('Token not here', error)
    }
   
};

// Makes requests to Spotify
export const makeSpotifyRequest = async(endpoint, method = 'GET', body=null) => {
    let accessToken = await getStoredToken();
    console.log(accessToken)
    
   

    if(isTokenExpired()) {
        console.log("Access token expired. Attempting to refresh")
        accessToken = await refreshToken();
        if(!accessToken) {
            throw new Error('Unable to refresh access token. ')
        }
    }

     if (!accessToken) {
        throw new Error('No access token available. Please login.');
    }

    const fetchOptions = {
        method: method,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    };

    // If the method is not GET and there is a body, add it to the fetch options
    if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);  // Convert the body to a JSON string
    }

    try { 
        // console.log(`Sending ${method} request to endpoint: ${endpoint} with body:`, body);

        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, fetchOptions);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Spotify API Error: ${errorData.error.message}`);
        }
        // console.log(`Method: ${method}`,fetchOptions)
        
        return await response.json();

    } catch (error) {
        console.error('Error making Spotify request:', error);
        throw error; // Re-throw to handle the error at a higher level if needed
    }
};

// Fetch the Spotify user's profile
export const getUserProfile = async () => {
    try {
        const data = await makeSpotifyRequest('me');
        // console.log('Calling User Profile in Requests:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

// Fetch the Spotify user's playlists
export const getUserPlaylists = async () => {
    try {
        const data = await makeSpotifyRequest('me/playlists');
       // console.log('Calling User Playlists in Requests:', data);
        return data;
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
};

// Fetch the tracks from a specific playlist
export const getPlaylistsTracks = async (playlistId) => {
    try { 
        const data = await makeSpotifyRequest(`playlists/${playlistId}/tracks`);
        console.log('Calling Playlist Tracks in Requests:', data);
        return data;
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
    }
};
