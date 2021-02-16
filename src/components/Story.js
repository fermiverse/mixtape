import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import closeIcon from '../graphics/cancel.svg';
import backIcon from '../graphics/back.svg';
let converter = require('number-to-words');

const getDayCount = (month) => {
    let retVal;
    switch (month) {
        case 1:
            retVal = 28;
            break;
        case 0:
        case 2: 
        case 4: 
        case 6: 
        case 7: 
        case 9: 
        case 11:
            retVal = 31;
            break;
        default:
            retVal = 30;
            break;
    }
    return retVal;
};

const durationString = () => {
    //let baseDate = new Date(2020, 9, 10);
    let currentDate = new Date();
    let [y1, m1, d1] = [2020, 9, 10];
    let y2 = currentDate.getFullYear();
    let m2 = currentDate.getMonth();
    let d2 = currentDate.getDate();
    let dDiff = d2 - d1;
    let mDiff = m2 - m1; 
    let yDiff = y2 - y1;
    if (mDiff < 0) {
        yDiff = yDiff - 1;
        mDiff = mDiff + 12;
        if (dDiff < 0) {
            mDiff = mDiff - 1;
            dDiff = dDiff + getDayCount(m2);
        }
    };
    let yearString = yDiff > 0 ? converter.toWords(yDiff) + " " + (yDiff > 1 ? "years" : "year") : "";
    let monthString = mDiff > 0 ? converter.toWords(mDiff) + " " + (mDiff > 1 ? "months" : "month") : "";
    let dayString = dDiff > 0 ? converter.toWords(dDiff) + " " + (dDiff > 1 ? "days" : "day") : "";
    let outArr = [yearString, monthString, dayString].filter(e => e !== "");
    if (outArr.length === 3) return yearString + ", " + monthString + " and " + dayString;
    else return outArr.join(" and ");
};

const getRandomFact = () => {
    let facts = [
        "She's a silver linin', lone ranger ridin' through an open space",
        "She's an incredible leader - fierce, kind and powerful",
        "She loves the Arctic Monkeys and hates (certain kinds of) eggplant",
        "She's a debating pro, and has been debating since her school days",
        "She founded a Reading Initiative for underprivileged children in her hometown",
        "She has a feminist-uncle standup routine",
        "She can code in Python and Javascript 🔥🔥🔥",
        "She likes to take care of the people around her",
        "Her smile can light up an entire room ✨✨",
        "Sometimes, she forgets how beautiful she is",
        "She's all about organic and sustainable living",
        "She can randomly break into song and dance in the middle of conversations",
        "TMI, click below"
    ];
    let x = Math.random();
    let randIndex = Math.floor(x * (facts.length - 1));
    return facts[randIndex];
};

const Story = () => {
    const history = useHistory();
    const [showDescription, toggleShowDescription] = useState(false);
    const [randomFact, setRandomFact] = useState(getRandomFact());
    return ( 
        <div className="pane">
            <button className="blank" style={{position: "absolute", top: "38px", left: "20px"}} onClick={() => {
                    history.push("/");
                }}>
                <img id="back" src={backIcon} alt="back" title="Back" width="20px" height="20px"></img>
            </button>
            <p id="title" style={{marginTop: "40px"}}>Story</p>
            <div style={{maxWidth: "80%", fontSize: "13.7px"}}>
                <p>
                    About <i>{durationString()}</i> ago, I met an <span style={{color: "rgb(22, 177, 22)", textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                        toggleShowDescription(true);
                    }}>
                        incredible woman
                    </span> who changed my life, and my perspective for the better.
                </p>
                <p>This one time, she was travelling to her hometown, and I wanted to make her a playlist to keep her company.</p>
                <p>But a regular Spotify/Youtube playlist couldn't express the magnitude of what I felt. (I was also actively trying to impress her at the time *)</p>
                <p>In my defense, I hadn't listened to <i>I Wanna Be Yours</i> then.</p>
                <p>As Alex Turner so eloquently put it,</p>
                <p style={{textAlign: "center", color: "rgb(172, 134, 12)"}}>
                    <i>"I wanna be your vacuum cleaner</i>
                    <br></br>
                    <i>Breathing in your dust"</i>
                </p>
                <p>That's where the idea of Mixtape, an app built around the experience of making playlists, was born.</p>
                <p>Hopefully, it can make the same kind of magic for you as it did for us.</p>
                <p>* I still am</p>
            </div>
            <button id="build" onClick={() => {
                history.push("/");
            }}>Make A Mix</button>
            {showDescription ? (
                <div id="panel" style={{height: "280px"}}>
                    <img src={closeIcon} className="close" alt="close" title="Close" width="20px" height="20px" onClick={() => {
                        toggleShowDescription(false);
                    }}></img>
                    <p style={{color: "black", fontSize: "14px", marginTop: "10px"}}>
                        Unfortunately, I can't shout her name from the mountain-tops, but here's a fun fact:
                    </p>
                    <p style={{color: "black", fontSize: "13px", textAlign: "center"}}>
                        <i>{randomFact}</i>
                    </p>
                    <p style={{color: "black", fontSize: "13px", textAlign: "center", marginTop: 0}}>...</p>
                    <button className="blank" 
                    style={{color: "rgb(230, 230, 230)", 
                    backgroundColor: "rgb(36, 140, 226)", 
                    padding: "10px", paddingLeft: "25px", paddingRight: "25px",
                    borderRadius: "30px", position: "absolute", bottom: "30px"}} onClick={() => {
                        setRandomFact(getRandomFact());
                    }}>Tell me something new</button>
                </div>
            ) : (null)}
        </div>
    );
}
 
export default Story;