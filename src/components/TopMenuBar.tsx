import { useState } from 'react';
import { FileMenu } from './FileMenu';
import { LoadLessonMenu } from './LoadLessonMenu';
import { ObjectivesModal } from './ObjectivesModal';
import { SaveLessonModal } from './SaveLessonModal';
import type { SimpleLessonData } from '../storage/storage';
import type { BlockTypeName } from '../types/core';  // ADD THIS LINE
import { InsertBlockMenu } from './InsertBlockMenu';
import { NewSlideDropdown } from './NewSlideDropdown';
import type { SimpleSlide, BlockInstance } from '../types/core';

interface TopMenuBarProps {
  currentLessonName: string | null;
  currentSlideIndex: number;
  totalSlides: number;
  savedLessons: SimpleLessonData[];
  currentLessonId: string | null;
  lessonObjectives: Array<{ id: string; text: string }>;
  onUpdateObjectives: (objectives: Array<{ id: string; text: string }>) => void;
  onNewLesson: () => void;
  onSaveLesson: (name: string) => void;
  onLoadLesson: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onExportLesson: () => void;
  onImportLesson: (file: File) => void;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onNewSlide: () => void;
  onDeleteSlide: () => void;
  onPresent: () => void;
  onInsertBlock: (blockType: BlockInstance) => void;  // Change from string
  onNewSlideFromTemplate: (slide: SimpleSlide, blocks: BlockInstance[]) => void;  // ADD THIS
  viewMode: 'edit' | 'overview';  // ADD THIS
  onToggleViewMode: () => void;
}

export function TopMenuBar({
  currentLessonName,
  currentSlideIndex,
  totalSlides,
  savedLessons,
  currentLessonId,
  lessonObjectives,
  onUpdateObjectives,
  onNewLesson,
  onSaveLesson,
  onLoadLesson,
  onDeleteLesson,
  onExportLesson,
  onImportLesson,
  onPreviousSlide,
  onNextSlide,
  onNewSlide,
  onNewSlideFromTemplate,
  onDeleteSlide,
  onPresent,
  onInsertBlock,
  viewMode,           // ADD THIS
  onToggleViewMode,
}: TopMenuBarProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImportLesson(file);
      }
    };
    input.click();
  };

  const fileMenuItems = [
    { label: 'New Lesson', onClick: onNewLesson },
    { label: 'Save Lesson', onClick: () => setShowSaveModal(true) },
    { separator: true },
    { label: 'Export JSON', onClick: onExportLesson },
    { label: 'Import JSON', onClick: handleImportClick },
  ];



  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;

  return (
    <>
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileMenu label="File" items={fileMenuItems} />
            <InsertBlockMenu onInsertBlock={onInsertBlock} />
            <LoadLessonMenu
              savedLessons={savedLessons}
              currentLessonId={currentLessonId}
              onLoad={onLoadLesson}
              onDelete={onDeleteLesson}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-700">
              {currentLessonName || 'Untitled Lesson'}
            </div>
            <button
              onClick={onPresent}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors text-sm"
            >
              Present
            </button>
          </div>
        </div>

        <div className="px-6 py-2 bg-gray-50 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowObjectivesModal(true)}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Objectives {lessonObjectives.length > 0 && `(${lessonObjectives.length})`}
            </button>
            <button
              onClick={onToggleViewMode}
              className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              {viewMode === 'edit' ? '📊 Overview' : '✏️ Edit'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPreviousSlide}
              disabled={isFirstSlide}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 rounded transition-colors"
            >
              Prev
            </button>

            <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm font-medium">
              Slide {currentSlideIndex + 1} of {totalSlides}
            </div>

            <button
              onClick={onNextSlide}
              disabled={isLastSlide}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 rounded transition-colors"
            >
              Next
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <NewSlideDropdown
              onCreateBlankSlide={onNewSlide}
              onCreateSlideFromTemplate={onNewSlideFromTemplate}
            />

            <button
              onClick={onDeleteSlide}
              disabled={totalSlides === 1}
              className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-700 rounded transition-colors"
            >
              Delete Slide
            </button>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveLessonModal
          currentLessonName={currentLessonName || undefined}
          onSave={onSaveLesson}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showObjectivesModal && (
        <ObjectivesModal
          objectives={lessonObjectives}
          onUpdate={onUpdateObjectives}
          onClose={() => setShowObjectivesModal(false)}
        />
      )}
    </>
  );
}