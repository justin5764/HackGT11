"use client"

// components/FadeInAndMoveToCorner.js
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component

const FadeInAndMoveToCorner = ({ text, fadeOutDuration = 1500, imageSrc }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    // Fade out text after a delay
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeOutDuration);

    // Fade in image after the text fades out
    const fadeInTimer = setTimeout(() => {
      setIsFadingIn(true);
    }, fadeOutDuration + 2000); // 2 seconds after text fades out

    // Move image after it has fully faded in
    const moveImageTimer = setTimeout(() => {
      setIsMoving(true);
    }, fadeOutDuration + 2000 + 1000); // After fade-in completes (1 second for fade-in)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(fadeInTimer);
      clearTimeout(moveImageTimer);
    };
  }, [fadeOutDuration]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Text that fades out */}
      <div className={`transition-opacity duration-1000 text-4xl font-bold text-black ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        {text}
      </div>

      {/* Fading in and moving image */}
      <div
        className={`absolute transition-opacity duration-1000 transition-transform duration-1000 
          ${isFadingIn ? 'opacity-100' : 'opacity-0'} 
          ${isMoving ? 'translate-x-0 translate-y-0' : 'translate-x-0 translate-y-0'}`}
        style={{ zIndex: 10, top: isMoving ? '0' : '50%', left: isMoving ? '0' : '50%', transform: isMoving ? 'translate(0, 0)' : 'translate(-50%, -50%)' }}
      >
        <Image
          src={imageSrc}
          alt="Fading and Moving Image"
          layout="intrinsic" // Use intrinsic to control size
          width={600} // Set the desired width
          height={400} // Set the desired height
          objectFit="cover" // Ensure the image maintains aspect ratio
        />
      </div>
    </div>
  );
};

export default FadeInAndMoveToCorner;
