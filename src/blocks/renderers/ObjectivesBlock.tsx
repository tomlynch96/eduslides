import type { ObjectivesBlockInstance } from '../../types/core';

interface ObjectivesBlockProps {
  block: ObjectivesBlockInstance;
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
}

export function ObjectivesBlock({ 
  block, 
  lessonObjectives, 
  completedObjectives, 
  onToggleObjective 
}: ObjectivesBlockProps) {
  const { showCheckboxes } = block.content;

  if (!lessonObjectives || lessonObjectives.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Learning Objectives
        </h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            No objectives set for this lesson. Use the "Lesson Objectives" section above to add objectives.
          </p>
        </div>
      </div>
    );
  }

  const completedCount = completedObjectives.length;
  const totalCount = lessonObjectives.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6">
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
                  onChange={() => onToggleObjective(objective.id)}
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
              
              {isCompleted && (
                <span className="text-green-600 text-xl">✓</span>
              )}
            </div>
          );
        })}
      </div>

      {showCheckboxes && completedCount === totalCount && totalCount > 0 && (
        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
          <span className="text-lg font-semibold text-green-800">
            🎉 All objectives completed!
          </span>
        </div>
      )}
    </div>
  );
}