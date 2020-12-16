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

const getTitleString = (title) => {
    if (title && title.length > 20) return title.slice(0, 20) + "..";
    else if (title && title.length <= 20) return title;
    else return null;
};

const TopBar = ({type, history, showDescription, toggleShowDescription, title, notifs, retPath, isPlaying}) => {
    let device_id = localStorage.getItem("device_id");
    let access_token = localStorage.getItem("token");
    
    return ( 
        <div id="topbar">
            <img id="back" src={backIcon} alt="back" title="Back" width="20px" height="20px" onClick={async () => {
                if (type === "player" && isPlaying) {
                    if (device_id && access_token) {
                        await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {}, {
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
                else {
                    if (title) history.push(returnPath(retPath));
                    else history.push(returnPath("/menu"));
                }
            }}></img>
            <p id="title">{getTitleString(title)}</p>
            {type === "nav" ? (
                <img id="lmix" src={mixIcon} alt="mix" title="Mixtape" width="28px" onClick={() => {
                    if (title) history.push(returnPath("/ship"));
                }}></img>
            ) : (
                <img id="desc" src={descIcon} alt="description" title="Description" width="20px" height="20px" onClick={() => {
                    toggleShowDescription(!showDescription);
                }}></img>
            )}
            {type === "nav" && notifs ? (
                <div id="notif">{notifs}</div>
            ) : (null)}
            <img id="exit" src={exitIcon} alt="exit" title="Logout" width="20px" height="20px" onClick={async () => {
                window.localStorage.clear();
                if (type === "player" && isPlaying) {
                    if (device_id && access_token) {
                        await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {}, {
                            headers: {
                                Authorization: "Bearer " + access_token
                            }
                        }).then((res) => {
                            history.push("/");
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                } else history.push("/");
            }}></img>
        </div>
     );
}
 
export default TopBar;