import React, {useCallback, useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import Authorization from '../Authorization/Authorization';


function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Low', artist: 'SZA', album: 'SOS', uri: "7tYKF4w9nC0nq9CsPZTHyP", id: 1 },
    { name: 'Spot a Fake', artist: 'Ava Max', album: 'Spot a Fake Single', uri: "1svpo8ORIHy4BdgicdyUjx", id: 2 },
    { name: 'Espresso', artist: 'Sabrina Carpenter', album: 'Espresso Single', uri: "2qSkIjg1o9h3YT9RAgYN75", id: 3 },
    { name: 'Forever', artist: 'Gryffin, Elley Duhë', album: 'Alive', uri: "14dLEccPdsIvZdaMfimZEt", id: 4 }, 
    { name: 'Neva Play (feat. RM of BTS)', artist: 'Megan Thee Stallion', album: 'Neva Play Single', uri: "2ZqTbIID9vFPTXaGyzbb4q", id: 5 }
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

  return (
    <div>
      <div>
        <Authorization
          tracks={searchResults}
        />
      </div>
      <h1>Jammming</h1>
      <Tracklist 
        tracks={searchResults} 
        onAdd={addTrack}
        onRemove={removeTrack}
        playlistTracks={newPlaylistTracks}
      />

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
  );
}

export default App;
