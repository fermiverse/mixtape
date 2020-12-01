import React from 'react';
import closeIcon from '../graphics/cancel.svg';

const Confirmation = ({showConfirmation, toggleShowConfirmation, message}) => {
    return ( 
        <div id="modal">
            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                toggleShowConfirmation(false);
            }}></img>
            <p id={`pdes`} style={{color: "rgb(77, 74, 74)"}}>{message.slice(0, 180)}</p>
        </div>
    );
}
 
export default Confirmation;