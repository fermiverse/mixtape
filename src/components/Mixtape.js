import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { useHistory } from 'react-router-dom';
import loadLottie from '../graphics/heart.json';
import SearchResults from './SearchResults';
import Tape from './Tape';
import TopBar from './TopBar';

const addMix = async (currentMix, user) => {
    let retVal = false;
    await axios.post(`http://localhost:8081/users/${user.id}/mixes/add`, {mix: currentMix}).then((res) => {
        console.log(res);
        retVal = true;
    }).catch((err) => {
        console.log(err);
    });
    return retVal;
};

const returnPath = (path) => {
    const frag = localStorage.getItem("frag");
    if (frag) {
        return path + frag
    }
    return "/"
};

const Mixtape = ({mixProps, setMixProps}) => {
    const options = {
        loop: true,
        autoplay: true,
        animationData: loadLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    //let account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : null;
    const history = useHistory();
    let currentMix = localStorage.getItem("currentMix") ? JSON.parse(localStorage.getItem("currentMix")) : {};
    const [notifCount, setNotifCount] = useState(currentMix.tracks ? currentMix.tracks.length : 0);
    const [showLoader, toggleShowLoader] = useState(false);

    useEffect(() => {
        if (showLoader) {
            setTimeout(() => {
                toggleShowLoader(false);
            }, 3000);
            setTimeout(() => {
                history.push(returnPath("/menu"));
            }, 4000);
        }
    }, [showLoader, history]);

    return ( 
        <div className="pane">
            <TopBar user={user} history={history} type="nav" retPath="/search" />
            {!showLoader && (
                <Tape cover={currentMix.cover} name={currentMix.name} />
            )}
            {!showLoader && (
                <SearchResults searchResults={currentMix.tracks} notifCount={notifCount} setNotifCount={setNotifCount} type={1} />
            )}
            {!showLoader && (
                <button id="build" title="Ship" onClick={() => {
                    if (user && user.id && user.display_name) {
                        currentMix["from"] = {
                            name: user.display_name,
                            spotifyId: user.id
                        };
                        addMix(currentMix, user);
                        toggleShowLoader(true);
                    }
                }}>Ship</button>
            )}
            {showLoader && (
                <div className="loader">
                    <Lottie options={options} width="200px" height="auto" />
                </div>
            )}
        </div>
    );
}
 
export default Mixtape;