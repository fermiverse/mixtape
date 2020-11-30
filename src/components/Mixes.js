import React from 'react';
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';
import addIcon from '../graphics/addMix.svg';
import MixDescription from './MixDescription';

const defaultMixCover = "https://images.unsplash.com/photo-1606059979642-8390434af3d5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMXx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=60";

const Mixes = ({mixes, selectedMix, setSelectedMix, setMixProps, toggleShowPanel}) => {
    const frag = localStorage.getItem("frag");
    const history = useHistory();
    let revMixes = [...mixes];
    revMixes.reverse();
 
    return ( 
    <div className="mixes">
        <div className="casette" title="Add a mix" onClick={() => {
                setMixProps({});
                if (frag) {
                    toggleShowPanel(true);
                    //history.push("/build" + frag);
                    localStorage.removeItem("currentMix");
                    localStorage.removeItem("selectedTracks");
                }
                else history.push("/");
            }}>
            <img src={addIcon} alt="add" title="Add a mix" width="45px" height="45px"></img>
        </div>
        {revMixes.map(mix => (
            <div className={mix.id === selectedMix.id ? "selected-casette" : "casette"} key={uuid()} onClick={() => {
                localStorage.setItem("currentMix", JSON.stringify(mix));
                localStorage.setItem("selectedTracks", JSON.stringify(mix.tracks));
                setSelectedMix(mix.id === selectedMix.id ? {} : mix);
            }}>
                <img src={mix.cover ? mix.cover : defaultMixCover} alt="cover" title={mix.name} className={mix.id === selectedMix.id ? "widetape" : "sidetape"}></img>
                {mix.id === selectedMix.id ? (
                    <MixDescription mix={mix} />
                ) : (null)}
            </div>
        ))}
    </div>
    );
}
 
export default Mixes;