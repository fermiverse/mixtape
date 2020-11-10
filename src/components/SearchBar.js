import React from 'react';
import searchIcon from '../graphics/search.svg';

const SearchBar = ({searchQuery, setSearchQuery, searchResults, setSearchResults, searchCategories}) => {
    return (
        <div id="search-bar-container">
            <input type="text" id="search-bar" autoComplete="off" placeholder="Search for a track.." value={searchQuery} onChange={(e) => {
                setSearchQuery(e.target.value);
            }} />
            <img src={searchIcon} alt="search" id="search-icon" title="Search" width="17px" height="17px"></img>
        </div>
    );
}
 
export default SearchBar;