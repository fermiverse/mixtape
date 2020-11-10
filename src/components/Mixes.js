import React from 'react';
import { useHistory } from 'react-router-dom';
import addIcon from '../graphics/addMix.svg';

const frag = localStorage.getItem("frag");

const Mixes = ({mixes}) => {
    const history = useHistory();
    console.log(mixes);
    return ( 
    <div className="mixes">
        {mixes.map(mix => (
            <div className="casette">
                <img src={mix.cover} alt="cover" title={mix.name} className="sidetape"></img>
            </div>
        ))}
        <div className="casette">
            <img src={addIcon} alt="add" title="Add a mix" width="45px" height="45px" onClick={() => {
                history.push("/build" + frag);
            }}></img>
        </div>
    </div>
    );
}
 
export default Mixes;