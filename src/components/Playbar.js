import React, { useEffect, useState } from 'react';
import playIcon from '../graphics/play.svg';
import pauseIcon from '../graphics/pause.svg';
import nextIcon from '../graphics/next.svg';
import prevIcon from '../graphics/prev.svg';
import axios from 'axios';

const fetchArtists = (track) => {
    if (track && track.artists) {
        if (track.artists[0].name) return track.artists.map(artist => artist.name).join(", ");
        else return track.artists.join(", ");
    }
    return null;
};

const Playbar = ({selectedTrack, setSelectedTrack, tracks, setTracks, player}) => {
    let device_id = localStorage.getItem("device_id");
    let access_token = localStorage.getItem("token");
    let trackUris = tracks.map(track => track.uri);
    useEffect(() => {
        let timer;
        if (selectedTrack.isPlaying && access_token) {
            timer = setInterval(() => {
                axios.get(`https://api.spotify.com/v1/me/player`, {
                    headers: {
                        Authorization: "Bearer " + access_token
                    }
                }).then((res) => {
                    let presentState = res.data;
                    console.log(presentState);
                    //if (!presentState.is_playing) setSelectedTrack({...selectedTrack, isPlaying: false});
                }).catch((err) => {
                    console.log(err);
                }); 
            }, 2000);
        }
        return () => {
            clearInterval(timer);
        }
    });
    return ( 
        <div id="playbar">
            <div id="play-btns">
                <img id="prev-btn" src={prevIcon} alt="prev" title="Previous" width="20px" height="20px" onClick={() => {
                    let i = tracks.indexOf(selectedTrack.track);
                    if (i > 0) setSelectedTrack({track: tracks[i-1], isPlaying: selectedTrack.isPlaying});
                }}></img>
                {selectedTrack.isPlaying ? (
                    <img id="pause-btn" src={pauseIcon} alt="pause" title="Pause" width="30px" height="30px" onClick={() => {
                        if (player && selectedTrack && device_id && access_token) {
                            axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {}, {
                                headers: {
                                    Authorization: "Bearer " + access_token
                                }
                            }).then((res) => {
                                setSelectedTrack({...selectedTrack, isPlaying: false});
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                    }}></img>
                ) : (
                    <img id="play-btn" src={playIcon} alt="play" title="Play" width="30px" height="30px" onClick={() => {
                        if (player && selectedTrack && device_id && access_token) {
                            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                uris: trackUris,
                                offset: {
                                    uri: selectedTrack.track.uri
                                }
                            }, {
                                headers: {
                                    Authorization: "Bearer " + access_token
                                }
                            }).then((res) => {
                                setSelectedTrack({...selectedTrack, isPlaying: true});
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                    }}></img>
                )}
                <img id="next-btn" src={nextIcon} alt="next" title="Next" width="20px" height="20px" onClick={() => {
                    let i = tracks.indexOf(selectedTrack.track);
                    if (i < tracks.length - 1) setSelectedTrack({track: tracks[i+1], isPlaying: selectedTrack.isPlaying});
                }}></img>
            </div>
            <div id="active-track">
                {`${selectedTrack.track.name} - ${fetchArtists(selectedTrack.track)}`}
            </div>
        </div>
    );
}
 
export default Playbar;