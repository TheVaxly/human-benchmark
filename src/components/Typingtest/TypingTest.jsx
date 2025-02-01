import React, { useState, useEffect, useRef } from "react";
import english5kData from "../../data/english_5k.json";
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
  const [allTypedWords, setAllTypedWords] = useState([]);
  const [allWordStatuses, setAllWordStatuses] = useState([]);

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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [timer]);

  const fetchInitialText = () => {
    const shuffledWords = [...english5kData.words].sort(() => 0.5 - Math.random()).slice(0, 60);
    
    const line1 = shuffledWords.slice(0, 20).join(" ");
    const line2 = shuffledWords.slice(20, 40).join(" ");
    const line3 = shuffledWords.slice(40, 60).join(" ");
    
    const finalText = [line1, line2, line3].join("\n");
    
    setText(finalText);
    setTypedWords([]);
    setWordStatuses(new Array(shuffledWords.length).fill(null));
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
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (currentWordIndex > 0) {
        const previousIndex = currentWordIndex - 1;

        if (wordStatuses[previousIndex] === "incorrect") {
          setCurrentWordIndex(previousIndex);
          setCurrentInput(typedWords[previousIndex]);
          setWordStatuses((prevStatuses) => {
            const updatedStatuses = [...prevStatuses];
            updatedStatuses[previousIndex] = null;
            return updatedStatuses;
          });
        }
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

    setAllTypedWords((prev) => [...prev, currentInput.trim()]);
    setAllWordStatuses((prev) => [...prev, isCorrect ? "correct" : "incorrect"]);

    setCurrentInput("");
    setCurrentWordIndex((prev) => prev + 1);

    if (currentWordIndex + 1 >= words.length) {
      fetchInitialText();
    }
  };

  const getNewLineText = () => {
    const newWords = [...english5kData.words]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .join(" ");
    return newWords;
  };

  const calculateResults = () => {
    const correctWords = allWordStatuses.filter((status) => status === "correct").length;
    const attemptedWords = allWordStatuses.length;
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
      let letters;

      if (index < currentWordIndex) {
        if (status === "correct") {
          letters = word.split("").map((char, charIndex) => (
            <span key={charIndex} style={{ color: "#ffffff", position: "relative" }}>
              {char}
            </span>
          ));
        } else if (status === "incorrect") {
          letters = word.split("").map((char, charIndex) => {
            const typedChar = typedWords[index]?.[charIndex] || "";
            const isCorrect = typedChar === char;
            return (
              <span
                key={charIndex}
                style={{
                  color: typedChar ? (isCorrect ? "#ffffff" : "#ff0000") : "rgba(211, 211, 211, 0.6)",
                  position: "relative",
                }}
              >
                {char}
              </span>
            );
          });
        } else {
          letters = word.split("").map((char, charIndex) => (
            <span key={charIndex} style={{ color: "rgba(211, 211, 211, 0.6)", position: "relative" }}>
              {char}
            </span>
          ));
        }
      } else if (isCurrent) {
        letters = word.split("").map((char, charIndex) => {
          const typedChar = currentInput[charIndex] || "";
          const isCorrect = typedChar === char;
          return (
            <span
              key={charIndex}
              style={{
                color: typedChar ? (isCorrect ? "#ffffff" : "#ff0000") : "rgba(211, 211, 211, 0.6)",
                position: "relative",
              }}
            >
              {char}
            </span>
          );
        });

        const caretPosition = currentInput.length;
        if (caretPosition < word.length) {
          letters.splice(caretPosition, 0, (
            <span key="caret" className="caret"></span>
          ));
        } else {
          letters.push(
            <span key="caret" className="caret"></span>
          );
        }
      } else {
        letters = word.split("").map((char, charIndex) => (
          <span key={charIndex} style={{ color: "rgba(211, 211, 211, 0.6)", position: "relative" }}>
            {char}
          </span>
        ));
      }

      return (
        <span
          key={index}
          style={{
            marginRight: "5px",
            display: "inline-block",
            whiteSpace: "nowrap",
            textDecoration: status === "incorrect" ? "underline red" : "none",
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
      ref={containerRef}
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
      <div className="typing-test-box" style={{ minHeight: "40px", lineHeight: "1.5", overflowWrap: "break-word", overflow: "auto", maxWidth: "1080px", margin: "0 auto" }}>
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
