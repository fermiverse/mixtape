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
import { SERVER_URL } from '../constants/Base';
import copyIcon from '../graphics/copyIcon.svg';
import embedIcon from '../graphics/embed.svg';
import closeIcon from '../graphics/cancel.svg';
import Playboard from './Playboard';

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
    axios.post(`${SERVER_URL}users/create`, {
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

const reducePlaylists = (playlists) => {
    return playlists.map(playlist => {
        let {name, description, id, uri, tracks} = playlist;
        return {name, description, id, uri, tracks}
    })
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
    const [allPlaylists, setAllPlaylists] = useState([]);
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
        let retVal = false;
        if ((url.search("mixtape.fermiverse.com") !== -1 || url.search("localhost") !== -1) && url.search("/sharing") !== -1) {
            let newUrl = new URL(url);
            let from = newUrl.searchParams.get("from");
            let mix = newUrl.searchParams.get("mix");
            if (mix.search("mix_") === -1) mix = "mix_" + mix;
            newUrl = `https://api.fermiverse.com/sharing/?from=${from}&mix=${mix}&to=${spotifyId}`;
            await axios.get(newUrl).then((res) => {
                toggleShowPanel(false);
                retVal = true;
            }).catch((err) => {
                console.log(err);
                setErrorText("Unable to add mix");
            });
        } else setErrorText("Invalid embed url");
        return retVal;
    };
    
    useEffect(() => {
        if (!isLoggedIn) {
            let qString = window.location.href;
            let token = getFragment(qString, history);
            if (token) {
                if (!loggedIn) localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("token", token);
                isLoggedIn = true;
                axios.get(`https://api.spotify.com/v1/me`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                .then(res => {
                    //console.log(res.data);
                    let username = res.data.display_name;
                    let spotifyId = res.data.id;
                    localStorage.setItem("user", JSON.stringify(res.data));
                    axios.get(`${SERVER_URL}users/${res.data.id}`).then((res) => {
                        if (res.data) {
                            console.log(res.data);
                            if (res.data.user) {
                                setAllMixes(res.data.user.mixes);
                                setAccount(res.data.user);
                            }
                            localStorage.setItem("account", JSON.stringify(res.data));
                            let sharedMix = localStorage.getItem("sharedMix") ? JSON.parse(localStorage.getItem("sharedMix")) : {};
                            if (sharedMix.from && sharedMix.mix && sharedMix.from !== spotifyId) {
                                if (processEmbed(`https://mixtape.fermiverse.com/sharing/?from=${sharedMix.from}&mix=${sharedMix.mix}`, spotifyId)) {
                                    setTimeout(() => {
                                        toggleShowConfirmation(true)
                                    }, 1000);
                                }
                            }
                            localStorage.removeItem("sharedMix");
                        } else registerUser(username, spotifyId);
                    }).catch(err => {
                        console.log(err);
                        registerUser(username, spotifyId);
                    });
                    axios.get(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }).then((res) => {
                        if (res.data && res.data.items) {
                            setAllPlaylists(reducePlaylists(res.data.items));
                        }
                    }).catch((err) => {
                        console.log(err);
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
            }, 3000);
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
                    <MixControls toggleDeleteConfirmation={toggleDeleteConfirmation} selectedMix={selectedMix} mixProps={mixProps} 
                    setMixProps={setMixProps} allMixes={allMixes} 
                    setAllMixes={setAllMixes} setErrorText={setErrorText} setShareLink={setShareLink}
                    setEmbedLink={setEmbedLink} spotifyId={account ? account.spotifyId : null} />
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
                    {errorText ? (
                        <Error text={errorText} />
                    ) : (null)}
                    <Playboard spotifyId={account ? account.spotifyId : null} token={getFragment(window.location.href, history)} 
                    allPlaylists={allPlaylists} setAllPlaylists={setAllPlaylists} setMixProps={setMixProps} />
                    {showPanel ? (
                        <div id="panel" style={{height: "250px"}}>
                            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                                toggleShowPanel(false);
                            }}></img>
                            <input type="text" id="embed-bar" required={true} spellCheck={false} autoComplete="off" placeholder="Paste an embed link.." value={embedLink} onChange={(e) => {
                                setEmbedLink(e.target.value);
                            }} />
                            <button className="blank" onClick={async () => {
                                    if (embedLink && account && account.spotifyId) {
                                        if (await processEmbed(embedLink, account.spotifyId)) {
                                            setTimeout(() => {
                                                toggleShowConfirmation(true)
                                            }, 1000);
                                        }
                                    }
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
                        <Confirmation message={"Mix successfully added"} showConfirmation={showConfirmation} toggleShowConfirmation={toggleShowConfirmation} type={"add"} />
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
