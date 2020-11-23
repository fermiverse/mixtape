import React from 'react';

const getAllArtists = (mix, limit=3) => {
    let tracks = mix.tracks;
    if (tracks && tracks.length) {
        let artistArr = tracks.map(track => track.artists).flat();
        let uartistArr = [...new Set(artistArr)];
        let artistArrShort = uartistArr.slice(0, limit < uartistArr.length ? limit : uartistArr.length);
        return artistArrShort.join(", ")
    }
    return "";
}

const MixDescription = ({mix}) => {
    return (  
        <div id="mix-description">
            <h4 id="pname">{mix.name}</h4>
            <p id="pdes" style={{color: "rgb(190, 190, 190)", fontSize: "13.5px"}}>{mix.description.slice(0, 80)}</p>
            <p id="partists" style={{color: "rgb(180, 180, 180)", fontSize: "13px"}}><i>{`${getAllArtists(mix)} and more.`}</i></p>
            <p id="pcount" style={{color: "rgb(150, 108, 4)"}}>{`${mix.tracks.length} tracks`}</p>
        </div>
    );
}
 
export default MixDescription;