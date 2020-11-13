import React, { useState } from 'react';
import addIcon from '../graphics/plus.svg';
import minusIcon from '../graphics/minus.svg';

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

const getArtists = (track, outputString = false) => {
    if (track.artists && track.artists[0].name) return track.artists.map(artist => artist.name).join(", ");
    if (outputString) return track.artists.join(", ");
    return track.artists.map(artist => artist.name);
};

const isAdded = (uri) => {
    let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
    let retVal = false;
    for (let elem of selectedTracks) {
        if (elem.uri === uri) {
            retVal = true;
            break;
        } 
    }
    return retVal
};

const addSelectedTrack = (track) => {
    let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
    localStorage.setItem("selectedTracks", JSON.stringify([...selectedTracks, track]));
};

const removeSelectedTrack = (track) => {
    let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
    let newTracks = selectedTracks.filter(sTrack => sTrack.uri !== track.uri);
    localStorage.setItem("selectedTracks", JSON.stringify(newTracks));
};



const Card = ({track, notifCount, setNotifCount}) => {

    
    const [checkAdded, toggleCheckAdded] = useState(isAdded(track.uri));

    return ( 
        <div className="track">
            <p className="title">{track.name}</p>
            <p className="artist">{getArtists(track, true)}</p>
            <p className="duration">{convertTime(track.duration_ms)}</p>
            {checkAdded ? (
                <button className="blank" onClick={(e) => {
                    e.stopPropagation();
                    toggleCheckAdded(false);
                    let newTrack = {
                        name: track.name,
                        artists: getArtists(track),
                        uri: track.uri,
                        duration_ms: track.duration_ms
                    };
                    setNotifCount(notifCount - 1);
                    removeSelectedTrack(newTrack);
                }}>
                    <img src={minusIcon} alt="remove" title="Remove from mix" width="16px" style={{transform: "translateY(8px)"}}></img>
                </button>
            ) : (
                <button className="blank" onClick={(e) => {
                    e.stopPropagation();
                    toggleCheckAdded(true);
                    let newTrack = {
                        name: track.name,
                        artists: getArtists(track),
                        uri: track.uri,
                        duration_ms: track.duration_ms
                    };
                    setNotifCount(notifCount + 1);
                    addSelectedTrack(newTrack);
                }}>
                    <img src={addIcon} alt="add" title="Add to mix" width="16px"></img>
                </button>
            )}
        </div>
    );
}
 
export default Card;