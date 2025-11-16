import { useState } from 'react';

interface LessonObjective {
  id: string;
  text: string;
}

interface ObjectivesModalProps {
  objectives: LessonObjective[];
  onUpdate: (objectives: LessonObjective[]) => void;
  onClose: () => void;
}

export function ObjectivesModal({ objectives, onUpdate, onClose }: ObjectivesModalProps) {
  const [objectivesText, setObjectivesText] = useState(
    objectives.map(obj => obj.text).join('\n')
  );

  const handleSave = () => {
    const lines = objectivesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const newObjectives = lines.map((text, index) => ({
      id: `obj-${Date.now()}-${index}`,
      text
    }));
    
    onUpdate(newObjectives);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Lesson Objectives
          </h2>
        </div>

        <div className="px-6 py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Objectives (one per line)
          </label>
          <textarea
            value={objectivesText}
            onChange={(e) => setObjectivesText(e.target.value)}
            placeholder="Enter lesson objectives, one per line:
Understand wave properties
Calculate wave speed
Apply concepts to real scenarios"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={10}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            These objectives will be displayed by any Objectives blocks in your lesson.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Save Objectives
          </button>
        </div>
      </div>
    </div>
  );
}