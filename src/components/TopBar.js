import React from 'react';
import axios from 'axios';
import exitIcon from '../graphics/logout.svg';
import descIcon from '../graphics/desc.svg';
import backIcon from '../graphics/back.svg';
import mixIcon from '../graphics/lilmix.svg';

const returnPath = (path) => {
    const frag = localStorage.getItem("frag");
    if (frag) {
        return path + frag
    }
    return "/"
};

const TopBar = ({type, history, showDescription, toggleShowDescription, title, notifs, retPath}) => {
    let device_id = localStorage.getItem("device_id");
    let access_token = localStorage.getItem("token");
    
    return ( 
        <div id="topbar">
            <img id="back" src={backIcon} alt="back" title="Back" width="20px" height="20px" onClick={() => {
                if (type === "player") {
                    if (device_id && access_token) {
                        axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {}, {
                            headers: {
                                Authorization: "Bearer " + access_token
                            }
                        }).then((res) => {
                            history.push(returnPath(retPath));
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }
                else history.push(returnPath(retPath));
            }}></img>
            <p id="title">{title}</p>
            {type === "nav" ? (
                <img id="lmix" src={mixIcon} alt="mix" title="Mixtape" width="28px" onClick={() => {
                    history.push(returnPath("/ship"));
                }}></img>
            ) : (
                <img id="desc" src={descIcon} alt="description" title="Description" width="20px" height="20px" onClick={() => {
                    toggleShowDescription(!showDescription);
                }}></img>
            )}
            {type === "nav" && notifs ? (
                <div id="notif">{notifs}</div>
            ) : (null)}
            <img id="exit" src={exitIcon} alt="exit" title="Logout" width="20px" height="20px" onClick={() => {
                window.localStorage.clear();
                history.push("/");
            }}></img>
        </div>
     );
}
 
export default TopBar;