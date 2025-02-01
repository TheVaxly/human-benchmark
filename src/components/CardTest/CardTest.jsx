import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const difficulties = {
  easy: { totalCards: 16, columns: 4 },
  hard: { totalCards: 24, columns: 6 },
  veryhard: { totalCards: 36, columns: 6 }
};

const ICONS = [
  "🍎", "🍌", "🍇", "🍓", "🍊", "🍍", "🥝", "🍒",
  "🍑", "🍐", "🍋", "🥭", "🍉", "🍏", "🥥", "🍈",
  "🍄", "🥦", "🥕", "🌶️", "🌽", "🥔", "🍠", "🍅",
  "🥒", "🥑", "🍆", "🧄", "🧅", "🥜", "🌰", "🍞"
];

function generateCardData(numCards) {
  const numPairs = numCards / 2;
  let data = [];
  for (let i = 0; i < numPairs; i++) {
    // Use ICONS[i] to ensure uniqueness
    const icon = ICONS[i % ICONS.length];
    data.push({ id: i * 2, icon, isFlipped: false, isMatched: false });
    data.push({ id: i * 2 + 1, icon, isFlipped: false, isMatched: false });
  }
  // Shuffle the array
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data;
}

const CardTest = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const { totalCards, columns } = difficulties[difficulty];
  const [cards, setCards] = useState(() => generateCardData(totalCards));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCardClick = (index) => {
    if (gameCompleted) return;
    if (!isRunning) {
      setIsRunning(true);
    }
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    const newCards = cards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, i) =>
              i === firstIndex || i === secondIndex ? { ...card, isMatched: true } : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, i) =>
              i === firstIndex || i === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 500);
      }
      setAttempts(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (matches === totalCards / 2) {
      setGameCompleted(true);
      setIsRunning(false);
    }
  }, [matches, totalCards]);

  const handleReset = () => {
    setCards(generateCardData(totalCards));
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
    setElapsedTime(0);
    setIsRunning(false);
    setGameCompleted(false);
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);
    // Reset game with new difficulty
    setTimeout(() => {
      setCards(generateCardData(difficulties[level].totalCards));
      setFlippedCards([]);
      setMatches(0);
      setAttempts(0);
      setElapsedTime(0);
      setIsRunning(false);
      setGameCompleted(false);
    }, 0);
  };

  return (
    <>
      <div className="container mt-5 text-center text-white p-3">
        <h1>Card Memory Test</h1>
        <div className="mb-3">
          <span className="lead">Your Time: {elapsedTime} seconds</span>
        </div>
        <div className="btn-group mb-3">
          <button
            className={`btn ${difficulty === "easy" ? "btn-success fw-bold" : "btn-outline-success fw-bold"}`}
            onClick={() => changeDifficulty("easy")}
          >
            Easy
          </button>
          <button
            className={`btn ${difficulty === "hard" ? "btn-warning fw-bold" : "btn-outline-warning fw-bold"}`}
            onClick={() => changeDifficulty("hard")}
          >
            Hard
          </button>
          <button
            className={`btn ${difficulty === "veryhard" ? "btn-danger fw-bold" : "btn-outline-danger fw-bold"}`}
            onClick={() => changeDifficulty("veryhard")}
          >
            Very Hard
          </button>
        </div>
        <button className="btn btn-secondary mb-3" onClick={handleReset}>
          Reset
        </button>
        <div
          className="d-grid justify-content-center"
          style={{
            gridTemplateColumns: `repeat(${columns}, 80px)`,
            gap: "5px",
          }}
        >
          {cards.map((card, index) => (
            <button
              key={card.id}
              className={`btn ${card.isMatched ? "btn-success" : card.isFlipped ? "btn-light" : "btn-primary"}`}
              style={{
                height: "80px",
                width: "80px",
                fontSize: "24px"
              }}
              disabled={card.isMatched || gameCompleted}
              onClick={() => handleCardClick(index)}
            >
              {card.isFlipped || card.isMatched ? card.icon : <span style={{ fontSize: "2rem" }}>?</span>}
            </button>
          ))}
        </div>
        {gameCompleted && (
          <h3 className="mt-3">
            Game Completed in {attempts} attempts! Your Time: {elapsedTime} seconds
          </h3>
        )}
      </div>
      <style>{`
        .btn-group .btn:hover {
          color: black !important;
        }
      `}</style>
    </>
  );
};

export default CardTest;
