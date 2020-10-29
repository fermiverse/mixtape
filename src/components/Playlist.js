//import axios from 'axios';
//import React, { useEffect, useState } from 'react';
import uuidv4 from 'react-uuid';
import Track from './Track';

/*const trackIds = ["2Ms33RTRCT6gArrpcrPxmo", "5Bh8l8evdBSIoaK6EP1bWI", "6dNJ3lasVLPd0078T9yqlm", "6qyiVa9YOwMT9Qjh083y1A",
"3mgLSInqc7J6JEN583cXY8", "3AhXZa8sUQht0UEdBJgpGc", "4FmCUATNIarCQh72JYdvnm", "7nzsY8vlnKdvGOEE0rjAXZ", "44alNkXsYnTyPnkMdohBcx", "6C7aTTCUWRK7dD379yUT3W", 
"3NGMMRXc5O7XVKVXFCcQ5f", "5XeFesFbtLpXzIVDNQP22n", "2RChe0r2cMoyOvuKobZy44"];*/

const Playlist = ({user, accessToken, selectedTrack, setSelectedTrack, tracks, setTracks}) => {

    /*useEffect(() => {
        axios.get(`https://api.spotify.com/v1/tracks`, {
            headers: {
                Authorization: "Bearer " + accessToken
            },
            params: {
                ids: trackIds
            }
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log("Error fetching tracks", err);
        });
    }, [accessToken])*/

    return ( 
        <div id="playlist">
            {tracks.length ? (tracks.map(track => (
                <Track key={uuidv4()} track={track} tracks={tracks} setTracks={setTracks} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} />
            ))) : (null)}
        </div>
    );
}
 
export default Playlist;