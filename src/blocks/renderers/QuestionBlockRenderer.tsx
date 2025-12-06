// ============================================
// QUESTION BLOCK RENDERER - with Instructions Field
// ============================================

import { useState } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { QuestionBlockInstance } from '../../types/core';

export function QuestionBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<QuestionBlockInstance>) {
  const { questions, answers, instructions } = block.content;
  
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

  // EDIT MODE
  if (mode === 'edit') {
    const questionsText = questions.join('\n');
    const answersText = answers.join('\n');

    const handleQuestionsTextChange = (value: string) => {
      const lines = value.split('\n');
      onContentChange?.({
        ...block.content,
        questions: lines,
      });
    };

    const handleAnswersTextChange = (value: string) => {
      const lines = value.split('\n');
      onContentChange?.({
        ...block.content,
        answers: lines,
      });
    };

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Questions & Answers
        </h3>

        <div className="space-y-4">
          {/* Instructions field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions (optional)
            </label>
            <input
              type="text"
              value={instructions || ''}
              onChange={(e) => onContentChange?.({
                ...block.content,
                instructions: e.target.value,
              })}
              placeholder="e.g., Answer the following questions in complete sentences"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to show default "Questions & Answers"
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questions (one per line)
            </label>
            <textarea
              value={questionsText}
              onChange={(e) => handleQuestionsTextChange(e.target.value)}
              placeholder="Enter questions, one per line"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={8}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {questions.filter(q => q.trim()).length} question(s)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answers (one per line, matching questions above)
            </label>
            <textarea
              value={answersText}
              onChange={(e) => handleAnswersTextChange(e.target.value)}
              placeholder="Enter answers, one per line"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              {answers.filter(a => a.trim()).length} answer(s)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Each answer should correspond to the question in the same position.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE - Ultra-compact with hover controls
  return (
    <>
      <div className="p-4 bg-white rounded-xl h-full flex flex-col" style={{ maxWidth: 'none', width: '100%' }}>
        {/* Header - shows custom instructions or default title */}
        <div className="flex items-center justify-between mb-3 group">
          <h3 className="text-3xl font-bold text-gray-800">
            {instructions || 'Questions & Answers'}
          </h3>
          
          {/* Controls appear on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                revealAll();
              }}
              className="px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
              title="Reveal all answers"
            >
              👁️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                hideAll();
              }}
              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Hide all answers"
            >
              🙈
            </button>
          </div>
        </div>

        {/* Questions list - maximum space efficiency */}
        <div className="space-y-2 flex-1 w-full">
          {questions.map((question, index) => {
            const isRevealed = revealedAnswers.has(index);
            
            return (
              <div
                key={index}
                className="group relative bg-amber-50 rounded-lg px-3 py-2.5 hover:shadow-md transition-shadow border border-amber-200"
                style={{ width: '100%', maxWidth: 'none' }}
              >
                {/* Inline layout: number + question on same line */}
                <div className="flex items-start gap-2.5">
                  {/* Question number - inline, bold */}
                  <div className="text-3xl font-bold text-gray-400 flex-shrink-0 leading-tight">
                    {index + 1})
                  </div>
                  
                  {/* Question text - takes all remaining space */}
                  <div className="flex-1 min-w-0">
                    <div className="text-3xl font-medium text-gray-800 leading-tight">
                      {question}
                    </div>

                    {/* Answer - appears below when revealed */}
                    {isRevealed && (
                      <div className="mt-2.5 pl-3 border-l-4 border-emerald-400 bg-emerald-50 py-2 pr-2 rounded-r">
                        <div className="text-xl text-gray-800">
                          {answers[index]}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover controls - top right, symbols only */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAnswer(index);
                      }}
                      className="p-1.5 text-lg hover:bg-blue-100 rounded transition-colors"
                      title={isRevealed ? 'Hide answer' : 'Show answer'}
                    >
                      {isRevealed ? '🙈' : '👁️'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        enterFullscreen(index);
                      }}
                      className="p-1.5 text-lg hover:bg-purple-100 rounded transition-colors"
                      title="Fullscreen"
                    >
                      ⛶
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen mode */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-white z-[100000] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <button
              onClick={exitFullscreen}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
            >
              Exit Fullscreen
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="max-w-4xl w-full">
              {/* Question */}
              <div className="mb-12">
                <div className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                  Question
                </div>
                <div className="text-5xl font-bold text-gray-800 leading-tight">
                  {questions[currentQuestionIndex]}
                </div>
              </div>

              {/* Answer */}
              {showAnswerInFullscreen ? (
                <div className="p-8 bg-emerald-100 border-2 border-emerald-400 rounded-xl">
                  <div className="text-sm text-emerald-700 mb-3 uppercase tracking-wide">
                    Answer
                  </div>
                  <div className="text-3xl text-gray-800">
                    {answers[currentQuestionIndex]}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswerInFullscreen(true)}
                  className="px-6 py-3 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors font-medium"
                >
                  Show Answer
                </button>
              )}
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 rounded transition-colors"
            >
              ← Previous
            </button>
            
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {questions.length}
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 rounded transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}