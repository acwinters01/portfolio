import { getUserPlaylists, getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';
import { getStoredToken} from '../Authorization/Authorization'
import { mockUserProfile, mockUserPlaylist, userPlaylistNames, mockPlaylistTrackRequestData, findUserPlaylistTrackNames } from '../../test/MockTestData';
const assert = require('assert');

// Mock the getUserProfile function
jest.mock('../Authorization/Requests', () => ({
  getUserProfile: jest.fn(),
  getUserPlaylists: jest.fn(),
}));

beforeEach(() => {
  getUserProfile.mockResolvedValue(mockUserProfile);
  getUserPlaylists.mockResolvedValue(mockUserPlaylist);

})

it('Should get user profile user ID', async () => {
  // Set up
  let user;
  user = await getUserProfile();
  expect(user.id).toBe("h33r17gctn0muvypb3nm0kkk5");
});

it('Should get a list of the users playlist names', async () => {
  // Set up
  let playlists;
  playlists = await getUserPlaylists();
  const names = playlists.items.map(item => item.name); 
  
  expect(names).toEqual(userPlaylistNames)
});