import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';
import playIcon from '../graphics/playMix.svg';
//import vinylIcon from '../graphics/vinyl.svg';

const makeTrack = (rawTrack) => {
    let {name, id, duration_ms, uri, artists} = rawTrack.track;
    let newArtists = artists.map(artist => artist.name);
    return {name, id, duration_ms, uri, artists: newArtists};
};

const fetchPlaylistItems = async (url, token) => {
    let tracks = [];
    if (url && token) {
        await axios.get(url, {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                fields: "items(track(name, duration_ms, id, uri, artists(name)))"
            }
        }).then(res => {
            if (res.data && res.data.items) {
                tracks = res.data.items.map(item => makeTrack(item));
            }
        }).catch (err => {
            console.log(err);
        });
    }
    return tracks;
};


const Playboard = ({spotifyId, token, allPlaylists, setAllPlaylists, setMixProps}) => {

    const history = useHistory();
    let frag = localStorage.getItem("frag");

    return ( 
        <div>
            <p>{`My Spotify Playlists (${allPlaylists.length})`}</p>
            <div className="playlists">
                {allPlaylists.map(playlist => (
                    <div key={uuid()} className="record">
                        <h4>{playlist.name}</h4>
                        <p style={{color: "rgb(150, 108, 4)"}}>{playlist.tracks.total + " tracks"}</p>
                        <button className="blank" onClick={async () => {
                            let rtracks = await fetchPlaylistItems(playlist.tracks.href, token);
                            if (rtracks.length && frag) {
                                localStorage.setItem("currentMix", JSON.stringify({...playlist, tracks: rtracks}));
                                localStorage.setItem("selectedTracks", JSON.stringify(rtracks));
                                setMixProps({...playlist, tracks: rtracks});
                                history.push("/play" + frag);
                            } else {
                                history.push("/");
                            }
                        }}>
                            <img src={playIcon} alt="play" width="25px" height="auto"></img>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default Playboard;