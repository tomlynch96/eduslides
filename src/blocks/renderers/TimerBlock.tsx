import { useState, useEffect, useRef } from 'react';
import type { TimerBlockInstance } from '../../types/core';

interface TimerBlockProps {
  block: TimerBlockInstance;
  isEditing?: boolean;
  onUpdate?: (updatedBlock: TimerBlockInstance) => void;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
}

export function TimerBlock({ 
  block,
  isEditing = false,
  onUpdate,
  onStartEdit,
  onStopEdit 
}: TimerBlockProps) {
  const { duration, label, autoStart } = block.content;
  
  // Edit mode state
  const [editDuration, setEditDuration] = useState(duration);
  const [editLabel, setEditLabel] = useState(label);
  const [editAutoStart, setEditAutoStart] = useState(autoStart);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart || false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0 && !isEditing) {
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
  }, [isRunning, timeRemaining, isEditing]);

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

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: {
          duration: editDuration,
          label: editLabel,
          autoStart: editAutoStart,
        },
        updatedAt: new Date().toISOString(),
      });
    }
    // Reset timer to new duration
    setTimeRemaining(editDuration);
    setIsRunning(false);
    setIsFinished(false);
    if (onStopEdit) {
      onStopEdit();
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditDuration(duration);
    setEditLabel(label);
    setEditAutoStart(autoStart);
    if (onStopEdit) {
      onStopEdit();
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // EDIT MODE
  if (isEditing) {
    const editMinutes = Math.floor(editDuration / 60);
    const editSeconds = editDuration % 60;

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label (optional)
            </label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
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
                    setEditDuration(mins * 60 + editSeconds);
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
                    setEditDuration(editMinutes * 60 + secs);
                  }}
                  min="0"
                  max="59"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total: {editDuration} seconds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editAutoStart"
              checked={editAutoStart}
              onChange={(e) => setEditAutoStart(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="editAutoStart" className="text-sm text-gray-700">
              Auto-start timer when slide loads
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // VIEW MODE
  return (
    <div 
      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onStartEdit}
    >
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