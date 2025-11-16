import { useState, useEffect, useRef } from 'react';
import type { TimerBlockInstance } from '../../types/core';

interface TimerBlockProps {
  block: TimerBlockInstance;
}

export function TimerBlock({ block }: TimerBlockProps) {
  const { duration, label, autoStart } = block.content;
  
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart || false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const handleStart = () => {
    if (timeRemaining > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeRemaining(duration);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="p-6">
      {label && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {label}
        </h3>
      )}

      <div className={`text-center mb-6 ${isFinished ? 'animate-pulse' : ''}`}>
        <div className={`text-6xl font-bold ${
          isFinished ? 'text-red-600' : 
          timeRemaining < 10 ? 'text-orange-600' : 
          'text-gray-900'
        }`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        {isFinished && (
          <div className="text-lg font-medium text-red-600 mt-2">
            Time's up!
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning && timeRemaining > 0 && (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            ▶ Start
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={handlePause}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ↻ Reset
        </button>
      </div>
    </div>
  );
}