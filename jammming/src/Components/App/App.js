import React, {useCallback, useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';



function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Song 1', artist: 'Artist 1', album: 'Album 1', id: 1 },
    { name: 'Song 2', artist: 'Artist 2', album: 'Album 2', id: 2 },
    { name: 'Song 3', artist: 'Artist 3', album: 'Album 3', id: 3 }
  ]);

  const [existingPlaylist, setExistingPlaylist] = useState([
    { playlistName: 'New Verbose', tracks: [{name: 'Song 1', artist: 'Artist 1'}, {name: 'Song 2', artist: 'Artist 2'}] }
  ]);

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );


  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  },[])

  const savePlaylist = useCallback(() => {
    if (!playlistName || playlistTracks.length === 0) return;

    const newPlaylist = {
      playlistName: playlistName,
      tracks: playlistTracks
    };

    setExistingPlaylist((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    setPlaylistName('');
    setPlaylistTracks([]);

  }, [playlistName, playlistTracks]);

  return (
    <div>
      <h1>Jammming</h1>
      <Tracklist tracks={searchResults} onAdd={addTrack}/>

      <h2>Playlists</h2>
      <Playlist 
        playlistName={playlistName} 
        playlistTracks={playlistTracks}
        onNameChange={updatePlaylistName}
        existingPlaylist={existingPlaylist}
        onSave={savePlaylist}

      />
    </div>
  );
}

export default App;
