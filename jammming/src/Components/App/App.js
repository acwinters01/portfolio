import React, {useCallback, useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import Authorization from '../Authorization/Authorization';
import Dashboard from '../Dashboard/Dashboard';
import SearchBar from '../SearchBar/SearchBar';


function App() {
  // const [searchResults, setSearchResults] = useState([

  //   { name: 'Low', artist: 'SZA', album: 'SOS', uri: "spotify:track:7tYKF4w9nC0nq9CsPZTHyP", id: 1 },
  //   { name: 'Spot a Fake', artist: 'Ava Max', album: 'Spot a Fake Single', uri: "spotify:track:1svpo8ORIHy4BdgicdyUjx", id: 2 },
  //   { name: 'Espresso', artist: 'Sabrina Carpenter', album: 'Espresso Single', uri: "spotify:track:2qSkIjg1o9h3YT9RAgYN75", id: 3 },
  //   { name: 'Forever', artist: 'Gryffin, Elley Duhë', album: 'Alive', uri: "spotify:track:14dLEccPdsIvZdaMfimZEt", id: 4 }, 
  //   { name: 'Neva Play (feat. RM of BTS)', artist: 'Megan Thee Stallion', album: 'Neva Play Single', uri: "spotify:track:2ZqTbIID9vFPTXaGyzbb4q", id: 5 }
  // ]);

  const [searchResults, setSearchResults] = useState([]);
  const [existingPlaylist, setExistingPlaylist] = useState([

    { playlistName: 'New Verbose', 
      playlistId: 123456,
      tracks: [{name: 'Forever', album: 'Alive', artist: 'Gryffin, Elley Duhë', uri: "spotify:track:14dLEccPdsIvZdaMfimZEt", id: 4, image: './music_note_baseImage.jpg' },
               {name: 'Neva Play (feat. RM of BTS)', album: 'Neva Play (feat. RM of BTS)', artist: 'Megan Thee Stallion', uri: "spotify:track:2ZqTbIID9vFPTXaGyzbb4q", id: 5, image: './music_note_baseImage.jpg' }] }
  ]);

  const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');


  // Add track to new playlist
  const addTrack = useCallback(
    (track) => {

      if (newPlaylistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setNewPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [newPlaylistTracks]
  );

  // Remove track to new playlist
  const removeTrack = useCallback(
    (track) => {

      setNewPlaylistTracks((prev) => {
        return prev.filter((trackToRemove) => trackToRemove.id !== track.id) 
      })
    }, 
    []
  );

  // Sets track results from searchbar.js
  const handleSearchResults = (results) => {
    setSearchResults(results || []);
  };

  // Updates Playlist name
  const updatePlaylistName = useCallback((newName, playlistIndex) => {

    console.log(`Playlist is ${playlistIndex}`)
    // Checks if playlistIndex is a number and not over or under the existingPlaylist length
    if (typeof playlistIndex === 'number' && playlistIndex >= 0 && playlistIndex < existingPlaylist.length) {
        console.log(`Playlist is existing`);

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

  // Saves Playlist
  const savePlaylist = useCallback(() => {
    // Ensure playlist has a name and tracks
    if (!playlistName || newPlaylistTracks.length === 0) {
      console.log("Cannot save: playlist name or tracks are missing");
      return;
    }

    const newPlaylist = {
        playlistName: playlistName,
        tracks: newPlaylistTracks
    };

    console.log('Saving playlist', newPlaylist)

    setExistingPlaylist((prevPlaylists) => {
      // Ensure prevPlaylists is an array and newPlaylist has tracks
      const validPrevPlaylists = Array.isArray(prevPlaylists) ? prevPlaylists : [];
      
      if (newPlaylist.tracks && newPlaylist.tracks.length > 0) {
          return [...validPrevPlaylists, newPlaylist];
      } else {
          console.log("No tracks available in customPlaylist, skipping update.");
          return validPrevPlaylists; // Return the previous state without changes if no tracks
      }
    });    
    
    setPlaylistName('');
    setNewPlaylistTracks([]);

  }, [playlistName, newPlaylistTracks]);

  // Edits Existing Playlists
  const editExistingPlaylist = useCallback((playlistIndex, updatedTracks) => {

    setExistingPlaylist((prevPlaylists) => {

      const updatedPlaylist = [...prevPlaylists];
      updatedPlaylist[playlistIndex].tracks = updatedTracks;
      return updatedPlaylist;
    })

  },[])

  return (
    <div className='AppContainer'>
      <div className='mainAppTitle'>
        <h1>Jammming</h1>
      </div>
      <div className='authorizationContainer'>
        <Authorization/>
      </div>
      <div className='searchBarContainer'>
        <SearchBar onSearchResults={handleSearchResults}/>
      </div>
      <div className='trackListContainer'>
        <Tracklist 
          tracks={searchResults} // Ensures tracks is always an array
          onAdd={addTrack}
          onRemove={removeTrack}
          playlistTracks={newPlaylistTracks}
        />
      </div>
      <div className='allPlaylistsContainer'>
        <div className='playlistTitle'>
          <h2>Playlists</h2>
        </div>
        <Playlist 
          playlistName={playlistName} 
          playlistTracks={newPlaylistTracks}
          onNameChange={updatePlaylistName}
          setPlaylistName={setPlaylistName}
          setExistingPlaylist={setExistingPlaylist}
          existingPlaylist={existingPlaylist}
          tracks={searchResults}
          onEdit={editExistingPlaylist}
          onSave={savePlaylist}
          onRemove={removeTrack}
          onAdd={addTrack}

        />
      </div>
      <div className='dashboardContainer'>
        <div className='dashboardTitle'>
          <h2>Dashboard</h2>
        </div>
          <Dashboard
            setExistingPlaylist={setExistingPlaylist}
            existingPlaylist={existingPlaylist}
          />
      </div>
    </div>
  );
}

export default App;
