import React, { useCallback, useState } from 'react';
import { getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';


const SearchBar = ({ onSearchResults }) => {

    const [searchInput, setSearchInput] = useState('');

    // Sets the users search value
    const handleSearchInput = useCallback(
        (event) => {
            setSearchInput(event.target.value);
        }, []
    )

    // Fetches search response
    const getSearchResponse = useCallback(async () => {

        const userProfile = await getUserProfile();
        let queryParams = new URLSearchParams({
            q: searchInput,
            type: 'track',
            market: userProfile.country
        });

        try {
            const searchResult = await makeSpotifyRequest(`search?${queryParams.toString()}`, 'GET')
            onSearchResults(searchResult.tracks.items)
            console.log(searchResult)

        } catch (error) {
            console.error('Error fetching search results:', error);
        }

    }, [searchInput, onSearchResults])

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

