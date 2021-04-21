import React, { useState } from 'react';

const SECRET = "poojil@287";

const Note = () => {
    const [showContent, toggleShowContent] = useState(false);
    const [password, setPassword] = useState("");
    return (  
        <div className="pane">
            <div id="note">
                {showContent ? (
                    <>
                    <p>To my Poojil,</p>
                    <p>Many people go lifetimes without finding love, or come to develop more grounded notions of it. Thanks to you, that is something I will never have to do. 
                    Thank you, for being the person you are. I love you so much. Happy 6 months, baby.</p> 
                    <p>In the box you'll find:</p>
                    <ol>
                        <li>A Gentleman in Moscow, by Amor Towles (my copy). A particular favourite of mine, which I hope becomes your post-dinner read.</li>
                        <li>2 bars of khadi soap, one jasmine, one orange neroli. Unfortunately, visual inspection will not suffice here. You will be required to provide detailed reviews of the products, with 
                        accompanying photo/videographic evidences attached.</li>
                        <li>A box of 7 bonbons. Small after-meal treats. </li>
                    </ol>
                    <p>I hope this little token can convey the magnitude of what I feel for you. I hope it reminds you of me, and if it perchance makes you aroused, that is a side-effect that is most encouraged.</p>
                    <p>Love,</p>
                    <p>Aal the Val</p>
                    </>
                ) : (
                    <>
                    <label>Enter your password</label>
                    <input type="password" onInput={(e) => {
                        setPassword(e.target.value);
                    }} placeholder={"Password"} value={password}></input>
                    <div id="btn-holder">
                        <button className="reset-btn" onClick={(e) => {
                            e.preventDefault();
                            setPassword("");
                        }}>Reset</button>
                        <button className="submit-btn" onClick={(e) => {
                            e.preventDefault();
                            if (password === SECRET) {
                                toggleShowContent(true);
                            }
                        }}>Submit</button>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}
 
export default Note;