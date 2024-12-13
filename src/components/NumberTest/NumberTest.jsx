import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NumberTest = () => {
  const [level, setLevel] = useState(1);
  const [generatedNumber, setGeneratedNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const generateRandomNumber = (digits) => {
    let number = "";
    for (let i = 0; i < digits; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  };

  const startGame = () => {
    const newNumber = generateRandomNumber(level);
    setGeneratedNumber(newNumber);
    setInputValue("");
    setStatus("");
    setIsPlaying(true);

    // Display the number temporarily
    alert(`Memorize this number: ${newNumber}`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const submitAnswer = () => {
    if (inputValue === generatedNumber) {
      setStatus("Correct! Moving to the next level.");
      setLevel(level + 1);
      setTimeout(() => startGame(), 2000);
    } else {
      setStatus("Incorrect! Try again from level 1.");
      setLevel(1);
      setIsPlaying(false);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setGeneratedNumber("");
    setInputValue("");
    setStatus("");
    setIsPlaying(false);
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Number Memory Test</h1>
      <h3>Level: {level}</h3>

      {!isPlaying ? (
        <button className="btn btn-primary mt-3" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <div className="mt-3">
          <input
            type="text"
            className="form-control"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter the number you remember"
          />
          <button className="btn btn-success mt-3" onClick={submitAnswer}>
            Submit
          </button>
        </div>
      )}

      {status && <h4 className="mt-4">{status}</h4>}

      <button className="btn btn-danger mt-3" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
};

export default NumberTest;
