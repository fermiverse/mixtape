import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from './TopBar';
//import uuid from 'react-uuid';


const frag = localStorage.getItem("frag");

const MixForm = ({mixProps, setMixProps}) => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    //const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : null;
    const history = useHistory();
    //const [formData, setFormData] = useState({id: `mix_${uuid()}`, from: account, name: "", description: "", cover: "", tracks: []});

    useEffect(() => {
        if (localStorage.getItem("user") === null || 
        localStorage.getItem("account") === null || 
        window.location.href.search("#access_token=") === -1) history.push("/");
    // eslint-disable-next-line
    }, []);
    
    return ( 
        <div className="pane">
            {(user) ? (
                    <TopBar user={user} history={history} type="nav" title="Build a mix" retPath="/menu" />
                ) : null}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (mixProps.name) {
                    localStorage.setItem("currentMix", JSON.stringify(mixProps));
                    history.push("/search" + frag);
                }
            }}>
                <button id="confirm-btn" type="submit" title="Next">Next</button>
                <div className="sub-form">
                    <label htmlFor="mixName">Name</label>
                    <input type="text" id="mixName" name="mixName" spellCheck="false" 
                    placeholder="Give your mix a personal name..." required={true} autoComplete="off" style={{textTransform: "capitalize"}} 
                    maxLength={20} value={mixProps.name} onChange={(e) => {
                        setMixProps({...mixProps, name: e.target.value});
                    }}></input>
                    <label htmlFor="mixDescription">Description</label>
                    <textarea id="mixDescription" name="mixDescription" spellCheck="false" 
                    placeholder="Add a description..." autoComplete="off" value={mixProps.description} onChange={(e) => {
                        setMixProps({...mixProps, description: e.target.value});
                    }}></textarea>
                    <label>Cover Image</label>
                    <input type="text" id="mixCover" name="mixCover" spellCheck="false" 
                    placeholder="Paste a link to a cover image..." style={{color: "rgb(31, 140, 184)"}}
                    autoComplete="off" value={mixProps.cover} onChange={(e) => {
                        setMixProps({...mixProps, cover: e.target.value});
                    }}></input>
                    <div className="img-container">
                        {mixProps.cover ? (
                            <img src={mixProps.cover} alt="cover" id="cover-img" title="Album cover" onError={() => {
                                document.getElementById("cover-img").style.display = "none";
                            }}></img>
                        ) : (null)}
                    </div>
                </div>
            </form>
        </div>
    );
}
 
export default MixForm;