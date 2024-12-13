import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const generateCardData = (size) => {
  const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥭", "🥝"]; // Example icons
  const selectedIcons = icons.slice(0, size / 2);
  const cardData = [...selectedIcons, ...selectedIcons]
    .sort(() => Math.random() - 0.5)
    .map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));
  return cardData;
};

const CardTest = ({ gridSize = 4, duration = 60 }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    setCards(generateCardData(gridSize * gridSize));
  }, [gridSize]);

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0 && !gameCompleted) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 || gameCompleted) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, gameCompleted]);

  const handleCardClick = (index) => {
    if (!isRunning && !gameCompleted) setIsRunning(true);

    // Prevent flipping more than two cards or clicking the same card
    if (flippedCards.length === 2 || cards[index].isFlipped || gameCompleted) return;

    const updatedCards = cards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards([...flippedCards, index]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // Match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.icon === firstCard.icon
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, i) =>
              i === firstIndex || i === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 500);
      }

      setAttempts((prev) => prev + 1);
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  // Check if the game is complete
  useEffect(() => {
    if (matches === gridSize * gridSize / 2) {
      setGameCompleted(true);
      setIsRunning(false);
    }
  }, [matches, gridSize]);

  const handleReset = () => {
    setCards(generateCardData(gridSize * gridSize));
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
    setTimer(duration);
    setIsRunning(false);
    setGameCompleted(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <h1 className="mb-4">Card Test</h1>
      <div className="row mb-3 text-center">
        <div className="col">
          <h5>Time Left: {timer}s</h5>
        </div>
        <div className="col">
          <h5>Matches: {matches}</h5>
        </div>
        <div className="col">
          <h5>Attempts: {attempts}</h5>
        </div>
      </div>
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: "10px",
        }}
      >
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`btn ${
              card.isMatched
                ? "btn-success"
                : card.isFlipped
                ? "btn-light"
                : "btn-primary"
            }`}
            style={{
              height: "80px",
              width: "80px",
              fontSize: "24px",
            }}
            disabled={card.isMatched || gameCompleted}
            onClick={() => handleCardClick(index)}
          >
            {card.isFlipped || card.isMatched ? card.icon : ""}
          </button>
        ))}
      </div>
      {(timer === 0 || gameCompleted) && (
        <div className="mt-4">
          <h4>{gameCompleted ? "Congratulations! You completed the game!" : "Time's Up!"}</h4>
          <button className="btn btn-primary" onClick={handleReset}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default CardTest;
