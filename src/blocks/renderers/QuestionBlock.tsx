import { useState } from 'react';
import type { QuestionBlockInstance } from '../../types/core';

interface QuestionBlockProps {
  block: QuestionBlockInstance;
  isEditing?: boolean;
  onUpdate?: (updatedBlock: QuestionBlockInstance) => void;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
}

export function QuestionBlock({ 
  block,
  isEditing = false,
  onUpdate,
  onStartEdit,
  onStopEdit
}: QuestionBlockProps) {
  const { questions, answers } = block.content;
  
  // Edit mode state
  const [editQuestions, setEditQuestions] = useState<string[]>(questions.length > 0 ? questions : ['']);
  const [editAnswers, setEditAnswers] = useState<string[]>(answers.length > 0 ? answers : ['']);
  
  // View mode state
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

  const handleCancel = () => {
    setEditQuestions(questions.length > 0 ? questions : ['']);
    setEditAnswers(answers.length > 0 ? answers : ['']);
    if (onStopEdit) {
      onStopEdit();
    }
  };

  // EDIT MODE
  if (isEditing) {
    // Convert arrays to text for editing
    const questionsText = editQuestions.join('\n');
    const answersText = editAnswers.join('\n');

    const handleQuestionsTextChange = (text: string) => {
      const lines = text.split('\n');
      setEditQuestions(lines);
    };

    const handleAnswersTextChange = (text: string) => {
      const lines = text.split('\n');
      setEditAnswers(lines);
    };

    const handleSaveText = () => {
      // Filter out empty lines and trim
      const filteredQuestions = editQuestions
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      const filteredAnswers = editAnswers
        .map(a => a.trim())
        .filter(a => a.length > 0);

      if (filteredQuestions.length === 0 || filteredAnswers.length === 0) {
        alert('Please add at least one question and answer');
        return;
      }

      if (filteredQuestions.length !== filteredAnswers.length) {
        alert(`Mismatch: You have ${filteredQuestions.length} questions but ${filteredAnswers.length} answers. They must match!`);
        return;
      }

      if (onUpdate) {
        onUpdate({
          ...block,
          content: {
            questions: filteredQuestions,
            answers: filteredAnswers,
          },
          updatedAt: new Date().toISOString(),
        });
      }
      if (onStopEdit) {
        onStopEdit();
      }
    };

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Questions & Answers
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questions (one per line)
            </label>
            <textarea
              value={questionsText}
              onChange={(e) => handleQuestionsTextChange(e.target.value)}
              placeholder="Enter questions, one per line:
What is the speed of light?
What is Newton's first law?
Define wavelength."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              rows={8}
              autoFocus
            />
            <p className="text-xs text-gray-600 mt-1">
              {editQuestions.filter(q => q.trim()).length} question(s)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answers (one per line, matching questions above)
            </label>
            <textarea
              value={answersText}
              onChange={(e) => handleAnswersTextChange(e.target.value)}
              placeholder="Enter answers in the same order as questions:
3 × 10⁸ m/s
An object at rest stays at rest unless acted upon by force
The distance between successive wave crests"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              rows={8}
            />
            <p className="text-xs text-gray-600 mt-1">
              {editAnswers.filter(a => a.trim()).length} answer(s)
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
            <span className="font-bold">Tip:</span> Make sure the number of questions matches the number of answers. Each answer should correspond to the question in the same position.
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSaveText}
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

  // VIEW MODE - List view
  return (
    <div 
      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onStartEdit}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Questions & Answers
        </h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              revealAll();
            }}
            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Reveal All
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              hideAll();
            }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    enterFullscreen(index);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAnswer(index);
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  Reveal Answer
                </button>
              )}

              {isRevealed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAnswer(index);
                  }}
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