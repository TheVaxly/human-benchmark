import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ReactionTest.css";

const ReactionTest = () => {
  const [status, setStatus] = useState("idle"); // "idle", "waiting", "ready", "clicked"
  const [message, setMessage] = useState("Click the box to start!");
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Cleanup the timeout if the component is unmounted
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleBoxClick = () => {
    if (status === "idle") {
      // Transition to "waiting" state
      setStatus("waiting");
      setMessage("Wait for green...");
      const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
      const newTimeoutId = setTimeout(() => {
        setStatus("ready");
        setMessage("Click now!");
        setStartTime(Date.now());
      }, randomDelay);
      setTimeoutId(newTimeoutId);
    } else if (status === "waiting") {
      // User clicked too early
      setStatus("idle");
      setMessage("Too soon! Click the box to try again.");
      if (timeoutId) clearTimeout(timeoutId);
    } else if (status === "ready") {
      // User clicked after the box turned green
      const endTime = Date.now();
      const reactionTime = endTime - startTime;
      setReactionTime(reactionTime);
      setStatus("idle");
      setMessage(`Your reaction time is ${reactionTime} ms. Click to try again!`);
    }
  };

  return (
    <div className="reaction-test-container">
        <h1 className="mb-4">Reaction Test</h1>
      <div
        className={`reaction-box ${status}`}
        onClick={handleBoxClick}
        style={{
          backgroundColor:
            status === "waiting" ? "red" :
            status === "ready" ? "yellowgreen" :
            "lightgray",
        }}
      ></div>
      <p>{message}</p>
      {reactionTime !== null && <p>Reaction Time: {reactionTime} ms</p>}
    </div>
  );
};

export default ReactionTest;
