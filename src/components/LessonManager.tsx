import { useState } from 'react';
import type { SimpleLessonData } from '../storage/storage';

interface LessonManagerProps {
  savedLessons: SimpleLessonData[];
  currentLessonId: string | null;
  onSave: (name: string) => void;
  onLoad: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
  onNew: () => void;
}

export function LessonManager({ 
  savedLessons, 
  currentLessonId,
  onSave, 
  onLoad, 
  onDelete,
  onNew 
}: LessonManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [lessonName, setLessonName] = useState('');

  const handleSave = () => {
    if (!lessonName.trim()) {
      alert('Please enter a lesson name');
      return;
    }
    onSave(lessonName.trim());
    setLessonName('');
    setShowSaveDialog(false);
  };

  const handleLoad = (lessonId: string) => {
    if (window.confirm('Load this lesson? Any unsaved changes will be lost.')) {
      onLoad(lessonId);
    }
  };

  const handleDelete = (lessonId: string, lessonName: string) => {
    if (window.confirm(`Delete lesson "${lessonName}"?`)) {
      onDelete(lessonId);
    }
  };

  const currentLesson = savedLessons.find(l => l.id === currentLessonId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            💾 Lesson Manager
          </h2>
          {currentLesson && (
            <p className="text-sm text-gray-600 mt-1">
              Current: <span className="font-medium">{currentLesson.name}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onNew}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors font-medium"
          >
            New Lesson
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
          >
            Save Lesson
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="e.g., Wave Physics - Introduction"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setLessonName('');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Lessons List */}
      {savedLessons.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Saved Lessons ({savedLessons.length})
          </h3>
          <div className="space-y-2">
            {savedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  lesson.id === currentLessonId
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {lesson.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lesson.slides.length} slide{lesson.slides.length !== 1 ? 's' : ''} • 
                    Saved {new Date(lesson.savedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {lesson.id !== currentLessonId && (
                    <button
                      onClick={() => handleLoad(lesson.id)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Load
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(lesson.id, lesson.name)}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedLessons.length === 0 && !showSaveDialog && (
        <p className="text-gray-500 text-sm text-center py-4">
          No saved lessons yet. Click "Save Lesson" to save your work!
        </p>
      )}
    </div>
  );
}