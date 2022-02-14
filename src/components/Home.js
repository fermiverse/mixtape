import React from 'react';
/* import { useHistory } from 'react-router-dom';
import uuidv4 from 'react-uuid';
import casetteImage from '../graphics/mix.svg';
import aboutIcon from '../graphics/about.svg';
import storyIcon from '../graphics/story.svg';
import gitIcon from '../graphics/github.svg'; */

/* const queryString = (options) => {
    let {client_id, response_type, redirect_uri, state} = options
    return (
        `https://accounts.spotify.com/authorize?`
        + `client_id=${client_id}`
        + `&response_type=${response_type}`
        + `&redirect_uri=${redirect_uri}`
        + `&state=${state}`
        + `&scope=streaming user-read-playback-state user-modify-playback-state user-read-email user-read-private playlist-modify-public playlist-modify-private`
    )
} */

/* const authorize = () => {
    const options = {
        client_id: "8ce69e43f7bc4fc68b3197dc60f1a821",
        response_type: "token",
        redirect_uri: "https://mixtape.fermiverse.com/menu/",
        state: uuidv4()
    };
    window.location = queryString(options);
}; */

const Pane = () => {

    /* const history = useHistory(); */

    return ( 
        <div className="pane">
            <div style={{position: "absolute", top: "30px"}}>
                <div id="msg">We're currently under maintenance</div>
            </div>
            {/* <div style={{position: "absolute", top: "30px"}}>
                <h1 id="main">mixtape</h1>
                <div id="msg">A fun way of celebrating equations</div>
            </div>
            <div id="direct">
                <div className="mixed-btn">
                    <button className="blank" onClick={() => {
                        history.push("/about");
                    }}>
                        <img src={aboutIcon} alt="delete" width="25px" height="25px"></img>
                    </button>
                    <p onClick={() => {
                        history.push("/about");
                    }}>About</p>
                </div>
                <div className="mixed-btn">
                    <button className="blank" onClick={() => {
                        history.push("/story");
                    }}>
                        <img src={storyIcon} alt="delete" width="28px" height="28px"></img>
                    </button>
                    <p onClick={() => {
                        history.push("/story");
                    }}>Story</p>
                </div>
                <div className="mixed-btn">
                    <button className="blank" onClick={() => {
                        window.location.href = "https://github.com/fermiverse/mixtape";
                    }}>
                        <img src={gitIcon} alt="delete" width="25px" height="25px"></img>
                    </button>
                    <p onClick={() => {
                        window.location.href = "https://github.com/fermiverse/mixtape";
                    }}>Github</p>
                </div>
            </div>
            <img id="mix" src={casetteImage} alt="start" title="mixtape" width="60%" height="auto"></img>
            <button id="spot" onClick={(e) => {
                authorize();
            }}>Connect Spotify</button>
            <p className="info">To use Mixtape, connect a valid Spotify account</p> */}
        </div>
    );
}
 
export default Pane;