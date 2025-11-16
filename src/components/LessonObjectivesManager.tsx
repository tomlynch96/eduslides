import { useState } from 'react';

interface LessonObjective {
  id: string;
  text: string;
}

interface LessonObjectivesManagerProps {
  objectives: LessonObjective[];
  onUpdate: (objectives: LessonObjective[]) => void;
}

export function LessonObjectivesManager({ objectives, onUpdate }: LessonObjectivesManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [objectivesText, setObjectivesText] = useState('');

  const handleStartEdit = () => {
    const text = objectives.map(obj => obj.text).join('\n');
    setObjectivesText(text);
    setIsEditing(true);
  };

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
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setObjectivesText('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-800">
          Lesson Objectives
        </h3>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {objectives.length > 0 ? 'Edit Objectives' : 'Set Objectives'}
          </button>
        )}
      </div>

      {!isEditing && objectives.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1">
          {objectives.map((obj) => (
            <li key={obj.id} className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{obj.text}</span>
            </li>
          ))}
        </ul>
      )}

      {!isEditing && objectives.length === 0 && (
        <p className="text-sm text-gray-500">
          No objectives set for this lesson
        </p>
      )}

      {isEditing && (
        <div className="space-y-3">
          <textarea
            value={objectivesText}
            onChange={(e) => setObjectivesText(e.target.value)}
            placeholder="Enter lesson objectives, one per line:
Understand wave properties
Calculate wave speed
Apply concepts to real scenarios"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={6}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              Save Objectives
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}