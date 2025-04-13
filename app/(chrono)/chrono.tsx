"use client"

import { useState, useEffect } from 'react';

export default function Chronometer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [preset, setPreset] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          // If there's a preset and we've reached it, stop the timer
          if (preset && prevTime >= preset) {
            setIsRunning(false);
            return preset;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, preset]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handlePreset = (seconds: number) => {
    setPreset(seconds);
    setTime(0);
    setIsRunning(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Chronometer</h1>
      
      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-xl font-semibold text-center">Rest Timer</h2>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="text-5xl font-bold mb-6">{formatTime(time)}</div>
          
          <div className="flex gap-2 mb-4">
            {isRunning ? (
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={handlePause}
              >
                Pause
              </button>
            ) : (
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleStart}
              >
                Start
              </button>
            )}
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-xl font-semibold text-center">Preset Timers</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(30)}
          >
            30s
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(60)}
          >
            1min
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(90)}
          >
            1min 30s
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(120)}
          >
            2min
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(180)}
          >
            3min
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePreset(300)}
          >
            5min
          </button>
        </div>
      </div>
    </div>
  );
}
