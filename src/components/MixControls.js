import React from 'react';
import editIcon from '../graphics/edit.svg';
import playIcon from '../graphics/playMix.svg';
import deleteIcon from '../graphics/delete.svg';
import shareIcon from '../graphics/share.svg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { SERVER_URL } from '../constants/Base';

const deleteMix = (mix, account) => {
    let retVal = false;
    if (mix.name) {
        if (account && account.user && account.user.spotifyId) {
            let conf = window.confirm(`Delete ${mix.name} permanently?`);
            if (conf) {
                axios.post(`${SERVER_URL}users/${account.user.spotifyId}/mixes/delete`, {mix: mix}).then((res) => {
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

const generateEmbed = (mix, spotifyId) => {
    if (spotifyId) {
        return `https://api.fermiverse.com/sharing/?from=${spotifyId}&mix=${mix.id}`
    } else return null;
};



const MixControls = ({selectedMix, setMixProps, allMixes, setAllMixes, setErrorText, setShareLink, spotifyId}) => {
    const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};
    const history = useHistory();
    const frag = localStorage.getItem("frag");
    return (  
        <div id="mix-controls">
            <button className="blank" title="Edit mix" onClick={() => {
                if (selectedMix.name) {
                    if (frag) {
                        localStorage.removeItem("currentMix");
                        localStorage.setItem("selectedTracks", JSON.stringify(selectedMix.tracks));
                        let newMixProps = {...selectedMix};
                        setMixProps(newMixProps);
                        history.push("/build" + frag);
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
                    setShareLink(generateEmbed(selectedMix, spotifyId));
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={shareIcon} alt="share" width="21px" height="21px"></img>
            </button>
            <button className="blank" title="Play mix" onClick={(e) => {
                if (selectedMix.name) {
                    setMixProps(selectedMix);
                    if (frag) history.push("/play" + frag);
                    else history.push("/");
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={playIcon} alt="play" width="27px" height="27px"></img>
            </button>
            <button className="blank" title="Delete mix" onClick={() => {
                if (selectedMix.name) {
                    deleteMix(selectedMix, account);
                    let newMixes = allMixes.filter(mix => mix.id === selectedMix.id);
                    setAllMixes(newMixes);
                    setMixProps({});
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