// FadeText.js
"use client"; // Ensure it's a client component

import React, { useState, useEffect } from 'react';

const messages = [
    "Thank you for your responses",
    "Your feedback helps us improve",
    "We appreciate your time",
    "Every response counts!",
];

const FadeText = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Start fading out

            const timeoutId = setTimeout(() => {
                setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length); // Change message
                setFade(false); // Start fading in
            }, 1000); // Duration of fade out

            return () => clearTimeout(timeoutId); // Cleanup the timeout
        }, 2000); // Duration for each message

        return () => clearInterval(interval); // Cleanup the interval
    }, []); // Ensure this runs only once on mount

    return (
        <div className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
            {messages[currentMessageIndex]}
        </div>
    );
};

export default FadeText;
