import React, { useState, useEffect } from 'react';
import uuid from 'react-uuid';
import closeIcon from '../graphics/cancel.svg';

const getColours = (index) => {
    let colours = ["rgb(68, 37, 194)", "rgb(64, 18, 252)", "rgb(35, 0, 176)", "rgb(13, 85, 255)", 
    "rgb(12, 45, 122)", "rgb(55, 152, 250)", "rgb(250, 55, 104)", "rgb(250, 55, 140)", "rgb(250, 55, 104)"];
    return colours[index % colours.length];
};

const Panel = ({toggleShowPanel, formData, setFormData}) => {

    const allGenres = require("../data/genres.json").genres;
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchValue) {
            setTimeout(() => {
                let filteredGenres = allGenres.filter(genre => genre.search(searchValue) !== -1);
                let filteredGenresTrunc = filteredGenres.slice(0, filteredGenres.length > 15 ? 15 : filteredGenres.length);
                setSearchResults(filteredGenresTrunc);
            }, 200);
        }
    }, [searchValue, allGenres]);
    
    return ( 
        <div id="panel">
            <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                toggleShowPanel(false);
            }}></img>
            <input type="text" id="genre-search-bar" autoComplete="off" placeholder="Search for a genre.." value={searchValue} onChange={(e) => {
                e.preventDefault();
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
    );
}
 
export default Panel;