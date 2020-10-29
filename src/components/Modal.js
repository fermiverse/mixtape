import React from 'react';
import closeIcon from '../graphics/cancel.svg';

const Modal = ({pName, pDes, showDescription, toggleShowDescription, count}) => {
    return ( 
        <div id="modal">
            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                toggleShowDescription(false);
            }}></img>
            <h4 id={`pname`}>{pName}</h4>
            <p id={`pdes`}>{pDes}</p>
            <p id={`pcount`}>{`${count} tracks`}</p>
        </div>
    );
}
 
export default Modal;