import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Persona from './Persona';
import Playlist from './Playlist';
import Playbar from './Playbar';

const getFragment = (qString) => {
    if (qString) {
        let startIndex = qString.indexOf("#") + "#access_token=".length;
        let endIndex = qString.indexOf("&token_type");
        if (startIndex && endIndex) return qString.slice(startIndex, endIndex);
    }
    return null;
};

let isLoggedIn = false;
let accessToken;

const Player = () => {
    const [tracks, setTracks] = useState(require("../data/data.json").tracks);
    const [user, setUser] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState({track: tracks[0], isPlaying: false});
    const history = useHistory();
    
    useEffect(() => {
        if (!isLoggedIn) {
            let qString = window.location.href;
            let token = getFragment(qString)
            if (token) {
                console.log(token);
                accessToken = token;
                isLoggedIn = true;
                axios.get(`https://api.spotify.com/v1/me`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setUser(res.data);
                })
                .catch(err => console.log("Error retrieving user info ", err))               
            }
        }
        return () => {
            isLoggedIn = false;
        }
    }, []);

    return ( 
        <div className="pane" id="player">
            {(isLoggedIn && user) ? (
                <Persona user={user} history={history} />
            ) : null}
            {(isLoggedIn && user) ? (
                <Playbar selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} />
            ) : (null)}
            {(isLoggedIn && user) ? (
                <Playlist user={user} token={accessToken} 
                selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} />
            ) : null}
        </div>
    );
}
 
export default Player;