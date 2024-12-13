import React, { useState } from "react";
import AudioAnalyser from "react-audio-analyser";

const VoiceTest = () => {
  const [audioStatus, setAudioStatus] = useState(""); // "recording", "inactive"
  const [playedFrequency, setPlayedFrequency] = useState(null);
  const [recordedFrequency, setRecordedFrequency] = useState(null);
  const [feedback, setFeedback] = useState("");

  const audioOptions = {
    audioType: "audio/wav",
    status: audioStatus,
    startCallback: () => {
      console.log("Recording started");
    },
    stopCallback: (blob) => {
      console.log("Recording stopped", blob);
      analyzeAudio(blob, "recorded");
    },
    errorCallback: (err) => {
      console.log("Error:", err);
    },
  };

  const generateRandomSound = async () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const frequency = Math.floor(Math.random() * 200) + 200; // Generate frequency between 200Hz and 1000Hz
    setPlayedFrequency(frequency);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  };

  const analyzeAudio = async (blob, type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    // Decode the audio data from the blob
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create a buffer source and connect it to the analyser
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Configure the analyser
    analyser.fftSize = 1024; // FFT size must be a power of 2
    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);

    // Start playing the audio for analysis
    source.start(0);

    // Wait until the audio plays (short delay to allow data to populate)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture frequency data
    analyser.getByteFrequencyData(frequencyData);

    // Find the peak frequency
    const sampleRate = audioContext.sampleRate;
    const frequencyBinSize = sampleRate / analyser.fftSize;
    const peakIndex = frequencyData.indexOf(Math.max(...frequencyData));
    const detectedFrequency = peakIndex * frequencyBinSize;

    if (type === "recorded") {
      setRecordedFrequency(detectedFrequency.toFixed(2));
      compareFrequencies(detectedFrequency, playedFrequency);
    }

    // Clean up
    source.disconnect();
    analyser.disconnect();
    audioContext.close();
  };

  const compareFrequencies = (recorded, played) => {
    const difference = Math.abs(recorded - played);
    if (difference <= 50) {
      setFeedback("Good match!");
    } else if (difference <= 100) {
      setFeedback("Close, but try again.");
    } else {
      setFeedback("Not a match, try again.");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Sound Memory Test</h1>
      <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={generateRandomSound}
        >
          Play Sound
        </button>
        <div className="mt-3">
          {playedFrequency && <h3>Played Frequency: {playedFrequency} Hz</h3>}
        </div>
      </div>
      <div className="mt-4">
        <AudioAnalyser {...audioOptions} />
        <button
          className="btn btn-success"
          onClick={() => setAudioStatus("recording")}
        >
          Start Recording
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setAudioStatus("inactive")}
        >
          Stop Recording
        </button>
      </div>
      <div className="mt-3">
        {recordedFrequency && (
          <>
            <h3>Recorded Frequency: {recordedFrequency} Hz</h3>
            <h4>{feedback}</h4>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceTest;
