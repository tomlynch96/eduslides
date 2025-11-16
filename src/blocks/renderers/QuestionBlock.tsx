import { useState } from 'react';
import type { QuestionBlockInstance } from '../../types/core';

interface QuestionBlockProps {
  block: QuestionBlockInstance;
}

export function QuestionBlock({ block }: QuestionBlockProps) {
  const { questions, answers } = block.content;
  
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswerInFullscreen, setShowAnswerInFullscreen] = useState(false);

  const toggleAnswer = (index: number) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedAnswers(newRevealed);
  };

  const revealAll = () => {
    setRevealedAnswers(new Set(questions.map((_, i) => i)));
  };

  const hideAll = () => {
    setRevealedAnswers(new Set());
  };

  const enterFullscreen = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowAnswerInFullscreen(false);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setShowAnswerInFullscreen(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswerInFullscreen(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswerInFullscreen(false);
    }
  };

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
          <div className="text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <button
            onClick={exitFullscreen}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Exit Fullscreen
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="max-w-4xl w-full">
            <div className="text-sm text-gray-500 mb-4">Question:</div>
            <div className="text-4xl font-bold text-gray-900 mb-12">
              {questions[currentQuestionIndex]}
            </div>

            {showAnswerInFullscreen ? (
              <div className="mt-8">
                <div className="text-sm text-green-600 mb-4">Answer:</div>
                <div className="text-2xl text-gray-800 bg-green-50 border-2 border-green-500 rounded-lg p-6">
                  {answers[currentQuestionIndex]}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswerInFullscreen(true)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl font-medium transition-colors"
              >
                Show Answer
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            ← Previous
          </button>
          
          <div className="text-gray-600">
            {currentQuestionIndex + 1} / {questions.length}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Questions & Answers
        </h3>
        <div className="flex gap-2">
          <button
            onClick={revealAll}
            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Reveal All
          </button>
          <button
            onClick={hideAll}
            className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Hide All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const isRevealed = revealedAnswers.has(index);
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">
                    Question {index + 1}:
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {question}
                  </div>
                </div>
                <button
                  onClick={() => enterFullscreen(index)}
                  className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors whitespace-nowrap"
                >
                  Fullscreen
                </button>
              </div>

              {isRevealed ? (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm text-green-700 mb-1">Answer:</div>
                  <div className="text-gray-800">{answers[index]}</div>
                </div>
              ) : (
                <button
                  onClick={() => toggleAnswer(index)}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  Reveal Answer
                </button>
              )}

              {isRevealed && (
                <button
                  onClick={() => toggleAnswer(index)}
                  className="mt-2 ml-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  Hide Answer
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}