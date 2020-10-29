import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import Persona from './Persona';
import Playlist from './Playlist';
import Playbar from './Playbar';
import spotifyIcon from '../graphics/spotify.svg';

const getFragment = (qString, history) => {
    if (qString) {
        if (qString.search("#access_token=") === -1) history.push("/");
        let startIndex = qString.indexOf("#") + "#access_token=".length;
        let endIndex = qString.indexOf("&token_type");
        if (startIndex && endIndex) return qString.slice(startIndex, endIndex);
    }
    return null;
};

const exportToSpotify = async (id, token, name, description, tracks) => {
    console.log(id, token)
    await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, {
        name,
        description
    }, {
        headers: {
            Authorization: "Bearer " + token,
            "content-type": "application/json"
        }
    })
    .then(res => {
        let playId = res.data ? res.data.id : null;
        axios.post(`https://api.spotify.com/v1/playlists/${playId}/tracks`, {
            uris: tracks.map(track => track.uri)
        }, {
            headers: {
                Authorization: "Bearer " + token,
                "content-type": "application/json"
            }
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch(err => console.log(err));
}

let isLoggedIn = false;
let accessToken;

const pName = require("../data/data.json").name;
const pDes = require("../data/data.json").description;


const Player = () => {
    const [tracks, setTracks] = useState(require("../data/data.json").tracks);
    const [user, setUser] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState({track: tracks[0], isPlaying: false});
    const [showDescription, toggleShowDescription] = useState(false);
    const history = useHistory();
    
    useEffect(() => {
        if (!isLoggedIn) {
            let qString = window.location.href;
            let token = getFragment(qString, history);
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
                <Persona user={user} history={history} showDescription={showDescription} toggleShowDescription={toggleShowDescription} />
            ) : null}
            <p id="title">{pName}</p>
            {(isLoggedIn && user) ? (
                <Playbar selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} />
            ) : (null)}
            {(isLoggedIn && user) ? (
                <Playlist user={user} token={accessToken} 
                selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} />
            ) : null}
            <div id="bottom-tray">
                <img src={spotifyIcon} alt="spotify" id="spotify" title="Export to Spotify" width="35px" height="35px" onClick={() => {
                    exportToSpotify(user.id, accessToken, pName, pDes, tracks);
                }}></img>
            </div>
            {showDescription ? (
                <Modal pName={pName} pDes={pDes} showDescription={showDescription} toggleShowDescription={toggleShowDescription} count={tracks.length} />
            ) : (null)}
        </div>
    );
}
 
export default Player;