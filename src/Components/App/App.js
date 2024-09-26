import React, {useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import test from '../../test.json';


function App() {
  const [searchResults, setSearchResults] = useState([
    { name: 'Song 1', artist: 'Artist 1', album: 'Album 1', id: 1 },
    { name: 'Song 2', artist: 'Artist 2', album: 'Album 2', id: 2 },
    { name: 'Song 3', artist: 'Artist 3', album: 'Album 3', id: 3 }
  ]);

  return (
    <div>
      <h1>Jammming</h1>
      <Tracklist tracks={searchResults} />
    </div>
  );
}

export default App;
