import React from 'react';
import defaultAvatar from '../graphics/penguin.png';
import exitIcon from '../graphics/logout.svg';



const Persona = ({user, history}) => {
    const frag = localStorage.getItem("frag");
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
                <p>{user.description ? (user.description.length > 31 ? user.description.substring(0, 30) + ".." : user.description) : "Special person"}</p>
            </div>
            <img id="exit" src={exitIcon} alt="exit" title="Logout" width="20px" height="20px" onClick={() => {
                window.localStorage.clear();
                history.push("/");
            }}></img>
        </div>
     );
}
 
export default Persona;