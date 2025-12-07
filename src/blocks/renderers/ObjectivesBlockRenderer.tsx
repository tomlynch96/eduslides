// ============================================
// OBJECTIVES BLOCK RENDERER - REDESIGNED
// Content-First, Celebration on Completion
// ============================================

import { useState, useEffect } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { ObjectivesBlockInstance } from '../../types/core';
import { useLessonContext } from '../../LessonContext';

export function ObjectivesBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<ObjectivesBlockInstance>) {
  const { showCheckboxes, instructions } = block.content;
  const { lessonObjectives, completedObjectives, onToggleObjective } = useLessonContext();
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  const completedCount = completedObjectives.length;
  const totalCount = lessonObjectives?.length || 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // Trigger celebration when all objectives are completed
  useEffect(() => {
    if (allCompleted && previousCompletedCount < totalCount) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPreviousCompletedCount(completedCount);
  }, [completedCount, totalCount, allCompleted]);

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Objectives Block
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
              placeholder="e.g., By the end of this lesson, you will be able to..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to show default "Learning Objectives"
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-2">
              This block displays the lesson-level objectives you set in the top menu bar.
            </p>
            <p className="text-xs text-gray-600">
              Use the "Objectives" button in the menu to edit the actual objective list.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editShowCheckboxes"
              checked={showCheckboxes}
              onChange={(e) => onContentChange?.({
                ...block.content,
                showCheckboxes: e.target.checked,
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="editShowCheckboxes" className="text-sm text-gray-700">
              Show interactive checkboxes (allow ticking off during lesson)
            </label>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  if (!lessonObjectives || lessonObjectives.length === 0) {
    return (
      <div className="p-4 bg-white h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-2">🎯</div>
          <p className="text-lg">No objectives set</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white h-full flex flex-col relative">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-3xl font-bold text-gray-800">
          {instructions || 'Learning Objectives'}
        </h3>
      </div>

      {/* Progress bar - shows when checkboxes enabled */}
      {showCheckboxes && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                allCompleted ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Well done message */}
      {showCelebration && (
        <div className="mb-3 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg text-center animate-pulse">
          <p className="text-2xl font-bold text-emerald-700">🎉 Well done! All objectives complete!</p>
        </div>
      )}

      {/* Objectives list */}
      <div className="space-y-3 flex-1">
        {lessonObjectives.map((objective) => {
          const isCompleted = completedObjectives.includes(objective.id);
          
          return (
            <div
              key={objective.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all border-2 ${
                isCompleted 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              {showCheckboxes ? (
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleObjective(objective.id);
                  }}
                  className="mt-1.5 w-6 h-6 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                  onClick={(e) => e.stopPropagation()} 
                />
              ) : (
                <span className="mt-1 text-amber-500 font-bold text-2xl flex-shrink-0">•</span>
              )}
              
              <span className={`flex-1 text-3xl leading-tight ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {objective.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}