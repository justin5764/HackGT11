import React from "react";
import NavBar from "../../components/NavBar";
import FadeText from "@/app/components/FadeText";

export default function LoadingResultsPage() {
    const loadingMessages = [
        "Analyzing your responses...",
        "Generating your results...",
        "Preparing your recommendations...",
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
        <FadeText messages={loadingMessages} nextPage="/home/diagnosis" />
      </div>
    </div>
  );
}
