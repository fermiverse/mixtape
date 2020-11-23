import React from 'react';
import tapeIcon from '../graphics/tape.svg';

const Tape = ({cover, name}) => {
    return ( 
        <div className="tape" title={name}>
            {cover ? (
                <img src={cover} alt="cover" id="cover" width="325px" height="auto"></img>
            ) : (null)}
            <img src={tapeIcon} alt="tape" width="325px" height="200px"></img>
        </div>
    );
}
 
export default Tape;