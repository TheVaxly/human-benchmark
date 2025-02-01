import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NumberTest = () => {
  const [level, setLevel] = useState(1);
  const [generatedNumber, setGeneratedNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [sliderTime, setSliderTime] = useState(2500);
  const [nextReady, setNextReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const rafId = useRef(null);

  const generateRandomNumber = (digits) => {
    let number = "";
    for (let i = 0; i < digits; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  };

  const startGame = (currentLevel = level) => {
    const newNumber = generateRandomNumber(currentLevel);
    setGeneratedNumber(newNumber);
    setInputValue("");
    setStatus("");
    setIsPlaying(true);
    setNextReady(false);
    setFailed(false);
    setShowNumber(true);
    setSliderTime(2500);

    const startTime = performance.now();

    const updateSlider = (currentTime) => {
      const elapsed = currentTime - startTime;
      const remaining = Math.max(2500 - elapsed, 0);
      setSliderTime(remaining);
      if (elapsed < 2500) {
        rafId.current = requestAnimationFrame(updateSlider);
      }
    };

    rafId.current = requestAnimationFrame(updateSlider);

    setTimeout(() => {
      setShowNumber(false);
      cancelAnimationFrame(rafId.current);
    }, 2500);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const submitAnswer = () => {
    if (inputValue === generatedNumber) {
      setStatus("Correct! Click Next to continue.");
      setNextReady(true);
    } else {
      setStatus("Incorrect! Try again from level 1.");
      setFailed(true);
    }
  };

  const handleNext = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    startGame(nextLevel);
  };

  const resetGame = () => {
    setLevel(1);
    setGeneratedNumber("");
    setInputValue("");
    setStatus("");
    setIsPlaying(false);
    setNextReady(false);
    setFailed(false);
    setShowNumber(false);
    setSliderTime(2500);
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Number Memory Test</h1>
      <h3>Level: {level}</h3>
      {!isPlaying && (
        <button className="btn btn-primary mt-3" onClick={() => startGame(level)}>
          Start Game
        </button>
      )}
      {isPlaying && (
        <div className="mt-3">
          {showNumber ? (
            <>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {generatedNumber}
              </div>
              <div
                style={{
                  width: "10%",
                  height: "4px",
                  backgroundColor: "white",
                  margin: "20px auto 0",
                }}
              >
                <div
                  style={{
                    width: `${(sliderTime / 2500) * 100}%`,
                    height: "100%",
                    backgroundColor: "#413d3c",
                    transition: "width 16ms linear",
                  }}
                ></div>
              </div>
            </>
          ) : (
            <>
              {nextReady ? (
                <button className="btn btn-primary mt-3" onClick={handleNext}>
                  Next
                </button>
              ) : failed ? (
                <button className="btn btn-warning mt-3" onClick={resetGame}>
                  Try Again
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control mx-auto"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter the number"
                    style={{
                      width: "20%",
                      marginTop: "10px",
                    }}
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button className="btn btn-success" onClick={submitAnswer}>
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
      {status && <h4 className="mt-4">{status}</h4>}
    </div>
  );
};

export default NumberTest;
