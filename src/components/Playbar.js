import React from 'react';
import playIcon from '../graphics/play.svg';
import pauseIcon from '../graphics/pause.svg';
import nextIcon from '../graphics/next.svg';
import prevIcon from '../graphics/prev.svg';

const fetchArtists = (track) => {
    if (track && track.artists) {
        if (track.artists[0].name) return track.artists.map(artist => artist.name).join(", ");
        else return track.artists.join(", ");
    }
    return null;
};

const Playbar = ({selectedTrack, setSelectedTrack, tracks, setTracks}) => {
    return ( 
        <div id="playbar">
            <div id="play-btns">
                <img id="prev-btn" src={prevIcon} alt="prev" title="Previous" width="20px" height="20px" onClick={() => {
                    let i = tracks.indexOf(selectedTrack.track);
                    if (i > 0) setSelectedTrack({track: tracks[i-1], isPlaying: selectedTrack.isPlaying});
                }}></img>
                {selectedTrack.isPlaying ? (
                    <img id="pause-btn" src={pauseIcon} alt="pause" title="Pause" width="30px" height="30px" onClick={() => {
                        if (selectedTrack.track) setSelectedTrack({...selectedTrack, isPlaying: false});
                    }}></img>
                ) : (
                    <img id="play-btn" src={playIcon} alt="play" title="Play" width="30px" height="30px" onClick={() => {
                        if (selectedTrack.track) setSelectedTrack({...selectedTrack, isPlaying: true});
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