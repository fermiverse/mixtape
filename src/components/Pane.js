import React from 'react';
import axios from 'axios';
import uuidv4 from 'react-uuid';
import casetteImage from '../graphics/casette.svg';

const Pane = () => {

    return ( 
        <div id="pane">
            <div style={{position: "absolute", top: "30px"}}>
                <h1 id="main">mixtape</h1>
                <div id="msg">Hi PT, this is a little playlist I made to keep you company on your journey home</div>
            </div>
            <img id="mix" src={casetteImage} alt="start" title="mixtape" width="100%"></img>
            <button id="spot">Connect Spotify</button>
        </div>
    );
}
 
export default Pane;