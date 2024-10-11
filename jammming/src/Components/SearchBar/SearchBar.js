import React, { useCallback, useState } from 'react';
import { getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';


const SearchBar = ({ onSearchResults }) => {
    const [searchInput, setSearchInput] = useState('');

    const handleSearchInput = useCallback(
        (event) => {
            setSearchInput(event.target.value);
        }, []
    )

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

    const handleSearch = (event) => {
        event.preventDefault();
        getSearchResponse();
    }

    return (
       <div>
            <form onSubmit={handleSearch}>
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

