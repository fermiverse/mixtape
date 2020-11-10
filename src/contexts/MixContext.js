import React, { createContext, useState } from 'react';


export const MixContext = createContext();

const MixContextProvider = (props) => {
    const [mixProps, setMixProps] = useState({
        name: "", description: "", cover: "", tracks: []
    });
    return ( 
        <MixContext.Provider value={{mix: [mixProps, setMixProps]}}>
            {props.children}
        </MixContext.Provider>
    );
}

 
export default MixContextProvider;