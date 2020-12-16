import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import { useHistory } from 'react-router-dom';
import { SERVER_URL } from '../constants/Base';
import TopBar from './TopBar';
import Error from './Error';
import uploadIcon from '../graphics/cloud.svg';
import closeIcon from '../graphics/cancel2.svg';
import addIcon from '../graphics/fileAdd.svg';
import loadLottie from '../graphics/confirmation.json';
import axios from 'axios';
//import uuid from 'react-uuid';



const MixForm = ({mixProps, setMixProps}) => {
    const frag = localStorage.getItem("frag");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    //const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : null;
    const history = useHistory();
    //const [formData, setFormData] = useState({id: `mix_${uuid()}`, from: account, name: "", description: "", cover: "", tracks: []});

    const [errorText, setErrorText] = useState("");
    const [uploadMode, toggleUploadMode] = useState(false);
    const [targetFile, setTargetFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [showConfirmation, toggleShowConfirmation] = useState(false);
    const inputFile = useRef(null);

    const options = {
        loop: false,
        autoplay: true,
        animationData: loadLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    const uploadImage = async (file, spotifyId) => {
        const formData = new FormData();
        formData.append("image", file);
        await axios.post(`${SERVER_URL}users/${spotifyId}/images/upload`, formData).then((res) => {
            if (res.data.uri) {
                setMixProps({...mixProps, cover: res.data.uri});
                setImageUrl(null);
                toggleShowConfirmation(true);
            }
        }).catch((err) => {
            console.log(err);
            setErrorText("Error uploading image");
        });
    };

    useEffect(() => {
        if (localStorage.getItem("user") === null || 
        localStorage.getItem("account") === null || 
        window.location.href.search("#access_token=") === -1) history.push("/");
        
    // eslint-disable-next-line
    }, []);

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
    
    return ( 
        <div className="pane">
            {(user) ? (
                    <TopBar user={user} history={history} type="nav" title="Build a mix" retPath="/menu" />
                ) : null}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (mixProps.name) {
                    localStorage.setItem("currentMix", JSON.stringify(mixProps));
                    if (mixProps.tracks) localStorage.setItem("selectedTracks", JSON.stringify(mixProps.tracks));
                    history.push("/search" + frag);
                }
            }}>
                <button id="confirm-btn" type="submit" title="Next">Next</button>
                <div className="sub-form">
                    <label htmlFor="mixName">Name</label>
                    <input type="text" id="mixName" name="mixName" spellCheck="false" 
                    placeholder="Give your mix a personal name..." required={true} autoComplete="off" style={{textTransform: "capitalize"}} 
                    maxLength={50} value={mixProps.name ? mixProps.name : ""} onChange={(e) => {
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
                    autoComplete="off" value={mixProps.cover} onFocus={() => {
                        let thisElem = document.getElementById("mixCover");
                        thisElem.select();
                    }} onMouseUp={() => {
                        return false
                    }} onInput={(e) => {
                        setMixProps({...mixProps, cover: e.target.value});
                    }}></input>
                    <p style={{textAlign: "center", color: "rgb(150,150,150)", margin: 0, fontSize: "12.5px"}}>OR</p>
                    <div id="upload">
                        <input id="file-upload" ref={inputFile} type="file" onChange={(e) => {
                            let file = e.target.files[0];
                            if (file) {
                                setImageUrl(URL.createObjectURL(file));
                                setTargetFile(file);
                                toggleUploadMode(true);
                            }
                        }} onSubmit={(e) => {
                            e.preventDefault();

                        }} />
                        {uploadMode ? (
                            <button className="blank" id="upload-btn" title="Upload image" onClick={(e) => {
                                e.preventDefault();
                            }}>
                                {showConfirmation ? (
                                    <div className="cfab">
                                        <div className="loader">
                                            <Lottie options={options} width="30px" height="auto" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cfab" onClick={(e) => {
                                        e.preventDefault();
                                        let spotifyId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;
                                        if (spotifyId && targetFile) {
                                            uploadImage(targetFile, spotifyId);
                                        }
                                    }}>
                                        <img src={uploadIcon} alt="upload" width="30px" height="30px"></img>
                                        <i style={{marginTop: "10px"}}>Tap to Upload</i>
                                    </div>
                                )}
                                <div className="dfab" style={{position: "absolute", top: "10px", right: "10px"}} onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        toggleUploadMode(false);
                                        toggleShowConfirmation(false);
                                        setImageUrl(null);
                                    }}>
                                    <img src={closeIcon} alt="close" title="Close" width="20px" height="20px"></img>
                                </div>
                            </button>
                        ) : (
                            <button className="blank" id="upload-btn" title="Choose image to upload" onClick={(e) => {
                                e.preventDefault();
                                if (mixProps.cover) setMixProps({...mixProps, cover: ""});
                                inputFile.current.click();
                            }}>
                                <div className="cfab">
                                    <img src={addIcon} alt="add" width="30px" height="30px"></img>
                                    <i style={{marginTop: "10px"}}>Add your own</i>
                                </div>
                            </button>
                        )}
                        <img src={mixProps.cover ? mixProps.cover : imageUrl} alt="" id="custom-img" title="Album cover" width="325px" height="auto" style={{borderRadius: "2px", zIndex: 10}} onError={() => {
                            document.getElementById("custom-img").style.display = "none";
                        }}></img>
                    </div>
                </div>
            </form>
            {errorText ? (
                <Error text={errorText} />
            ) : (null)}
        </div>
    );
}
 
export default MixForm;