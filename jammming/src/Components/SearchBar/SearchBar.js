import React, { useCallback, useEffect, useState } from 'react';
import { getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';


const SearchBar = ({ onSearchResults, tracksPerPage, setSearchLoading}) => {

    const [searchInput, setSearchInput] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedSearches);
    }, [setRecentSearches]);

    // Sets the users search value
    const handleSearchInput = (event) => {
        const query = event.target.value;
        setSearchInput(query);

    };

    const handleRecentSearchClick = (search) => {
        setSearchInput(search);
        getSearchResponse(search);
    }

    // Fetches search response
    const getSearchResponse = useCallback(async (query = searchInput, offsetNum = 0, tracksPerPage = 1) => {
        setSearchLoading(true);
        const userProfile = await getUserProfile();
        let queryParams = new URLSearchParams({
            q: query,
            type: 'track',
            limit: 50,
            market: userProfile.country,
            offset: offsetNum * tracksPerPage
        });

        try {
            const searchResult = await makeSpotifyRequest(`search?${queryParams.toString()}`, 'GET')
            onSearchResults(searchResult.tracks.items)
            setSearchLoading(false);

            // Save the recent search
            const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(newRecentSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchLoading(false);
        }

    }, [searchInput, onSearchResults, recentSearches])

    // Function for button search to call
    const handleSearch = (event) => {
        event.preventDefault();
        getSearchResponse(searchInput);
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

            <div className='recentSearchesContainer'>
                {recentSearches.length > 0 && (
                    <div className='recentSearches'>
                        <p>Recent Searches</p>
                        {recentSearches.map((search, index) => (
                            <p key={index} onClick={() => handleRecentSearchClick(search)}>{search}</p>
                        ))}
                    </div>
                )}
            </div>
       </div> 
    );
};

export default SearchBar;
