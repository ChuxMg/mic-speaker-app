"use client"

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (listening) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioCtx = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(audioCtx.destination);
          audioRef.current = audioCtx;
        })
        .catch((err) => {
          console.error("Mic access error:", err);
        });
    } else {
      audioRef.current?.close();
      audioRef.current = null;
    }
  }, [listening]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 transition bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎤 Mic to 🔊 Speaker</h1>
      <button
        onClick={() => setListening((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4"
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
    </main>
  );
}