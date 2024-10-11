import React, { useCallback, useState } from 'react';
import TrackList from '../Tracklist/Tracklist';
import CustomPlaylist from './CustomPlaylist';
import { makeSpotifyRequest, getPlaylistsTracks, getUserPlaylists, getUserProfile } from '../Authorization/Requests';

// Get User Data
const userProfileData = await getUserProfile();
console.log(userProfileData)
// console.log("Calling User Profile in Playlist")
// const userPlaylistData = await getUserPlaylists(userProfileData.id);


// Playlist Component
export default function Playlist(props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracksEdited, setTracksEdited] = useState([]);

    const handleNewPlaylistNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value, null);
        }, 
        [props.onNameChange]
    );

    const handleEditTracks = (index) => {
        setSelectedPlaylist(index);
        setTracksEdited(props.existingPlaylist[index].tracks);
    }
    
    // Grab Track Uri from App Playlist
    const handlePlaylistTracks = async(index) => {
        let tracksToAdd = [];
        props.existingPlaylist[index].tracks.forEach((track) => {
            if(track.uri) {
                console.log(`Track URI for ${track.name}: ${track.uri}`)
                tracksToAdd.push(track.uri);
            } else {
                console.warn(`Track URI missing for ${track.name}`);
            }
            
            
        });
        console.log(`Tracks being added: ${tracksToAdd}`)
        return tracksToAdd;
    }

    const transferToSpotify = async (index) => {
        // Hard-Coded Song URIs
        // const spotifyUris = [
        //     "spotify:track:7tYKF4w9nC0nq9CsPZTHyP", 
        //     "spotify:track:1svpo8ORIHy4BdgicdyUjx", 
        //     "spotify:track:2qSkIjg1o9h3YT9RAgYN75", 
        //     "spotify:track:14dLEccPdsIvZdaMfimZEt", 
        //     "spotify:track:2ZqTbIID9vFPTXaGyzbb4q"
        // ];
            
        try {  
            
            const tracksToAdd = await handlePlaylistTracks(index);

            // Creating Playlist 
            console.log(`Here is name: ${'', props.existingPlaylist[index].playlistName}`)
            const createPlaylistPayload = {
                name: props.existingPlaylist[index].playlistName,
                description: 'New playlist created from Jammming app',
                public: true
            };

            const createPlaylistResponse = await makeSpotifyRequest(`me/playlists`, 'POST', createPlaylistPayload);   
            console.log('Created Playlist:', createPlaylistResponse);

            // Getting Playlist ID
            const playlistId = createPlaylistResponse.id;

            // Adding Tracks to Playlist
            const addTracksPayload = {
                uris: tracksToAdd
            }
            const addTracksResponse = await makeSpotifyRequest(`playlists/${playlistId}/tracks`, 'POST', addTracksPayload)
            console.log('Adding tracks:', addTracksResponse)
            console.log(createPlaylistResponse.tracks)

            const createdPlaylist = await makeSpotifyRequest(`playlists/${playlistId}`);
            console.log("Playlist after adding tracks:", createdPlaylist);

        } catch (error) {
            console.error('Error transferring playlist to Spotify:', error);
        }
    }

    return (
        <div className='playlistReturn'>
            <input 
                onChange={handleNewPlaylistNameChange} 
                value={props.playlistName}
                placeholder="New Playlist"/>

            <button onClick={props.onSave}>Save Playlist</button>

            <TrackList
                tracks={props.playlistTracks}
                onAdd={props.onAdd} 
                onRemove={props.onRemove}
                playlistTracks={props.playlistTracks}
            />
            <div className='displayPlaylistInfo'>
                {props.existingPlaylist.map((playlist, index) => (
                    <div key={index}>
                        <div>
                            <h4>{playlist.playlistName}</h4>
                            <button onClick={() => handleEditTracks(index)}>Edit</button>
                        </div>
                        <ul>
                            {playlist.tracks.map((track, i) => (
                                <li key={i}>{track.name} by {track.artist} | ID: {track.id}</li>
                            ))}
                        </ul>
                        <button onClick={() => transferToSpotify(index)}>Save On Spotify</button>
                    </div>
                ))}
            </div>
            <CustomPlaylist 
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
                tracks={props.tracks}
                onNameChange = {props.onNameChange}
                existingPlaylist={props.existingPlaylist}
                tracksEdited={tracksEdited}
                setTracksEdited={setTracksEdited}
                onEdit={props.onEdit}
            />
        </div>
            
    );
}
