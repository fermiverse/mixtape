import React from 'react';
import editIcon from '../graphics/edit.svg';
import playIcon from '../graphics/playMix.svg';
import deleteIcon from '../graphics/delete.svg';
import shareIcon from '../graphics/share.svg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const deleteMix = (mix, account) => {
    let retVal = false;
    if (mix.name) {
        if (account && account.user && account.user.spotifyId) {
            let conf = window.confirm(`Delete ${mix.name} permanently?`);
            if (conf) {
                axios.post(`http://localhost:8081/users/${account.user.spotifyId}/mixes/delete`, {mix: mix}).then((res) => {
                    console.log(res)
                    retVal = true;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
    return retVal;
};

const frag = localStorage.getItem("frag");

const MixControls = ({selectedMix, setMixProps, allMixes, setAllMixes, setErrorText}) => {
    const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};
    const history = useHistory();
    
    return (  
        <div id="mix-controls">
            <button className="blank" title="Edit mix" onClick={() => {
                if (selectedMix.name) {
                    if (frag) {
                        let newMixProps = {...selectedMix};
                        setMixProps(newMixProps);
                        history.push("/build" + frag);
                        localStorage.removeItem("currentMix");
                    }
                    else history.push("/");
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={editIcon} alt="edit" width="20px" height="20px"></img>
            </button>
            <button className="blank" title="Share mix" onClick={(e) => {
                if (selectedMix.name) {
                    console.log("doooodooo")
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={shareIcon} alt="share" width="21px" height="21px"></img>
            </button>
            <button className="blank" title="Play mix" onClick={(e) => {
                if (selectedMix.name) {
                    setMixProps(selectedMix);
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={playIcon} alt="play" width="27px" height="27px"></img>
            </button>
            <button className="blank" title="Delete mix" onClick={() => {
                if (selectedMix.name) {
                    if (deleteMix(selectedMix, account)) {
                        let newMixes = allMixes.filter(mix => mix.id === selectedMix.id);
                        setAllMixes(newMixes);
                        setMixProps({});
                    } else console.log("Failed to remove");
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={deleteIcon} alt="delete" width="22px" height="22px"></img>
            </button>
        </div>
    );
}
 
export default MixControls;