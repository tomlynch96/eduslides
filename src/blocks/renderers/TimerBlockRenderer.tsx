// ============================================
// TIMER BLOCK RENDERER (Registry-Compatible)
// ============================================

import { useState, useEffect, useRef } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { TimerBlockInstance } from '../../types/core';

export function TimerBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<TimerBlockInstance>) {
  const { duration, label, autoStart } = block.content;
  
  // Timer state (persists in view mode)
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart || false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0 && mode === 'view') {
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
  }, [isRunning, timeRemaining, mode]);

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

  // EDIT MODE
  if (mode === 'edit') {
    const editMinutes = Math.floor(duration / 60);
    const editSeconds = duration % 60;

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => onContentChange?.({
                ...block.content,
                label: e.target.value,
              })}
              placeholder="e.g., Group Discussion Time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Minutes</label>
                <input
                  type="number"
                  value={editMinutes}
                  onChange={(e) => {
                    const mins = parseInt(e.target.value) || 0;
                    onContentChange?.({
                      ...block.content,
                      duration: mins * 60 + editSeconds,
                    });
                  }}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Seconds</label>
                <input
                  type="number"
                  value={editSeconds}
                  onChange={(e) => {
                    const secs = parseInt(e.target.value) || 0;
                    onContentChange?.({
                      ...block.content,
                      duration: editMinutes * 60 + secs,
                    });
                  }}
                  min="0"
                  max="59"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total: {duration} seconds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editAutoStart"
              checked={autoStart}
              onChange={(e) => onContentChange?.({
                ...block.content,
                autoStart: e.target.checked,
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="editAutoStart" className="text-sm text-gray-700">
              Auto-start timer when slide loads
            </label>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
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
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            ▶ Start
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePause();
            }}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ↻ Reset
        </button>
      </div>
    </div>
  );
}