"use client"; // Mark as client component

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import FadeInAndMoveImage from '../../components/FadeOutText'; // Ensure this path is correct

export default function WelcomePage() {
  const router = useRouter(); // Initialize router for navigation

  const handleContinue = () => {
    router.push("/home/signin"); // Navigate to /home/signin when Continue button is clicked
  };

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
          zIndex: -1, // Ensure the background image stays behind other elements
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}> {/* Ensure content is above the background */}
        <FadeInAndMoveImage
          initialText="Welcome To"
          finalText="Our goal was to provide early and accessible detection of mental health concerns to the general public. We chose to do this through Sense, which analyzes subtle behavioral cues to provide timely insights and support resources to its users."
          imageSrc="/images/logo.png" // Make sure this path is correct
          fadeOutDuration={1500} // Duration for the text to fade out
        />

        {/* Debugging Block */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            position: "relative",
            zIndex: 2,
            border: "2px solid red", // Temporary border to help visualize the button area
          }}
        >
          {/* Continue Button */}
          <button
            style={{
              padding: "20px 60px", // Increased padding for a larger button
              backgroundColor: "#D3D3D3", // Grey background
              color: "#000000", // Black text
              fontWeight: "bold",
              borderRadius: "10px", // Slightly rounder corners
              cursor: "pointer",
              border: "2px solid blue", // Temporary border to make sure it's visible
              fontSize: "1.5rem", // Larger font size for bigger text
              marginTop: "30px", // More spacing from the final text
              width: "300px", // Set a fixed width for the button to make it visually larger
              zIndex: 3, // Ensure the button is above everything else
            }}
            onClick={handleContinue} // Call handleContinue on click
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
