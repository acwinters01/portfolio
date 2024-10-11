import React, {useCallback, useState, useEffect} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import Authorization from '../Authorization/Authorization';
import Dashboard from '../Dashboard/Dashboard';


function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Low', artist: 'SZA', album: 'SOS', uri: "spotify:track:7tYKF4w9nC0nq9CsPZTHyP", id: 1 },
    { name: 'Spot a Fake', artist: 'Ava Max', album: 'Spot a Fake Single', uri: "spotify:track:1svpo8ORIHy4BdgicdyUjx", id: 2 },
    { name: 'Espresso', artist: 'Sabrina Carpenter', album: 'Espresso Single', uri: "spotify:track:2qSkIjg1o9h3YT9RAgYN75", id: 3 },
    { name: 'Forever', artist: 'Gryffin, Elley Duhë', album: 'Alive', uri: "spotify:track:14dLEccPdsIvZdaMfimZEt", id: 4 }, 
    { name: 'Neva Play (feat. RM of BTS)', artist: 'Megan Thee Stallion', album: 'Neva Play Single', uri: "spotify:track:2ZqTbIID9vFPTXaGyzbb4q", id: 5 }
  ]);

  const [existingPlaylist, setExistingPlaylist] = useState([
    { playlistName: 'New Verbose', 
      tracks: [{name: 'Forever', artist: 'Gryffin, Elley Duhë', uri: "14dLEccPdsIvZdaMfimZEt", id: 4}, 
               {name: 'Neva Play (feat. RM of BTS)', artist: 'Megan Thee Stallion', uri: "2ZqTbIID9vFPTXaGyzbb4q", id: 5}] }
  ]);

  const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');

  const addTrack = useCallback(
    (track) => {
      if (newPlaylistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setNewPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [newPlaylistTracks]
  );

  const removeTrack = useCallback(
    (track) => {
      setNewPlaylistTracks((prev) => {
        return prev.filter((trackToRemove) => trackToRemove.id !== track.id) 
      })
    }, 
    [newPlaylistTracks]
  )

  const updatePlaylistName = useCallback((newName, playlistIndex) => {
    console.log(`Playlist is ${playlistIndex}`)
    if (typeof playlistIndex === 'number' && playlistIndex >= 0 && playlistIndex < existingPlaylist.length) {
        console.log(`Playlist is existing`)
        setExistingPlaylist((prevPlaylists) => {
          const updatedPlaylists = [...prevPlaylists];
          updatedPlaylists[playlistIndex].playlistName =  newName;
          return updatedPlaylists;
        })
    } else {
      console.log(`Creating new Playlist with name: ${newName}`)
      setPlaylistName(newName);
    }
  }, [existingPlaylist])

  const savePlaylist = useCallback(() => {
    if (!playlistName || newPlaylistTracks.length === 0) return;

    const newPlaylist = {
      playlistName: playlistName,
      tracks: newPlaylistTracks
    };

    setExistingPlaylist((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    setPlaylistName('');
    setNewPlaylistTracks([]);

  }, [playlistName, newPlaylistTracks]);

  const editExistingPlaylist = useCallback((playlistIndex, updatedTracks) => {
    setExistingPlaylist((prevPlaylists) => {
      const updatedPlaylist = [...prevPlaylists];
      updatedPlaylist[playlistIndex].tracks = updatedTracks;
      return updatedPlaylist;
    })

  },[])

  // const transferToSpotify = async () => {
  //   // Hard-Coded Song URIs
  //   const spotifyUris = [
  //       "spotify:track:7tYKF4w9nC0nq9CsPZTHyP", 
  //       "spotify:track:1svpo8ORIHy4BdgicdyUjx", 
  //       "spotify:track:2qSkIjg1o9h3YT9RAgYN75", 
  //       "spotify:track:14dLEccPdsIvZdaMfimZEt", 
  //       "spotify:track:2ZqTbIID9vFPTXaGyzbb4q"
  //   ];
        
  //   try {  
  //       // Creating Playlist 
  //       console.log(`Here is name: ${'', props.existingPlaylist[0].playlistName}`)
  //       const createPlaylistPayload = {
  //           name: props.existingPlaylist[0].playlistName,
  //           description: 'New playlist created from Jammming app',
  //           public: true
  //       };

  //       const createPlaylistResponse = await makeSpotifyRequest(`me/playlists`, 'POST', createPlaylistPayload);   
  //       console.log('Created Playlist:', createPlaylistResponse);

  //       // Getting Playlist ID
  //       const playlistId = createPlaylistResponse.id;

  //       // Adding Tracks to Playlist
  //       const addTracksPayload = {
  //           uris: spotifyUris
  //       }
  //       const addTracksResponse = await makeSpotifyRequest(`playlists/${playlistId}/tracks`, 'POST', addTracksPayload)
  //       console.log('Adding tracks:', addTracksResponse)
  //       console.log(createPlaylistResponse.tracks)

  //       const createdPlaylist = await makeSpotifyRequest(`playlists/${playlistId}`);
  //       console.log("Playlist after adding tracks:", createdPlaylist);

  //   } catch (error) {
  //       console.error('Error transferring playlist to Spotify:', error);
  //   }
  // }

  return (
    <div>
      <h1>Jammming</h1>
      <div className='Authorization'>
        <Authorization/>
      </div>
      <div className='displayTracks'>
        <Tracklist 
          tracks={searchResults} 
          onAdd={addTrack}
          onRemove={removeTrack}
          playlistTracks={newPlaylistTracks}
        />
      </div>
      <div className='displayPlaylist'>
        <h2>Playlists</h2>
        <Playlist 
          playlistName={playlistName} 
          playlistTracks={newPlaylistTracks}
          onNameChange={updatePlaylistName}
          setPlaylistName={setPlaylistName}
          existingPlaylist={existingPlaylist}
          tracks={searchResults}
          onEdit={editExistingPlaylist}
          onSave={savePlaylist}
          onRemove={removeTrack}
          onAdd={addTrack}

        />
      </div>
      <div>
        <h2>Dashboard</h2>
          <Dashboard/>
      </div>
    </div>
  );
}

export default App;
