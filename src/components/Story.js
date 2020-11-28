import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import closeIcon from '../graphics/cancel.svg';
let converter = require('number-to-words');

const durationString = () => {
    let baseDate = new Date(2020, 9, 10);
    let currentDate = new Date();
    let msDiff = currentDate - baseDate;
    let days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    let months = Math.floor(days / 30);
    days = days % 30;
    let monthString = months > 0 ? converter.toWords(months) + " " + (months > 1 ? "months" : "month") : "";
    let dayString = days > 0 ? converter.toWords(days) + " " + (days > 1 ? "days" : "day") : "";
    return monthString + " and " + dayString
};

const getRandomFact = () => {
    let facts = [
        "She loves the Arctic Monkeys and hates (certain kinds of) eggplant",
        "She's a debating pro, and has been debating since her school days",
        "She founded a Reading Initiative for underprivileged children in her hometown",
        "She has a feminist-uncle standup routine",
        "She can code in Python and Javascript 🔥🔥🔥",
        "She likes to take care of the people around her",
        "Sometimes, she forgets how beautiful she is",
        "She's all about organic and sustainable living",
        "She can randomly break into song and dance in the middle of conversations",
        "TMI, click below"
    ]
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
                <p>But a regular Spotify/Youtube playlist couldn't express the magnitude of what I felt. (I was also actively trying to impress her at the time*)</p>
                <p>In my defense, I hadn't listened to <i>I Wanna Be Yours</i> then.</p>
                <p>As Alex Turner so eloquently put it,</p>
                <p style={{textAlign: "center", color: "rgb(172, 134, 12)"}}>
                    <i>"I wanna be your vacuum cleaner</i>
                    <br></br>
                    <i>Breathing in your dust"</i>
                </p>
                <p>That's where the idea of Mixtape, an app built around the experience of making playlists, was born.</p>
                <p>Hopefully, it can make the same kind of magic for you as it did for us.</p>
                <p>*I still am</p>
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