import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Lottie from 'react-lottie';
import axios from 'axios';
import Persona from './Persona';
import Mixes from './Mixes';
import MixControls from './MixControls';
import Confirmation from './Confirmation';
import Error from './Error';
import loadLottie from '../graphics/appLoader.json';
import copyIcon from '../graphics/copyIcon.svg';
import embedIcon from '../graphics/embed.svg';
import closeIcon from '../graphics/cancel.svg';

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
    axios.post(`http://localhost:8081/users/create`, {
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

    const options = {
        loop: true,
        autoplay: true,
        animationData: loadLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    let loggedIn = localStorage.getItem("isLoggedIn");
    const history = useHistory();
    const [showDescription, toggleShowDescription] = useState(false);
    const [allMixes, setAllMixes] = useState([]);
    const [selectedMix, setSelectedMix] = useState({});
    const [account, setAccount] = useState(null);
    const [errorText, setErrorText] = useState("");
    const [showLoader, toggleShowLoader] = useState(loggedIn === "true" ? false : true);
    const [shareLink, setShareLink] = useState(null);
    const [embedLink, setEmbedLink] = useState("");
    const [showPanel, toggleShowPanel] = useState(false);
    const [showConfirmation, toggleShowConfirmation] = useState(false);
    const [showDeleteConfirmation, toggleDeleteConfirmation] = useState(false);

    const processEmbed = async (url, spotifyId) => {
        if ((url.search("api.fermiverse.com") !== -1 || url.search("localhost") !== -1) && url.search("/sharing") !== -1) {
            let newUrl = url + `&to=${spotifyId}`;
            await axios.get(newUrl).then((res) => {
                toggleShowPanel(false);
                toggleShowConfirmation(true);
                setAccount({...account});
            }).catch((err) => {
                console.log(err);
                setErrorText("Unable to add mix");
            });
        } else setErrorText("Invalid embed url");
    };
    
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
                    axios.get(`http://localhost:8081/users/${res.data.id}`).then((res) => {
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
                if (!loggedIn) localStorage.setItem("isLoggedIn", "true");
            }
        }
        return () => {
            isLoggedIn = false;
        }
    // eslint-disable-next-line
    }, [history]);

    useEffect(() => {
        let timer;
        if (errorText) {
            timer = setTimeout(() => {
                setErrorText("");
            }, 4000);
        }
        return () => {
            clearTimeout(timer);
        }
    });

    useEffect(() => {
        let timer;
        if (showLoader) {
            timer = setTimeout(() => {
                toggleShowLoader(false);
            }, 4000);
        }
        return () => {
            clearTimeout(timer);
        }
    });

    return ( 
        <div className="pane" id="menu">
            {(isLoggedIn && account && !showLoader) ? (
                <Persona user={account} history={history} showDescription={showDescription} toggleShowDescription={toggleShowDescription} isPlayer={false} />
            ) : null}
            {showLoader ? (
                <div className="loader" style={{marginTop: "200px"}}>
                    <Lottie options={options} width="330px" height="auto" />
                </div>
            ) : (
                <div id="menu-list">
                    <p onClick={() => {
                        localStorage.removeItem("selectedTracks");
                        setMixProps({});
                        history.push("/search" + frag);
                    }}>Search</p>
                    <p onClick={() => {
                        history.push("/profile" + frag);
                    }}>My Profile</p>
                    <p>{`My Mixes (${allMixes ? allMixes.length : 0})`}</p>
                    <Mixes mixes={allMixes} selectedMix={selectedMix} setSelectedMix={setSelectedMix} 
                    allMixes={allMixes} setAllMixes={setAllMixes} setMixProps={setMixProps} toggleShowPanel={toggleShowPanel} />
                    <MixControls toggleDeleteConfirmation={toggleDeleteConfirmation} selectedMix={selectedMix} mixProps={mixProps} setMixProps={setMixProps} allMixes={allMixes} 
                    setAllMixes={setAllMixes} setErrorText={setErrorText} setShareLink={setShareLink}
                    setEmbedLink={setEmbedLink} spotifyId={account ? account.spotifyId : null} />
                    {errorText ? (
                        <Error text={errorText} />
                    ) : (null)}
                    {shareLink ? (
                        <div className="sharing">
                            {shareLink.slice(0, 46) + ".."}
                            <img src={copyIcon} alt="copy" width="17px" height="auto" onClick={() => {
                                navigator.clipboard.writeText(shareLink).then(() => {
                                    setErrorText("Copied to clipboard");
                                }).then(() => {
                                    setTimeout(() => {
                                        setShareLink(null);
                                    }, 3000);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }}></img>
                        </div>
                    ) : (null)}
                    {showPanel ? (
                        <div id="panel" style={{height: "250px"}}>
                            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                                toggleShowPanel(false);
                            }}></img>
                            <input type="text" id="embed-bar" required={true} spellCheck={false} autoComplete="off" placeholder="Paste an embed link.." value={embedLink} onChange={(e) => {
                                setEmbedLink(e.target.value);
                            }} />
                            <button className="blank" onClick={() => {
                                    if (embedLink && account && account.spotifyId) processEmbed(embedLink, account.spotifyId);
                                }}>
                                <img src={embedIcon} id="embed" alt="embed" width="24px" height="24px" title="Import mix"></img>
                            </button>
                            <p style={{color: "black"}}>OR</p>
                            <button id="buildMix" onClick={() => {
                                if (frag) history.push("/build" + frag);
                                else setErrorText("An error occurred");
                            }}>Make a new mix</button>
                        </div>
                    ) : (null)}
                    {showConfirmation ? (
                        <Confirmation message={"Mix successfully added"} showConfirmation={showConfirmation} toggleShowConfirmation={toggleShowConfirmation} />
                    ) : (null)}
                    {showDeleteConfirmation ? (
                        <Confirmation message={"Mix successfully deleted"} showConfirmation={showDeleteConfirmation} toggleShowConfirmation={toggleDeleteConfirmation} />
                    ) : (null)}
                </div>
            )}
        </div>
    );
}
 
export default Menu;
