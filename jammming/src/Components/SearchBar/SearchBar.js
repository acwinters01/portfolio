import React, { useCallback, useEffect, useState, useRef } from 'react';
import { getUserProfile, makeSpotifyRequest } from '../Authorization/Requests';


const SearchBar = ({ onSearchResults, tracksPerPage, setSearchLoading}) => {

    const [searchInput, setSearchInput] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [showDropdown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);

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
        setShowDropDown(false);
    }

    const handleInputFocus = () => {
        setShowDropDown(true);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

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
            <div className='searchWithRecentContainer'>
                <form className='searchForm' onSubmit={handleSearch}>
                    <input
                        type= 'text'
                        placeholder='Search tracks'
                        onChange={handleSearchInput}
                        onFocus={handleInputFocus}
                        value={searchInput}

                    />
                    <button type='submit' id='searchButton'>Search</button>
                </form>

                <div className={`recentSearchesContainer ${showDropdown ? 'show' : ''}`} ref={dropdownRef}>
                    {recentSearches.length > 0 && (
                        <div className='recentSearches'>
                            {recentSearches.map((search, index) => (
                                <div className='singleSearch' key={`search-${index}`}>
                                    <p key={index} onClick={() => handleRecentSearchClick(search)}>{search}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
       </div> 
    );
};

export default SearchBar;
