import React from 'react';
import closeIcon from '../graphics/cancel.svg';

const Modal = ({showConfirmation, toggleShowConfirmation, message}) => {
    return ( 
        <div id="modal">
            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                toggleShowConfirmation(false);
            }}></img>
            <p id={`pdes`}>{message.slice(0, 80)}</p>
        </div>
    );
}
 
export default Modal;