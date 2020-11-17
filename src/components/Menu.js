import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Persona from './Persona';
import Mixes from './Mixes';
import MixControls from './MixControls';
import Error from './Error';

const getFragment = (qString, history) => {
    if (qString) {
        if (qString.search("#access_token=") === -1) history.push("/");
        let startIndex = qString.indexOf("#");
        frag = qString.slice(startIndex);
        localStorage.setItem("frag", frag);
        startIndex += "#access_token=".length;
        let endIndex = qString.indexOf("&token_type");
        if (startIndex && endIndex) return qString.slice(startIndex, endIndex);
    }
    return null;
};

const registerUser = (name, spotifyId) => {
    axios.post(`http://mixtapeservice-env.eba-vhy557sq.us-west-2.elasticbeanstalk.com/users/create`, {
        name,
        spotifyId
    }).then((res) => {
        console.log(res);
        localStorage.setItem("account", JSON.stringify({user: {
            name,
            spotifyId
        }}));
    }).catch((err) => {
        console.log(err);
    });
};


let isLoggedIn = false;
let frag;

const Menu = ({mixProps, setMixProps}) => {

    const history = useHistory();
    const [showDescription, toggleShowDescription] = useState(false);
    const [allMixes, setAllMixes] = useState([]);
    const [selectedMix, setSelectedMix] = useState({});
    const [account, setAccount] = useState(null);
    const [errorText, setErrorText] = useState("");
    
    useEffect(() => {
        if (!isLoggedIn) {
            let qString = window.location.href;
            let token = getFragment(qString, history);
            if (token) {
                console.log(token);
                localStorage.setItem("token", token);
                isLoggedIn = true;
                axios.get(`https://api.spotify.com/v1/me`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                .then(res => {
                    console.log(res.data);
                    let username = res.data.display_name;
                    let spotifyId = res.data.id;
                    localStorage.setItem("user", JSON.stringify(res.data));
                    axios.get(`http://mixtapeservice-env.eba-vhy557sq.us-west-2.elasticbeanstalk.com/users/${res.data.id}`).then((res) => {
                        if (res.data) {
                            console.log(res.data);
                            if (res.data.user) {
                                setAllMixes(res.data.user.mixes);
                                setAccount(res.data.user);
                            }
                            localStorage.setItem("account", JSON.stringify(res.data));
                        } else registerUser(username, spotifyId);
                    }).catch(err => {
                        console.log(err);
                        registerUser(username, spotifyId);
                    });
                })
                .catch(err => {
                    console.log("Unable to fetch user: ", err);
                    history.push("/");
                });      
            }
        }
        return () => {
            isLoggedIn = false;
        }
    // eslint-disable-next-line
    }, [history]);

    useEffect(() => {
        if (errorText) {
            setTimeout(() => {
                setErrorText("");
            }, 4000);
        }
    });

    return ( 
        <div className="pane" id="menu">
            {(isLoggedIn && account) ? (
                <Persona user={account} history={history} showDescription={showDescription} toggleShowDescription={toggleShowDescription} isPlayer={false} />
            ) : null}
            <div id="menu-list">
                <p onClick={() => {
                    history.push("/search" + frag);
                }}>Search</p>
                {/*<p onClick={() => {
                    if (selectedMix) {
                        setMixProps(selectedMix);
                        history.push("/play" + frag);
                    } else {
                        if (allMixes && allMixes.length) setErrorText("First, tap on a mix to select it.");
                        else setErrorText("No mixes to play. Add one first.");
                    }
                }}>Player</p>*/}
                <p onClick={() => {
                    history.push("/profile" + frag);
                }}>My Profile</p>
                <p>{`My Mixes (${allMixes ? allMixes.length : 0})`}</p>
                <Mixes mixes={allMixes} selectedMix={selectedMix} setSelectedMix={setSelectedMix} allMixes={allMixes} setAllMixes={setAllMixes} setMixProps={setMixProps} />
                <MixControls selectedMix={selectedMix} setMixProps={setMixProps} allMixes={allMixes} setAllMixes={setAllMixes} setErrorText={setErrorText} />
                {errorText ? (
                    <Error text={errorText} />
                ) : (null)}
            </div>
        </div>
    );
}
 
export default Menu;
