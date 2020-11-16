import React from 'react';
import defaultAvatar from '../graphics/penguin.png';
import exitIcon from '../graphics/logout.svg';

const frag = localStorage.getItem("frag");

const Persona = ({user, history}) => {
    
    return ( 
        <div id="persona">
            <div id="round">
                {(user.cover ? (
                    <img src={user.cover} alt="persona" width="40px" height="40px" onClick={() => {
                        if (frag) history.push("/profile" + frag);
                        else history.push("/");
                    }}></img>
                ) : (
                    <img src={defaultAvatar} alt="persona" width="40px" height="40px" onClick={() => {
                        if (frag) history.push("/profile" + frag);
                        else history.push("/");
                    }}></img>
                ))}
            </div>
            <div id="user-info">
                <h6>{user.name ? user.name : "Anon"}</h6>
                <p>{user.description ? user.description : "Special person"}</p>
            </div>
            <img id="exit" src={exitIcon} alt="exit" title="Logout" width="20px" height="20px" onClick={() => {
                history.push("/");
            }}></img>
        </div>
     );
}
 
export default Persona;