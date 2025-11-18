import { useState } from 'react';
import type { ObjectivesBlockInstance } from '../../types/core';

interface ObjectivesBlockProps {
  block: ObjectivesBlockInstance;
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
  isEditing?: boolean;
  onUpdate?: (updatedBlock: ObjectivesBlockInstance) => void;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
}

export function ObjectivesBlock({ 
  block, 
  lessonObjectives, 
  completedObjectives, 
  onToggleObjective,
  isEditing = false,
  onUpdate,
  onStartEdit,
  onStopEdit
}: ObjectivesBlockProps) {
  const { showCheckboxes } = block.content;
  const [editShowCheckboxes, setEditShowCheckboxes] = useState(showCheckboxes);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: {
          ...block.content,
          showCheckboxes: editShowCheckboxes,
        },
        updatedAt: new Date().toISOString(),
      });
    }
    if (onStopEdit) {
      onStopEdit();
    }
  };

  const handleCancel = () => {
    setEditShowCheckboxes(showCheckboxes);
    if (onStopEdit) {
      onStopEdit();
    }
  };

  // EDIT MODE
  if (isEditing) {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Objectives Block Settings
        </h3>

        <div className="space-y-4">
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
              checked={editShowCheckboxes}
              onChange={(e) => setEditShowCheckboxes(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="editShowCheckboxes" className="text-sm text-gray-700">
              Show interactive checkboxes (allow ticking off during lesson)
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
  if (!lessonObjectives || lessonObjectives.length === 0) {
    return (
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onStartEdit}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Learning Objectives
        </h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            No objectives set for this lesson. Use the "Objectives" button in the top menu to add objectives.
          </p>
        </div>
      </div>
    );
  }

  const completedCount = completedObjectives.length;
  const totalCount = lessonObjectives.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div 
      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onStartEdit}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Learning Objectives
        </h3>
        {showCheckboxes && (
          <div className="text-sm text-gray-600">
            {completedCount} of {totalCount} completed
          </div>
        )}
      </div>

      {showCheckboxes && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {lessonObjectives.map((objective) => {
          const isCompleted = completedObjectives.includes(objective.id);
          
          return (
            <div
              key={objective.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isCompleted ? 'bg-green-50' : 'bg-gray-50'
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
                  className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
              ) : (
                <span className="mt-1 text-blue-600 font-bold">•</span>
              )}
              
              <span className={`flex-1 text-gray-800 ${
                isCompleted ? 'line-through text-gray-500' : ''
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