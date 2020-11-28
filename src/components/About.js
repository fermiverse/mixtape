import React from 'react';
import { useHistory } from 'react-router-dom';
import backIcon from '../graphics/back.svg';

const About = () => {
    const history = useHistory();
    return ( 
        <div className="pane">
            <button className="blank" style={{position: "absolute", top: "38px", left: "20px"}} onClick={() => {
                    history.push("/");
                }}>
                <img id="back" src={backIcon} alt="back" title="Back" width="20px" height="20px"></img>
            </button>
            <p id="title" style={{marginTop: "40px"}}>About</p>
            <div style={{maxWidth: "80%", fontSize: "13.7px"}}>
                <p>Mixtape is a playlist building app built on top of Spotify's brilliant, open API.</p>
                <p>It attempts to elevate the experience of designing playlists, allowing for a good degree of personalization.</p>
                <p>All you need to get started are:</p>
                <ul>
                    <li>Login credentials to your Spotify account</li>
                    <li>A special person to make mixtapes for (Not provided) *</li>
                    <li>A Spotify premium account allows for in-app playback **</li>
                </ul>
                <p>This is a completely free, non-commercial, open-source project with an interesting <span style={{color: "rgb(22, 177, 22)", textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                        history.push("/story");
                    }}>
                        origin story.
                    </span></p>
                <p>* It's alright if you don't, you're pretty damn special 😄</p>
                <p>** A free account does not give Mixtape streaming privileges</p>
            </div>
        </div>
    );
}
 
export default About;