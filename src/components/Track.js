import React from 'react';
import axios from 'axios';
import heartIcon from '../graphics/love.svg';
import filledHeartIcon from '../graphics/newlove.svg';
import playingGif from '../graphics/playing.gif';

const convertTime = (msTime) => {
    let secs = Math.floor(msTime/1000);
    if (secs >= 60) {
        let mins = Math.floor(secs/60);
        secs = secs % 60
        if (secs < 10) secs = "0" + secs.toString();
        if (mins >= 60) {
            let hrs = Math.floor(mins/60);
            mins = mins % 60;
            if (mins < 10) mins = "0" + mins.toString();
            return `${hrs}:${mins}:${secs}`
        }
        return `${mins}:${secs}`
    }
    return `0:${secs}`
};

const fetchArtists = (track) => {
    if (track && track.artists) return track.artists.join(", ");
    return null;
};

let timer = 0;
let prevent = false;

const Track = ({track, tracks, setTracks, selectedTrack, setSelectedTrack, progress, setProgress}) => {
    let trackUris = tracks.map(track => track.uri);
    let device_id = localStorage.getItem("device_id");
    let access_token = localStorage.getItem("token");
    
    return ( 
        <div className="track" onDoubleClick={() => {
            clearTimeout(timer);
            prevent = true;
            let i = tracks.indexOf(track);
            let newTracks = [...tracks];
            newTracks.splice(i, 1, {...track, liked: track.liked ? false : true});
            setTracks(newTracks);
        }} onClick={() => {
            timer = setTimeout(() => {
                if (!prevent) {
                    if (selectedTrack && device_id && access_token && selectedTrack.track.uri !== track.uri) {
                        if (selectedTrack.isPlaying) {
                            //let pos = progress[selectedTrack.track.uri];
                            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                uris: trackUris,
                                offset: {
                                    uri: track.uri
                                },
                                position_ms: 1
                            }, {
                                headers: {
                                    Authorization: "Bearer " + access_token
                                }
                            }).then((res) => {
                                setSelectedTrack({track: track, isPlaying: true});
                            }).catch((err) => {
                                console.log(err);
                            });
                        } else {
                            setSelectedTrack({track: track, isPlaying: false});
                        }
                        
                    }                   
                }
                prevent = false;
            }, 100);            
        }}>
            <p className="title">{track.name}</p>
            <p className="artist">{fetchArtists(track)}</p>
            <p className="duration">{convertTime(track.duration_ms)}</p>
            {track.liked ? (
                <img src={filledHeartIcon} alt="heart" title="Like" width="20px" onClick={(e) => {
                    e.stopPropagation();
                    let i = tracks.indexOf(track);
                    let newTracks = [...tracks];
                    newTracks.splice(i, 1, {...track, liked: track.liked ? false : true});
                    setTracks(newTracks);
                }}></img>
            ) : (
                <img src={heartIcon} alt="heart" title="Like" width="20px" onClick={(e) => {
                    e.stopPropagation();
                    let i = tracks.indexOf(track);
                    let newTracks = [...tracks];
                    newTracks.splice(i, 1, {...track, liked: track.liked ? false : true});
                    setTracks(newTracks);
                }}></img>
            )}
            {(selectedTrack && track.name === selectedTrack.track.name && selectedTrack.isPlaying) ? (
                <img src={playingGif} alt="p" height="25px" width="25px" style={{position: "absolute", top: "16px", right: "54px"}}></img>
            ) : (null)}
        </div>
    );
}
 
export default Track;