import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';
//import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import TopBar from './TopBar';
//import MixContextProvider from '../contexts/MixContext';
import uuid from 'react-uuid';


const queryString = (q) => {
    return q.trim().replace(" ", "%20");
};

const filterString = (filters) => {
    return filters.join(",");
};

const getTrackCount = () => {
    let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
    return selectedTracks.length;
};

//let currentMix = localStorage.getItem("currentMix") ? JSON.parse(localStorage.getItem("currentMix")) : {};

const Search = ({mixProps, setMixProps}) => {
   
    const history = useHistory();
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notifCount, setNotifCount] = useState(getTrackCount());
    //const [selectedTracks, setSelectedTracks] = useState([]);
    //const [searchCategories, setSearchCategories] = useState({"tracks": true, "albums": true, "artists": true});

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (searchQuery.length > 1) {
            setTimeout(() => {
                axios.get(`https://api.spotify.com/v1/search`, {
                    headers: {
                        Authorization: "Bearer " + token
                    }, 
                    params: {
                        q: queryString(searchQuery),
                        type: filterString(["track"]),
                        limit: 25
                    }
                }).then((res) => {
                    if (res.data && res.data.tracks) {
                        setSearchResults(res.data.tracks.items);
                    }
                }).catch((err) => {
                    console.log("Error searching tracks: ", err);
                    history.push("/");
                });
                }, 200);
        }
    // eslint-disable-next-line
    }, [searchQuery]);

    useEffect(() => {
        if (window.location.href.search("#access_token=") === -1) history.push("/");
    // eslint-disable-next-line
    }, []);

    return ( 
        <div className="pane">
            {(user) ? (
                <TopBar user={user} history={history} type="nav" title={mixProps.name ? mixProps.name : null} notifs={notifCount} retPath="/build" />
            ) : null}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            searchResults={setSearchResults} setSearchResults={setSearchResults} />
            {/*<SearchFilters searchCategories={searchCategories} setSearchCategories={setSearchCategories} />*/}
            <SearchResults searchResults={searchResults} mixProps={mixProps} setMixProps={setMixProps} notifCount={notifCount} setNotifCount={setNotifCount} />
            {mixProps.name ? (
                <button id="build" onClick={() => {
                    //let currentMix = localStorage.getItem("currentMix") ? JSON.parse(localStorage.getItem("currentMix")) : {};
                    let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
                    let account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};
                    let frag = localStorage.getItem("frag") ? localStorage.getItem("frag") : "";
                    if (account && selectedTracks) {
                        if (mixProps.id) {
                            localStorage.setItem("currentMix", JSON.stringify({...mixProps, tracks: selectedTracks, from: {spotifyId: account.user.spotifyId}}));
                            setMixProps({...mixProps, tracks: selectedTracks, from: {spotifyId: account.user.spotifyId}});
                        } else {
                            localStorage.setItem("currentMix", JSON.stringify({...mixProps, tracks: selectedTracks, id: "mix_" + uuid(), from: {spotifyId: account.user.spotifyId}}));
                            setMixProps({...mixProps, tracks: selectedTracks, id: "mix_" + uuid(), from: {spotifyId: account.user.spotifyId}});
                        }
                        history.push("/ship" + frag);
                    } else {
                        if (frag) history.push("/menu" + frag);
                        else history.push("/");
                    }
                }}>{mixProps.id ? "Next" : "Build"}</button>
            ) : (null)}
        </div>
    );
}
 
export default Search;