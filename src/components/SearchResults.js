import React from 'react';
import Card from './Card';
import uuid from 'react-uuid';

const SearchResults = ({searchResults, setSearchResults, mixProps, setMixProps, notifCount, setNotifCount, type}) => {
    
    return ( 
        searchResults ? (
            type ? (
                <div id="results" style={{height: "270px"}}>
                    {searchResults.map(track => {
                        if (track && track.uri) return <Card key={uuid()} track={track} mixProps={mixProps} setMixProps={setMixProps} notifCount={notifCount} setNotifCount={setNotifCount} />
                        else return null
                    })}
                </div>
            ) : (
                <div id="results">
                    {searchResults.map(track => {
                        if (track && track.uri) return <Card key={uuid()} track={track} mixProps={mixProps} setMixProps={setMixProps} notifCount={notifCount} setNotifCount={setNotifCount} />
                        else return null
                    })}
                </div>
            )
        ) : (null)
    );
}
 
export default SearchResults;