import React, { useEffect, useState } from 'react';
import defaultAvatar from '../graphics/penguin.png';
import editIcon from '../graphics/editwhite.svg';
import plusIcon from '../graphics/otherplus.svg';
import closeIcon from '../graphics/cancel.svg';
import { useHistory } from 'react-router-dom';
import loadLottie from '../graphics/done.json';
import uuid from 'react-uuid';
import axios from 'axios';
import Lottie from 'react-lottie';
import { SERVER_URL } from '../constants/Base';

const getColours = (index) => {
    let colours = ["rgb(68, 37, 194)", "rgb(64, 18, 252)", "rgb(35, 0, 176)", "rgb(13, 85, 255)", 
    "rgb(12, 45, 122)", "rgb(55, 152, 250)", "rgb(250, 55, 104)", "rgb(250, 55, 140)", "rgb(250, 55, 104)"];
    return colours[index % colours.length];
};

const updateUser = async (formData, spotifyId) => {
    let retVal = false;
    await axios.post(`${SERVER_URL}users/${spotifyId}/update`, {
        name: formData.name,
        genres: formData.genres,
        description: formData.description,
        cover: formData.cover
    }).then(() => {
        retVal = true;
    }).catch((err) => {
        console.log(err);
    });
    return retVal
};

const returnPath = (path) => {
    const frag = localStorage.getItem("frag");
    if (frag) {
        return path + frag
    }
    return "/"
};

const allGenres = require("../data/genres.json").genres;

const Profile = () => {
    const history = useHistory();
    const account = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : {};

    const options = {
        loop: true,
        autoplay: true,
        animationData: loadLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    const [showLoader, toggleShowLoader] = useState(false);
    const [formData, setFormData] = useState({name: account.user.name, cover: account.user.cover, genres: account.user.genres, description: account.user.description});
    const [showCover, toggleShowCover] = useState(false);
    const [showPanel, toggleShowPanel] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const frag = localStorage.getItem("frag") ? localStorage.getItem("frag") : "";
    //const selectedGenres = allGenres.slice(0, 18);

    useEffect(() => {
        if (searchValue) {
            setTimeout(() => {
                let filteredGenres = allGenres.filter(genre => genre.search(searchValue) !== -1);
                let filteredGenresTrunc = filteredGenres.slice(0, filteredGenres.length > 15 ? 15 : filteredGenres.length);
                setSearchResults(filteredGenresTrunc);
            }, 200);
        }
    }, [searchValue]);

    useEffect(() => {
        if (showLoader) {
            setTimeout(() => {
                history.push(returnPath("/menu"));
            }, 4500);
        }
    }, [showLoader, history]);


    return ( 
        <div className="pane" onClick={(e) => {
            setSearchResults([]);
        }}>
            {showLoader ? (
                <div className="loader" style={{marginTop: "150px"}}>
                    <Lottie options={options} width="200px" height="auto" />
                </div>
            ) : (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (updateUser(formData, account.user.spotifyId)) toggleShowLoader(true); 
                    else window.alert("Unable to update user info :/");
                }}>
                    <button className="direction" id="bdir" onClick={(e) => {
                        e.preventDefault();
                        if (frag) history.push("/menu" + frag);
                        else history.push("/");
                    }} title="Cancel">Cancel</button>
                    <button type="submit" className="direction" id="fdir" onClick={(e) => {
                        e.preventDefault();
                        if (updateUser(formData, account.user.spotifyId)) toggleShowLoader(true);
                        else window.alert("Unable to update user info :/");
                    }} title="Confirm">Confirm</button>
                    <div style={{position: "relative", width: "160px", height: "160px"}}>
                        <div id="roundel">
                        {formData.cover ? (
                            <img src={formData.cover} alt="cover" id="cover-img" title="Album cover" onError={() => {
                                document.getElementById("cover-img").style.display = "none";
                            }} onLoad={() => {
                                setTimeout(() => {
                                    toggleShowCover(false);
                                }, 1500);
                            }}></img>
                        ) : (
                            <img src={defaultAvatar} alt="persona"></img>
                        )}
                        </div>
                        <button className="edit-btn" style={{position: "absolute", top: "110px", right: "25px"}} onClick={(e) => {
                            e.preventDefault();
                            toggleShowCover(true);
                        }}>
                            <img src={editIcon} alt="persona" width="16px" height="16px"></img>
                        </button>
                    </div>
                    <div className="profile-form">
                        {showCover ? (
                            <label>Cover Image</label>
                        ) : (null)}
                        {showCover ? (
                            <input type="text" id="mixCover" name="mixCover" spellCheck="false" 
                            placeholder="Paste a link to a cover image..." style={{color: "rgb(31, 140, 184)"}}
                            autoComplete="off" value={formData.cover} onFocus={() => {
                                let thisElem = document.getElementById("mixCover");
                                thisElem.select();
                            }} onMouseUp={() => {
                                return false
                            }} onChange={(e) => {
                                setFormData({...formData, cover: e.target.value});
                            }}></input>
                        ) : (null)}
                        <label htmlFor="mixName">Name</label>
                        <input type="text" id="mixName" name="mixName" spellCheck="false" 
                        placeholder="A name I call myself..." required={true} autoComplete="off" 
                        maxLength={20} value={formData.name} onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                        }}></input>
                        <label htmlFor="mixDescription">Description</label>
                        <textarea id="mixDescription" name="mixDescription" spellCheck="false" 
                        placeholder="A little bit about yourself..." autoComplete="off" value={formData.description} onChange={(e) => {
                            setFormData({...formData, description: e.target.value});
                        }}></textarea>
                        <div style={{position: "relative", height: "125px", width: "100%"}}>
                            <button className="fab" title="Add your favourite genres" onClick={(e) => {
                                    e.preventDefault();
                                    toggleShowPanel(true);
                                }}>
                                <img src={plusIcon} alt="plus" width="16px" height="16px"></img>
                            </button>
                            <label htmlFor="mixGenres">Genres</label>
                            <div className="mixGenres">
                                {formData.genres.map(genre => (
                                    <button className="badge" key={uuid()} 
                                    style={{backgroundColor: getColours(formData.genres.indexOf(genre))}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}>{genre}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            )}
            {showPanel ? (
                <div id="panel">
                    <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                        toggleShowPanel(false);
                    }}></img>
                    <input type="text" id="genre-search-bar" autoComplete="off" placeholder="Search for a genre.." value={searchValue} onChange={(e) => {
                        setSearchValue(e.target.value);
                    }} />
                    <div className="mixGenres" style={{height: "170px"}}>
                        {formData.genres.map(genre => (
                            <button className="badge" key={uuid()} 
                            style={{backgroundColor: getColours(formData.genres.indexOf(genre))}}
                            onClick={(e) => {
                                e.preventDefault();
                                let newGenres = formData.genres.filter(genre => genre !== e.target.textContent);
                                setFormData({...formData, genres: newGenres});
                            }}>{genre}</button>
                        ))}
                    </div>
                    {searchResults.length ? (
                        <div id="genre-search-results">
                            {searchResults.map(res => (
                                <p key={uuid()} onClick={(e) => {
                                    e.preventDefault();
                                    if (!formData.genres.includes(e.target.textContent)) {
                                        let newGenres = [...formData.genres, e.target.textContent];
                                        setFormData({...formData, genres: newGenres});
                                    }
                                    setSearchValue("");
                                }}>{res}</p>
                            ))}
                        </div>
                    ) : (null)}
                </div>
            ) : (null)}
        </div>
    );
}
 
export default Profile;