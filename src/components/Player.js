import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from './Modal';
import Confirmation from './Confirmation';
import axios from 'axios';
import Playlist from './Playlist';
import Playbar from './Playbar';
import spotifyIcon from '../graphics/spotify.svg';
import TopBar from './TopBar';

const exportToSpotify = async (id, token, name, description, tracks, toggleShowConfirmation) => {
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
            toggleShowConfirmation(true);
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch(err => console.log(err));
};

const Player = ({mixProps, setMixProps}) => {

    const pName = mixProps ? mixProps.name : null;
    const pDes = mixProps ? mixProps.description : null;
    const [tracks, setTracks] = useState(mixProps.tracks);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};
    const accessToken = localStorage.getItem("token") ? localStorage.getItem("token") : null;
    const [selectedTrack, setSelectedTrack] = useState({track: tracks[0], isPlaying: false});
    const [showDescription, toggleShowDescription] = useState(false);
    const [showConfirmation, toggleShowConfirmation] = useState(false);
    const [showMessage, toggleShowMessage] = useState(user.product !== "premium" ? true : false);
    const [progress, setProgress] = useState({});
    const history = useHistory();
   

    useEffect(() => {
        if (window.location.href.search("#access_token=") === -1) history.push("/");
        if (user.product === "premium") {

        }
    // eslint-disable-next-line
    }, []);

    return ( 
        <div className="pane" id="player">
            {(user) ? (
                <TopBar user={user} history={history} title={pName} showDescription={showDescription} toggleShowDescription={toggleShowDescription} 
                retPath="/menu" type={user.product === "premium" ? "player" : "free-player"} />
            ) : null}
            {(user) ? (
                <Playbar selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} progress={progress} setProgress={setProgress} />
            ) : (null)}
            {(user) ? (
                <Playlist user={user} token={accessToken} 
                selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} 
                tracks={tracks} setTracks={setTracks} progress={progress} setProgress={setProgress} />
            ) : null}
            <div id="bottom-tray">
                <img src={spotifyIcon} alt="spotify" id="spotify" title="Export to Spotify" width="35px" height="35px" onClick={() => {
                    let conf = window.confirm(`Export ${pName ? pName : "mix"} to Spotify playlist?`);
                    if (conf) exportToSpotify(user.id, accessToken, pName, pDes, tracks, toggleShowConfirmation);
                }}></img>
            </div>
            {showDescription ? (
                <Modal pName={pName} pDes={pDes} showDescription={showDescription} toggleShowDescription={toggleShowDescription} count={tracks.length} />
            ) : (null)}
            {showConfirmation ? (
                <Confirmation showConfirmation={showConfirmation} toggleShowConfirmation={toggleShowConfirmation} message={`Mixtape exported as playlist to Spotify`} />
            ) : (null)}
            {showMessage ? (
                <Confirmation showConfirmation={showMessage} toggleShowConfirmation={toggleShowMessage} 
                message={`Hey ${account.user && account.user.name ? account.user.name : (user ? user.display_name : "user")}
                , Mixtape cannot stream directly from a free Spotify Account, yet. 
                Click the spotify logo at the bottom to export this mix to Spotify and play it there.`} />
            ) : (null)}
        </div>
    );
}
 
export default Player;