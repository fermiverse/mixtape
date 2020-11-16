import React from 'react';
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
    //let selectedTracks = localStorage.getItem("selectedTracks") ? JSON.parse(localStorage.getItem("selectedTracks")) : [];
    
    return ( 
        <div id="topbar">
            <img id="back" src={backIcon} alt="back" title="Back" width="20px" height="20px" onClick={() => {
                history.push(returnPath(retPath));
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