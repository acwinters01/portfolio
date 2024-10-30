import React, { useCallback, useState } from 'react';
import { getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';


const SearchBar = ({ onSearchResults, tracksPerPage }) => {

    const [searchInput, setSearchInput] = useState('');

    // Sets the users search value
    const handleSearchInput = useCallback(
        (event) => {
            setSearchInput(event.target.value);
        }, []
    )

    // Fetches search response
    const getSearchResponse = useCallback(async (offsetNum = 0, tracksPerPage = 1) => {
        const off = offsetNum * tracksPerPage
        console.log(off, offsetNum, tracksPerPage)
        const userProfile = await getUserProfile();
        let queryParams = new URLSearchParams({
            q: searchInput,
            type: 'track',
            limit: 50,
            market: userProfile.country,
            offset: offsetNum * tracksPerPage
        });

        try {
            const searchResult = await makeSpotifyRequest(`search?${queryParams.toString()}`, 'GET')
            onSearchResults(searchResult.tracks.items)
            

        } catch (error) {
            console.error('Error fetching search results:', error);
        }

    }, [searchInput, onSearchResults, tracksPerPage])

    // Function for button search to call
    const handleSearch = (event) => {
        event.preventDefault();
        getSearchResponse();
    }

    return (
       <div className='displaySearchBar'>
            <form className='searchForm' onSubmit={handleSearch}>
                <input
                    type= 'text'
                    placeholder='Search tracks'
                    onChange={handleSearchInput}
                    value={searchInput}

                />
                <button type='submit'>Search</button>
            </form>
       </div> 
    )
}

export default SearchBar;

