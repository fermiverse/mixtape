import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Lottie from 'react-lottie';
import happyLottie from '../graphics/happy.json';

const Sharing = () => {

    const history = useHistory();

    const options = {
        loop: true,
        autoplay: true,
        animationData: happyLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    useEffect(() => {
        let url = new URL(window.location.href);
        let from = url.searchParams.get("from");
        let mix = "mix_" + url.searchParams.get("mix");
        localStorage.setItem("sharedMix", JSON.stringify({from, mix}));
        setTimeout(() => {
            history.push("/");
        }, 3000);
    }, [history]);

    return ( 
        <div className="pane">
            <div className="loader" style={{marginTop: "150px"}}>
                <Lottie options={options} width="200px" height="auto" />
            </div>
            <p style={{fontSize: "14px"}}>Someone special made you a mix.</p>
        </div>
    );
}
 
export default Sharing;