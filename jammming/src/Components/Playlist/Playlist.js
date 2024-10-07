import React, { useCallback, useState } from 'react';
import TrackList from '../Tracklist/Tracklist';
import CustomPlaylist from './CustomPlaylist';
import Authorization from '../Authorization/Authorization';

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

    const transferToSpotify = () => {
        const spotifyUris = ["7tYKF4w9nC0nq9CsPZTHyP", "1svpo8ORIHy4BdgicdyUjx", "2qSkIjg1o9h3YT9RAgYN75", 
            "14dLEccPdsIvZdaMfimZEt", "2ZqTbIID9vFPTXaGyzbb4q"];
            
            <Authorization 
                setUrlToFetch={"7tYKF4w9nC0nq9CsPZTHyP"}/>
         // Create a Playlist --POST /users/{playlist_id}/tracks -- 
                // (name: (input value)) 
            

         /* Add items to Playlist: --POST /playlists/{user_id}/playlists-- 
                (playlist_id: get spotifyID of playlist, 
                BODY
                position(index), 
                uris(string) - comma-separated lit of spotify uris of tracks, 
          EX) 
            uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh, 
            spotify:track:1301WleyT98MSxVHPZCA6M, 
            spotify:episode:512ojhOuo1ktJprKbVcKyQ*/ 
    }

    return (
        <div>
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
            <div>
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
                    </div>
                ))}
                <button onClick={transferToSpotify}>Save On Spotify</button>
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
