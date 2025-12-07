import { useState } from 'react';
import type { SimpleSlide, BlockInstance } from '../types/core';

interface SlideOverviewProps {
  slides: SimpleSlide[];
  blocks: BlockInstance[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
  onSlideReorder: (fromIndex: number, toIndex: number) => void;
  onSlideDelete: (index: number) => void;
  onSlideDuplicate: (index: number) => void;
  onSlideAdd: () => void;
}

export function SlideOverview({
  slides,
  blocks,
  currentSlideIndex,
  onSlideSelect,
  onSlideReorder,
  onSlideDelete,
  onSlideDuplicate,
  onSlideAdd,
}: SlideOverviewProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onSlideReorder(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const getSlideBlocks = (slide: SimpleSlide): BlockInstance[] => {
    return blocks.filter(b => slide.blockIds.includes(b.id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slide Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            {slides.length} slide{slides.length !== 1 ? 's' : ''} in this lesson
          </p>
        </div>
        <button
          onClick={onSlideAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          + Add Slide
        </button>
      </div>

      {/* Slide Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slides.map((slide, index) => {
          const slideBlocks = getSlideBlocks(slide);
          const isCurrent = index === currentSlideIndex;
          const isDragging = draggedIndex === index;
          const isDropTarget = dropTargetIndex === index;

          return (
            <div
              key={slide.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group cursor-move rounded-lg border-2 transition-all
                ${isCurrent ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-blue-300'}
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                ${isDropTarget && !isDragging ? 'ring-2 ring-blue-400' : ''}
              `}
            >
              {/* Slide Number Badge */}
              <div className="absolute -top-2 -left-2 z-10 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>

              {/* Current Slide Indicator */}
              {isCurrent && (
                <div className="absolute -top-2 -right-2 z-10 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}

              {/* Slide Preview */}
              <div
                onClick={() => onSlideSelect(index)}
                className="relative bg-gray-50 rounded-t-lg overflow-hidden cursor-pointer"
                style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
              >
                <div className="absolute inset-0 p-2 flex flex-col">
                  {/* Title if exists */}
                  {slide.title && (
                    <div className="text-xs font-semibold text-gray-700 mb-1 truncate bg-white px-2 py-1 rounded">
                      {slide.title}
                    </div>
                  )}

                  {/* Block count */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">
                        {slideBlocks.length === 0 ? '📄' : '📦'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {slideBlocks.length} block{slideBlocks.length !== 1 ? 's' : ''}
                      </div>
                      {slideBlocks.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {slideBlocks.map(b => b.type).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layout indicator */}
                  <div className="text-xs text-gray-500 text-center">
                    {slide.layout}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
                    Click to edit
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2 bg-white rounded-b-lg border-t border-gray-200 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSlideDuplicate(index);
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  title="Duplicate slide"
                >
                  📋 Copy
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slides.length === 1) {
                      alert('Cannot delete the last slide');
                      return;
                    }
                    if (window.confirm('Delete this slide?')) {
                      onSlideDelete(index);
                    }
                  }}
                  disabled={slides.length === 1}
                  className="flex-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-700 rounded transition-colors"
                  title="Delete slide"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Tips:</strong> Drag slides to reorder • Click a slide to edit it • Use Copy to duplicate slides
        </div>
      </div>
    </div>
  );
}