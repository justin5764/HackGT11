import React from "react";
import NavBar from "../../components/NavBar";
import FadeText from "@/app/components/FadeText";

export default function LoadingPage() {
  const loadingMessages = [
    "Welcome back!",
    "Let's get started!", 
    "Just a few quick questions for you",
  ];

  return (
    <div style={{ position: "relative", overflow: "hidden", width: "100vw", height: "100vh" }}>
      <NavBar />
      <img
        src="/images/white.png"
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
        <FadeText messages={loadingMessages} nextPage="/home/form" />
      </div>
    </div>
  );
}
