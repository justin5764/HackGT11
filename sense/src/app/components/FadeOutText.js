"use client"; // Make sure it's a client component

import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const FadeInAndMoveToCorner = ({
  initialText,
  fadeOutDuration = 1500,
  finalText,
  imageSrc,
}) => {
  const [isInitialTextVisible, setIsInitialTextVisible] = useState(true);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isFinalTextVisible, setIsFinalTextVisible] = useState(false);
  const [startMove, setStartMove] = useState(false);

  const router = useRouter(); // Initialize router for navigation

  const handleContinue = () => {
    router.push("/home/signin"); // Navigate to the sign-in page
  };

  useEffect(() => {
    // Fade out the initial text after a delay
    const fadeOutTimer = setTimeout(() => {
      setIsInitialTextVisible(false); // Hide initial text
    }, fadeOutDuration);

    // Fade in the image after the initial text has faded out
    const fadeInImageTimer = setTimeout(() => {
      setIsImageVisible(true); // Show image
    }, fadeOutDuration + 1000); // 1 second after the initial text fades out

    // Start moving the image after fade-in starts
    const moveImageTimer = setTimeout(() => {
      setStartMove(true);
    }, fadeOutDuration + 2000); // Move the image after the content fades in

    // Show final text and button after the image fades in
    const fadeInTextTimer = setTimeout(() => {
      setIsFinalTextVisible(true); // Show final text and button
    }, fadeOutDuration + 3000); // 3 seconds after the initial text fades out

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(fadeInImageTimer);
      clearTimeout(moveImageTimer);
      clearTimeout(fadeInTextTimer);
    };
  }, [fadeOutDuration]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Initial text that fades out */}
      <div
        className={`transition-opacity duration-1000 text-7xl font-bold text-black ${
          isInitialTextVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {initialText}
      </div>

      {/* Image that fades in and moves to the bottom-right corner */}
      <div
        className={`absolute transition-opacity duration-1000 transition-transform duration-[2000ms] ease-in-out 
          ${isImageVisible ? 'opacity-100' : 'opacity-0'}
          ${startMove ? 'translate-x-0 translate-y-0' : 'translate-x-[-50%] translate-y-[-50%]'}`}
        style={{
          zIndex: 10,
          top: startMove ? 'auto' : '50%', // Start in the middle vertically
          left: startMove ? 'auto' : '50%', // Start in the middle horizontally
          right: startMove ? '0' : 'auto', // Move to the bottom-right corner horizontally
          bottom: startMove ? '0' : 'auto', // Move to the bottom-right corner vertically
          transform: startMove ? 'translate(0, 0)' : 'translate(-50%, -50%)', // Ensure smooth transition
        }}
      >
        <Image
          src={imageSrc}
          alt="Fading and Moving Image"
          layout="intrinsic" // Use intrinsic to control size
          width={200} // Set the desired width
          height={133} // Set the desired height
          objectFit="cover" // Ensure the image maintains aspect ratio
        />
      </div>

      {/* Final text and button that fade in after the image */}
      <div
        className={`absolute transition-opacity duration-1000 text-4xl font-bold text-black ${
          isFinalTextVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          zIndex: 20,
          top: '50%', // Center the text vertically
          left: '50%', // Center the text horizontally
          transform: 'translate(-50%, -50%)', // Ensure it's centered
        }}
      >
        {finalText}

        {/* Continue button that appears with the final text */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            style={{
              padding: "15px 30px",
              backgroundColor: "#D3D3D3", // Grey background
              color: "#000000", // Black text
              fontWeight: "bold",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
              fontSize: "1.2rem",
              marginTop: "20px",
              zIndex: 21, // Ensure button is above other content
            }}
            onClick={handleContinue} // Call handleContinue on click
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FadeInAndMoveToCorner;
