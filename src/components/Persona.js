import React from 'react';
import defaultAvatar from '../graphics/penguin.png';
import exitIcon from '../graphics/logout.svg';
import descIcon from '../graphics/desc.svg';

const Persona = ({user, history, showDescription, toggleShowDescription}) => {
    
    return ( 
        <div id="persona">
            <div id="round">
                {(user.images.length ? (
                    <img src={user.images[0]} alt="persona" width="40px" height="40px"></img>
                ) : (
                    <img src={defaultAvatar} alt="persona" width="40px" height="40px"></img>
                ))}
            </div>
            <div id="user-info">
                <h4>{user.display_name}</h4>
                <p>Special person</p>
            </div>
            <img id="desc" src={descIcon} alt="description" title="Description" width="20px" height="20px" onClick={() => {
                toggleShowDescription(!showDescription);
            }}></img>
            <img id="exit" src={exitIcon} alt="exit" title="Logout" width="20px" height="20px" onClick={() => {
                history.push("/");
            }}></img>
        </div>
     );
}
 
export default Persona;