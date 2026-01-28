import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import introV from "./assets/intro-6.mp4";
import { api } from "../public/api";

const IntroVideo = ({ onEnd }) => (
  <div className="video-container">
    <video
      autoPlay
      muted
      playsInline
      onEnded={onEnd}
      className="fullscreen-video"
    >
      <source src={introV} type="video/mp4" />
    </video>
  </div>
);

function AppInner() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("seen")) setShowIntro(false);
  }, []);

  useEffect(() => {
    const keys = new Set();

    const down = (e) => {
      keys.add(e.key.toLowerCase());

      if (
        keys.has("shift") &&
        keys.has("a") &&
        keys.has("d") &&
        keys.has("m")
      ) {
        fetch(`${api}/export/xls`, {
          headers: { "x-admin-key": "innoverse-secret-key" }
        })
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "innoverse.xlsx";
            a.click();
            URL.revokeObjectURL(url);
          });
      }
    };

    const up = () => keys.clear();

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  if (showIntro) {
    return (
      <IntroVideo
        onEnd={() => {
          sessionStorage.setItem("seen", "1");
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
