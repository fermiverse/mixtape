import React, { useEffect } from 'react';
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

const convertTime = (msTime) => {
    if (msTime) {
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
        if (secs < 10) secs = "0" + secs.toString();
        return `0:${secs}`
    } else return `0:00`
};

const Playbar = ({selectedTrack, setSelectedTrack, tracks, setTracks, progress, setProgress}) => {
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
                    //console.log(presentState);
                    if (presentState.item.uri !== selectedTrack.uri) {
                        let trackObj = tracks.find((track) => {
                            return track.uri === presentState.item.uri
                        });
                        setSelectedTrack({isPlaying: presentState.is_playing, track: trackObj});
                    }
                    if (presentState.progress_ms) {
                        let newProg = {...progress};
                        newProg[selectedTrack.track.uri] = presentState.progress_ms;
                        setProgress(newProg);
                    }
                    //if (!presentState.is_playing) setSelectedTrack({...selectedTrack, isPlaying: false});
                }).catch((err) => {
                    console.log(err);
                }); 
            }, 1000);
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
                    if (i > 0) {
                        if (selectedTrack && selectedTrack.isPlaying) {
                            if (device_id && access_token) {
                                let pos = progress[tracks[i].uri];
                                if (pos && pos > 10000) {
                                    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                        uris: trackUris,
                                        offset: {
                                            uri: selectedTrack.track.uri
                                        },
                                        position_ms: 1
                                    }, {
                                        headers: {
                                            Authorization: "Bearer " + access_token
                                        }
                                    }).then((res) => {
                                        
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                } else {
                                    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                        uris: trackUris,
                                        offset: {
                                            uri: tracks[i-1].uri
                                        },
                                        position_ms: 1
                                    }, {
                                        headers: {
                                            Authorization: "Bearer " + access_token
                                        }
                                    }).then((res) => {
                                        setSelectedTrack({track: tracks[i-1], isPlaying: selectedTrack.isPlaying});
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                }
                            }
                        } else if (selectedTrack && !selectedTrack.isPlaying) setSelectedTrack({track: tracks[i-1], isPlaying: selectedTrack.isPlaying});
                    }
                }}></img>
                {selectedTrack.isPlaying ? (
                    <img id="pause-btn" src={pauseIcon} alt="pause" title="Pause" width="30px" height="30px" onClick={() => {
                        if (selectedTrack && device_id && access_token) {
                            axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {}, {
                                headers: {
                                    Authorization: "Bearer " + access_token
                                }
                            }).then((res) => {
                                axios.get(`https://api.spotify.com/v1/me/player`, {
                                    headers: {
                                        Authorization: "Bearer " + access_token
                                    }
                                }).then((res) => {
                                    
                                })
                                setSelectedTrack({...selectedTrack, isPlaying: false});
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                    }}></img>
                ) : (
                    <img id="play-btn" src={playIcon} alt="play" title="Play" width="30px" height="30px" onClick={() => {
                        if (selectedTrack && device_id && access_token) {
                            let pos = progress[selectedTrack.track.uri];
                            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                uris: trackUris,
                                offset: {
                                    uri: selectedTrack.track.uri
                                },
                                position_ms: pos ? pos : 1
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
                    if (i < tracks.length - 1) {
                        if (selectedTrack && selectedTrack.isPlaying) {
                            if (device_id && access_token) {
                                axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                                    uris: trackUris,
                                    offset: {
                                        uri: tracks[i+1].uri
                                    },
                                    position_ms: 1
                                }, {
                                    headers: {
                                        Authorization: "Bearer " + access_token
                                    }
                                }).then((res) => {
                                    setSelectedTrack({track: tracks[i+1], isPlaying: selectedTrack.isPlaying});
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        } else if (selectedTrack && !selectedTrack.isPlaying) setSelectedTrack({track: tracks[i+1], isPlaying: selectedTrack.isPlaying});
                    }
                }}></img>
            </div>
            <div id="progress-container">
                <p>{convertTime(progress[selectedTrack.track.uri])}</p>
                <div id="progress-bar" onClick={(e) => {
                    let pgDiv = document.getElementById("progress-bar");
                    let rect = pgDiv.getBoundingClientRect();
                    
                    if (selectedTrack && selectedTrack.isPlaying && device_id && access_token) {
                        let pos = selectedTrack.track.duration_ms * (e.clientX - rect.left) / pgDiv.clientWidth;
                        axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                            uris: trackUris,
                            offset: {
                                uri: selectedTrack.track.uri
                            },
                            position_ms: pos
                        }, {
                            headers: {
                                Authorization: "Bearer " + access_token
                            }
                        }).then((res) => {
                            
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }}>
                    <div id="progress-tracker" style={{width: (100 * (progress[selectedTrack.track.uri] ? progress[selectedTrack.track.uri] : 0) / selectedTrack.track.duration_ms) + "%"}}></div>
                </div>
                <p>{convertTime(selectedTrack.track.duration_ms)}</p>
            </div>
            <div id="active-track">
                {`${selectedTrack.track.name} - ${fetchArtists(selectedTrack.track)}`}
            </div>
        </div>
    );
}
 
export default Playbar;