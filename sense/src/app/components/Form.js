"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import NavBar from "./NavBar";

const questions = [
  "Little interest or pleasure in doing things.",
  "Feeling down, depressed, or hopeless.",
  "Trouble falling or staying asleep, or sleeping too much.",
  "Feeling tired or having little energy.",
  "Poor appetite or overeating.",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down.",
  "Trouble concentrating on things, such as reading the newspaper or watching television.",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual.",
  "Thoughts that you would be better off dead or of hurting yourself in some way.",
  "Feeling nervous, anxious or on edge.",
  "Not being able to stop or control worrying.",
  "Worrying too much about different things.",
  "Trouble relaxing.",
  "Being so restless that it is hard to sit still.",
  "Becoming easily annoyed or irritable.",
  "Feeling afraid as if something awful might happen."
];

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day"
];

const FormPage = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const router = useRouter(); // Initialize the router for navigation

  const handleAnswerClick = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = options[optionIndex];
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    console.log("Answers submitted:", answers);
    router.push("/home/video"); // Redirect to the next page after submission
  };

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
      {/* Scrollable container */}
      <div style={{ 
          padding: "20px", 
          maxWidth: "800px", 
          margin: "0 auto", 
          overflowY: "auto",  // Enable vertical scrolling
          height: "calc(100vh - 70px)"  // Adjust to account for the NavBar height
        }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "black" }}>
          Psychiatric Evaluation Form
        </h1>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "black" }}>{question}</h2> {/* Black question text */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  style={{
                    padding: "10px",
                    backgroundColor: answers[questionIndex] === option ? "#007ba7" : "#f1f1f1",
                    color: answers[questionIndex] === option ? "#ffffff" : "#000000",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    width: "23%", // To make the buttons evenly spaced
                    transition: "background-color 0.3s",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                  onClick={() => handleAnswerClick(questionIndex, optionIndex)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            style={{
              padding: "15px 30px",
              backgroundColor: "#007ba7",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
            }}
            onClick={handleSubmit} // Call the submit handler
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
