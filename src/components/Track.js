import React, { useState } from 'react';
import Lottie from 'react-lottie';
import heartIcon from '../graphics/love.svg';
import filledHeartIcon from '../graphics/newlove.svg';
import playingLottie from '../graphics/playing.json';

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
}

const Track = ({track, tracks, setTracks, selectedTrack, setSelectedTrack}) => {
    const [liked, toggleLiked] = useState(track.liked ? track.liked : false);
    const options = {
        loop: true,
        autoplay: true,
        animationData: playingLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };
    return ( 
        <div className="track" onDoubleClick={() => {
            toggleLiked(!liked);
        }} onClick={() => {
            let isOn = selectedTrack.isPlaying;
            setSelectedTrack({track: track, isPlaying: isOn});
        }}>
            <p className="title">{track.name}</p>
            <p className="artist">{track.artists[0].name}</p>
            <p className="duration">{convertTime(track.duration_ms)}</p>
            {liked ? (
                <img src={filledHeartIcon} alt="heart" title="Like" width="20px" onClick={() => {
                    toggleLiked(!liked);
                }}></img>
            ) : (
                <img src={heartIcon} alt="heart" title="Like" width="20px" onClick={() => {
                    toggleLiked(!liked);
                }}></img>
            )}
            {(selectedTrack && track.name === selectedTrack.track.name && selectedTrack.isPlaying) ? (
                <div className="playing">
                    <Lottie options={options} height="30px" width="30px" />
                </div>
            ) : (null)}
        </div>
    );
}
 
export default Track;