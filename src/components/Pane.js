import React from 'react';
import axios from 'axios';
import uuidv4 from 'react-uuid';
import casetteImage from '../graphics/casette.svg';


const authorize = async () => {
    await axios.get(`https://accounts.spotify.com/authorize`, {
        params: {
            client_id: "8ce69e43f7bc4fc68b3197dc60f1a821",
            response_type: "token",
            redirect_uri: "https://affectionate-hopper-f81afb.netlify.app/",
            scope: "user-read-private user-read-email",
            state: uuidv4()
        }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log("Error reaching spotify", err);
    });
}
const Pane = () => {

    return ( 
        <div id="pane">
            <div style={{position: "absolute", top: "30px"}}>
                <h1 id="main">mixtape</h1>
                <div id="msg">Hi PT, this is a little playlist I made to keep you company on your journey home</div>
            </div>
            <img id="mix" src={casetteImage} alt="start" title="mixtape" width="100%"></img>
            <button id="spot" onClick={(e) => {
                authorize();
            }}>Connect Spotify</button>
        </div>
    );
}
 
export default Pane;