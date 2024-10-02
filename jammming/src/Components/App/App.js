import React, {useCallback, useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';



function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Song 1', artist: 'Artist 1', album: 'Album 1', id: 1 },
    { name: 'Song 2', artist: 'Artist 2', album: 'Album 2', id: 2 },
    { name: 'Song 3', artist: 'Artist 3', album: 'Album 3', id: 3 },
    { name: 'Song 4', artist: 'Artist 4', album: 'Album 4', id: 4 }, 
    { name: 'Song 5', artist: 'Artist 5', album: 'Album 5', id: 5 }
  ]);

  const [existingPlaylist, setExistingPlaylist] = useState([
    { playlistName: 'New Verbose', tracks: [{name: 'Song 4', artist: 'Artist 4', id: 4}, {name: 'Song 5', artist: 'Artist 5', id: 5}] }
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
