import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactionTimeTest from "./components/ReactionTest/ReactionTest.jsx";
import TypingTest from "./components/Typingtest/TypingTest.jsx";
import MemoryTest from "./components/CardTest/CardTest.jsx";
import NumberTest from "./components/NumberTest/NumberTest.jsx";

const App = () => {
  return (
    <Router>
      <div className="container mt-5 text-center">
        <h1>Skill Test Hub</h1>
        <nav className="mb-4">
          <Link to="/typing-test" className="btn btn-secondary">
            Typing Test
          </Link>
          <Link to="/reaction-time-test" className="btn btn-secondary">
            Reaction Time Test
          </Link>
          <Link to="/Card-test" className="btn btn-secondary">
            Card Test
          </Link>
          <Link to="/Number-test" className="btn btn-secondary">
            Number Test
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/typing-test" element={<TypingTest />} />
          <Route path="/reaction-time-test" element={<ReactionTimeTest />} />
          <Route path="/card-test" element={<MemoryTest />} />
          <Route path="/number-test" element={<NumberTest />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => (
  <div>
    <h2>Welcome to the Skill Test Hub</h2>
    <p>Choose a test to get started!</p>
  </div>
);

export default App;
