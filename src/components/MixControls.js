import React from 'react';
import editIcon from '../graphics/edit.svg';
import playIcon from '../graphics/playMix.svg';
import deleteIcon from '../graphics/delete.svg';
import shareIcon from '../graphics/share.svg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { SERVER_URL } from '../constants/Base';

const deleteMix = async (mix, account, allMixes, setAllMixes, selectedMix) => {
    let retVal = false;
    if (mix.id) {
        if (account && account.user && account.user.spotifyId) {
            let conf = window.confirm(`Delete ${mix.name ? mix.name : "untitled mix"} permanently?`);
            if (conf) {
                await axios.post(`${SERVER_URL}users/${account.user.spotifyId}/mixes/delete`, {mix: mix}).then((res) => {
                    //console.log(res);
                    let newMixes = allMixes.filter(mix => mix.id !== selectedMix.id);
                    setAllMixes(newMixes);
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
    if (spotifyId && mix.id) {
        let segments = mix.id.split("_");
        let id = segments[segments.length - 1];
        return `https://mixtape.fermiverse.com/sharing?from=${spotifyId}&mix=${id}`
    } else return null;
};



const MixControls = ({selectedMix, mixProps, setMixProps, allMixes, setAllMixes, setErrorText, setShareLink, spotifyId, toggleDeleteConfirmation}) => {
    const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};
    const history = useHistory();
    const frag = localStorage.getItem("frag");
    return (  
        <div id="mix-controls">
            <button className="blank" title="Edit mix" onClick={() => {
                if (selectedMix.id) {
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
                if (selectedMix.id) {
                    setShareLink(generateEmbed(selectedMix, spotifyId));
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={shareIcon} alt="share" width="21px" height="21px"></img>
            </button>
            <button className="blank" title="Play mix" onClick={(e) => {
                if (selectedMix.id) {
                    setMixProps(selectedMix);
                    if (frag) history.push("/play" + frag);
                    else history.push("/");
                } else {
                    setErrorText("First, tap on a mix to select it");
                }
            }}>
                <img src={playIcon} alt="play" width="27px" height="27px"></img>
            </button>
            <button className="blank" title="Delete mix" onClick={async () => {
                if (selectedMix.id) {
                    if (await deleteMix(selectedMix, account, allMixes, setAllMixes, selectedMix)) {
                        setTimeout(() => {
                            toggleDeleteConfirmation(true);
                        }, 1000);
                    }
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