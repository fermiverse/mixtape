import React from 'react';
import { useHistory } from 'react-router-dom';
import addIcon from '../graphics/addMix.svg';

const frag = localStorage.getItem("frag");

const Mixes = ({mixes}) => {
    const history = useHistory();
    
    return ( 
    <div className="mixes">
        <div className="casette">
            <img src={addIcon} alt="add" title="Add a mix" width="50px" height="50px" onClick={() => {
                history.push("/build" + frag);
            }}></img>
        </div>
    </div>
    );
}
 
export default Mixes;