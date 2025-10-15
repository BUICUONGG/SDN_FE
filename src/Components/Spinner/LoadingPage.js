import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./animation.json"; // Thay bằng file JSON của bạn
import "./spinner.css";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + 5, 100);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <Player
        autoplay
        loop
        src={animationData}
        style={{ height: "150px", width: "150px" }}
      />
    </div>
  );
};

export default LoadingPage;
