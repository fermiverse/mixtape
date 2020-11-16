import React from 'react';
import Card from './Card';
import uuid from 'react-uuid';

const SearchResults = ({searchResults, setSearchResults, mixProps, setMixProps, notifCount, setNotifCount, type}) => {
    
    return ( 
        searchResults ? (
            type ? (
                <div id="results" style={{height: "270px"}}>
                    {searchResults.map(track => (
                        <Card key={uuid()} track={track} mixProps={mixProps} setMixProps={setMixProps} notifCount={notifCount} setNotifCount={setNotifCount} />
                    ))}
                </div>
            ) : (
                <div id="results">
                    {searchResults.map(track => (
                        <Card key={uuid()} track={track} mixProps={mixProps} setMixProps={setMixProps} notifCount={notifCount} setNotifCount={setNotifCount} />
                    ))}
                </div>
            )
        ) : (null)
    );
}
 
export default SearchResults;