"use client"; // Ensure it's a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const FadeText = ({ messages = [], nextPage }) => { // Add default value for messages
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    if (messages.length === 0) return; // Ensure messages is not empty

    const interval = setInterval(() => {
      setFade(true); // Start fading out

      const timeoutId = setTimeout(() => {
        if (currentMessageIndex === messages.length - 1) {
          // If the last message is displayed, navigate to the next page
          router.push(nextPage);
        } else {
          // Otherwise, move to the next message
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
          setFade(false); // Start fading in
        }
      }, 1000); // Duration of fade out

      return () => clearTimeout(timeoutId); // Cleanup the timeout
    }, 2000); // Duration for each message

    return () => clearInterval(interval); // Cleanup the interval
  }, [currentMessageIndex, messages.length, router, nextPage]); // Ensure this runs when index, messages, or router changes

  if (messages.length === 0) {
    return null; // Do not render anything if messages is empty
  }

  return (
    <div
      className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
      style={{
        color: "black", 
        fontSize: "4rem", // Equivalent to 7xl
        fontWeight: "bold", 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", // Center the text
        textAlign: "center",
      }}
    >
      {messages[currentMessageIndex]}
    </div>
  );
};

export default FadeText;
