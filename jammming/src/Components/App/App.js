import React, {useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';



function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Song 1', artist: 'Artist 1', album: 'Album 1', id: 1 },
    { name: 'Song 2', artist: 'Artist 2', album: 'Album 2', id: 2 },
    { name: 'Song 3', artist: 'Artist 3', album: 'Album 3', id: 3 }
  ]);

  const [playlist, setPlaylist] = useState([
    {playlist: 'Happiness', tracks: []},
    {playlist: 'Sadness', tracks: []},
    {playlist: 'Holiness', tracks: []}
  ]);

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');

  const updatePlaylistName = (event) => {
    setPlaylistName(event.target.value);
  }

  return (
    <div>
      <h1>Jammming</h1>
      <Tracklist tracks={searchResults} />

      <h2>Playlists</h2>
      <Playlist 
        playlistName={playlistName} 
        playlistTracks={playlistTracks}
        onNameChange={updatePlaylistName}

      />
    </div>
  );
}

export default App;
