import { useState, useRef, useEffect } from 'react';
import type { SimpleLessonData } from '../storage/storage';

interface LoadLessonMenuProps {
  savedLessons: SimpleLessonData[];
  currentLessonId: string | null;
  onLoad: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
}

export function LoadLessonMenu({ 
  savedLessons, 
  currentLessonId, 
  onLoad, 
  onDelete 
}: LoadLessonMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLoad = (lessonId: string) => {
    if (window.confirm('Load this lesson? Any unsaved changes will be lost.')) {
      onLoad(lessonId);
      setIsOpen(false);
    }
  };

  const handleDelete = (lessonId: string, lessonName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete lesson "${lessonName}"?`)) {
      onDelete(lessonId);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={savedLessons.length === 0}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:text-gray-400 disabled:hover:bg-white"
      >
        Load Lesson {savedLessons.length > 0 && `(${savedLessons.length})`}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {savedLessons.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No saved lessons yet
            </div>
          ) : (
            savedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  lesson.id === currentLessonId ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleLoad(lesson.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {lesson.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {lesson.slides.length} slides • {new Date(lesson.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(lesson.id, lesson.name, e)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}