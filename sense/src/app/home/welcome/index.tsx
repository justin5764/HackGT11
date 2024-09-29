// pages/welcome.js
import React from "react";
import FadeInAndMoveImage from '../../components/FadeOutText'; // Ensure this path is correct

export default function WelcomePage() {
    return (
        <div style={{ position: "relative", overflow: "hidden", width: "100vw", height: "100vh" }}>
            <img
                src="/images/background.png"
                alt="Full Screen"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}             
            />


        <div>
            <FadeInAndMoveImage
                text="Welcome To"
                imageSrc="/images/logo.png" // Make sure this path is correct
                fadeOutDuration={3000} // Duration for the text to fade out
            />
        </div>

        </div>
    );
}
