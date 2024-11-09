import React, {useCallback, useState} from 'react';
import Playlist from '../Playlist/Playlist';
import Authorization from '../Authorization/Authorization';
import Dashboard from '../Dashboard/Dashboard';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Loading from '../Authorization/Loading'
import DuplicateTrackModal from '../Track/DuplicateTrackModal';
import PlaylistModal from '../Playlist/PlaylistModal'
import './App.css';
import './App-mobile.css';
import './reset.css';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  const [searchResults, setSearchResults] = useState([]);
  const [existingPlaylist, setExistingPlaylist] = useState([]);
  const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);
  const [ duplicateTrack, setDuplicateTrack ] = useState(null);

  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Loading Screens
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const isAnyLoading = () => searchLoading || saveLoading || syncLoading || transferLoading;

  // Toggles
  const toggleDashboard = () => {
    if (isEditing) return;
    setDashboardOpen(!dashboardOpen);
  }
  const handleEditOpen = () => {
    if (dashboardOpen) {
      setShowModal(true); // Show modal if dashboard is open
    } else {
      setIsEditing(true);
    }
  }
  const handleEditClose = () => setIsEditing(false);
  const closeModal = () => setShowModal(false);

  // Functions
  const handleConfirmAdd = (track) => {
    setNewPlaylistTracks((prevTracks) => [...prevTracks, track]);
    setIsDuplicateModalVisible(false);
    setDuplicateTrack(null);
  }

  const handleCancelAdd = () => {
    setIsDuplicateModalVisible(false);
    setDuplicateTrack(null); // Hide modal without adding
  };

  // Add track to new playlist
  const addTrack = useCallback(
    (track) => {
      console.log('being read')
      if (newPlaylistTracks.some((savedTrack) => savedTrack.id === track.id)) {
          setDuplicateTrack(track);
          setIsDuplicateModalVisible(true);
          return;
      }
      
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

    const generateLocalId = () => `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


    const newPlaylist = {
        key: generateLocalId(),
        playlistId: generateLocalId(),
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAppLoaded(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    setIsAuthenticated(false);
    setIsAppLoaded(false);
  }

  return (
    <div className={`AppContainer ${dashboardOpen ? 'dashboard-open' : ''} ${isEditing ? 'editing-active' : ''}`}>
      <div className='mainAppTitle'>
        <h1>Ja<span>mmm</span>ing</h1>
      </div>
      
      {!isAuthenticated ? (
        <div className='authorizationContainer'>
          <Authorization onLogin={handleLogin} onLogout={handleLogout}/>
        </div>
      ) : !isAppLoaded ? (
        <Loading />
      ) : (
        <>
          {isAnyLoading() && <Loading />}
          <div className='authorizationContainer' id="logOut">
            <Authorization onLogin={handleLogin} onLogout={handleLogout}/>
          </div>
          
          <div className='main'>
            <div className='appStart'>

              <div className='PlaylistsContainer'>
                <div className='playlistTitle'>
                  <h2 id='title'>Playlists</h2>
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
                  searchResults={searchResults}
                  setSearchLoading={setSearchLoading}
                  setTransferLoading={setTransferLoading}
                  transferLoading={transferLoading}
                  onEditOpen={handleEditOpen}
                  onEditClose={handleEditClose}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  dashboardOpen={dashboardOpen}
                />
              </div>
              <div className='search'>
              <div className='searchBarContainer'>
                <h2 id='title'>Results</h2>
                <SearchBar onSearchResults={handleSearchResults} setSearchLoading={setSearchLoading} />
              </div>
              <div className='searchResultsContainer'>
                <SearchResults tracks={searchResults} onAdd={addTrack} onRemove={removeTrack} playlistTracks={newPlaylistTracks} />
              </div>
            </div>
            </div>

          </div>

          {/* Dashboard Toggle Button */}
          <button className="dashboardToggle" onClick={toggleDashboard} disabled={isEditing}>
            {dashboardOpen ? '>' : '<'}
          </button>
          {/* Dashboard Component */}
          <div className={`dashboardContainer ${dashboardOpen ? 'open' : ''}`}>
            <Dashboard
              setExistingPlaylist={setExistingPlaylist}
              existingPlaylist={existingPlaylist}
              isOpen={dashboardOpen}
            />
          </div>

          {/* Modal */}
          {showModal && (
            <PlaylistModal message="Close the dashboard to edit a playlist." onClose={closeModal} />
          )}
          <DuplicateTrackModal track={duplicateTrack} onConfirm={handleConfirmAdd} onCancel={handleCancelAdd} />
        </>
      )}
    </div>
  );
}

export default App;