import React, { useState, useEffect, useRef } from "react";
import quotesData from "../../data/quotes.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TypingTest.css";

const TypingTest = ({ duration = 60 }) => {
  const [text, setText] = useState(""); 
  const [typedWords, setTypedWords] = useState([]); 
  const [wordStatuses, setWordStatuses] = useState([]); 
  const [currentWordIndex, setCurrentWordIndex] = useState(0); 
  const [currentInput, setCurrentInput] = useState(""); 
  const [timer, setTimer] = useState(duration); 
  const [isRunning, setIsRunning] = useState(false); 
  const [wpm, setWpm] = useState(null); 
  const [accuracy, setAccuracy] = useState(null); 

  const containerRef = useRef(null); 

  useEffect(() => {
    fetchInitialText();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
      calculateResults();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Focus on the container when component mounts or is reset
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [timer]);

  const fetchInitialText = () => {
    const shuffledQuotes = quotesData.sort(() => 0.5 - Math.random());
    const combinedText = shuffledQuotes
      .map((quote) => quote.quote)
      .slice(0, 5)
      .join(" ");
    setText(combinedText);
    setTypedWords([]);
    setWordStatuses(new Array(combinedText.split(" ").length).fill(null));
    setCurrentWordIndex(0);
    setCurrentInput("");
  };

  const handleKeyPress = (event) => {
    if (timer === 0) {
        return;
    }
    if (!isRunning) setIsRunning(true);

    const key = event.key;

    if (key === "Backspace") {
        if (currentInput.length > 0) {
            // If the current input is not empty, just delete the last character
            setCurrentInput((prev) => prev.slice(0, -1));
        } else if (currentWordIndex > 0) {
            const previousIndex = currentWordIndex - 1;

            // Only allow going back if the previous word is incorrect
            if (wordStatuses[previousIndex] === "incorrect") {
                setCurrentWordIndex(previousIndex);
                setCurrentInput(typedWords[previousIndex]); // Restore the previous input
                // Reset the status of the previous word when going back
                setWordStatuses((prevStatuses) => {
                    const updatedStatuses = [...prevStatuses];
                    updatedStatuses[previousIndex] = null; // Reset status to null
                    return updatedStatuses;
                });
            }
            // If the previous word is correct, do nothing (stay on the current word)
        }
    } else if (key === " ") {
        if (currentInput.trim().length > 0) {
            handleWordCompletion();
        }
    } else if (key.length === 1) {
        setCurrentInput((prev) => prev + key);
    }
};

  const handleWordCompletion = () => {
    const words = text.split(" ");
    const currentWord = words[currentWordIndex];
    const isCorrect = currentInput.trim() === currentWord;

    const updatedTypedWords = [...typedWords];
    updatedTypedWords[currentWordIndex] = currentInput.trim();

    const updatedStatuses = [...wordStatuses];
    updatedStatuses[currentWordIndex] = isCorrect ? "correct" : "incorrect";

    setTypedWords(updatedTypedWords);
    setWordStatuses(updatedStatuses);

    setCurrentInput("");
    setCurrentWordIndex((prev) => prev + 1);
  };

  const calculateResults = () => {
    const correctWords = wordStatuses.filter((status) => status === "correct").length;
    const attemptedWords = wordStatuses.filter((status) => status !== null).length;

    const timeElapsed = (duration - timer) / 60;
    const calculatedWpm = Math.round(correctWords / timeElapsed);
    const calculatedAccuracy = Math.round((correctWords / attemptedWords) * 100);

    setWpm(calculatedWpm || 0);
    setAccuracy(calculatedAccuracy || 0);
  };

  const handleReset = () => {
    fetchInitialText();
    setTimer(duration);
    setIsRunning(false);
    setWpm(null);
    setAccuracy(null);
  };

  const highlightText = () => {
    const words = text.split(" ");
    return words.map((word, index) => {
        const isCurrent = index === currentWordIndex;
        const status = wordStatuses[index];

        const letters = word.split("").map((char, charIndex) => {
            const typedChar = isCurrent ? currentInput[charIndex] : null;
            const isCorrect = typedChar === char;

            return (
                <span
                    key={charIndex}
                    style={{
                        color: isCurrent && typedChar ? (isCorrect ? "green" : "red") : "black",
                        fontWeight: isCurrent ? "bold" : "normal",
                        position: 'relative', // Ensure relative positioning for the caret
                    }}
                >
                    {char}
                    {/* Render the caret after the currently typed character */}
                    {isCurrent && charIndex === currentInput.length - 1 && (
                        <span className="caret"></span>
                    )}
                </span>
            );
        });

        return (
            <span
                key={index}
                style={{
                    backgroundColor: status === "correct" ? "lightgreen" : status === "incorrect" ? "lightcoral" : "transparent",
                    marginRight: "5px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                }}
            >
                {letters}
            </span>
        );
    });
};


  return (
    <div
      className="container mt-5"
      tabIndex="0"
      onKeyDown={handleKeyPress}
      style={{ outline: "none" }}   
      ref={containerRef} // Attach the ref to the container
    >
      <h1 className="text-center mb-4">Typing Test</h1>
      <div className="row text-center mb-4">
        <div className="col">
          <h4>Time Left: {timer}s</h4>
        </div>
        {timer === 0 && (
          <>
            <div className="col">
              <h4>WPM: {wpm}</h4>
            </div>
            <div className="col">
              <h4>Accuracy: {accuracy}%</h4>
            </div>
          </>
        )}
      </div>
      <div
        className="border rounded p-3 mb-3 bg-light"
        style={{ minHeight: "40px", fontSize: "18px", lineHeight: "1.5", overflowWrap: "break-word", overflow: "auto", maxWidth: "1080px", margin: "0 auto" }}
      >
        {highlightText()}
      </div>
      {timer === 0 && (
        <div className="text-center">
          <h2>Time's Up!</h2>
          <button className="btn btn-primary" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingTest;
