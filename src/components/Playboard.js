import React from 'react';
import uuid from 'react-uuid';
import playIcon from '../graphics/playMix.svg';
//import vinylIcon from '../graphics/vinyl.svg';



const Playboard = ({spotifyId, token, allPlaylists, setAllPlaylists}) => {

    return ( 
        <div>
            <p>{`My Spotify Playlists (${allPlaylists.length})`}</p>
            <div className="playlists">
                {allPlaylists.map(playlist => (
                    <div key={uuid()} className="record">
                        <h4>{playlist.name}</h4>
                        <p style={{color: "rgb(150, 108, 4)"}}>{playlist.tracks.total + " tracks"}</p>
                        <img src={playIcon} alt="play" width="25px" height="auto"></img>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default Playboard;