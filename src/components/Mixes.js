import React from 'react';
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';
import addIcon from '../graphics/addMix.svg';
import MixDescription from './MixDescription';

const frag = localStorage.getItem("frag");

const Mixes = ({mixes, selectedMix, setSelectedMix, setMixProps}) => {
    const history = useHistory();
 
    return ( 
    <div className="mixes">
        <div className="casette" title="Add a mix" onClick={() => {
                setMixProps({});
                if (frag) {
                    history.push("/build" + frag);
                    localStorage.removeItem("currentMix");
                    localStorage.removeItem("selectedTracks");
                }
                else history.push("/");
            }}>
            <img src={addIcon} alt="add" title="Add a mix" width="45px" height="45px"></img>
        </div>
        {mixes.map(mix => (
            <div className={mix.id === selectedMix.id ? "selected-casette" : "casette"} key={uuid()} onClick={() => {
                localStorage.setItem("currentMix", JSON.stringify(mix));
                localStorage.setItem("selectedTracks", JSON.stringify(mix.tracks));
                setSelectedMix(mix.id === selectedMix.id ? {} : mix);
            }}>
                <img src={mix.cover} alt="cover" title={mix.name} className={mix.id === selectedMix.id ? "widetape" : "sidetape"}></img>
                {mix.id === selectedMix.id ? (
                    <MixDescription mix={mix} />
                ) : (null)}
            </div>
        ))}
    </div>
    );
}
 
export default Mixes;