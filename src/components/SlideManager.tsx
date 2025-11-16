interface SlideManagerProps {
    currentSlideIndex: number;
    totalSlides: number;
    onPrevious: () => void;
    onNext: () => void;
    onNewSlide: () => void;
    onDeleteSlide: () => void;
    onPresent: () => void;
  }
  
  export function SlideManager({ 
    currentSlideIndex, 
    totalSlides, 
    onPrevious, 
    onNext, 
    onNewSlide,
    onDeleteSlide,
    onPresent
  }: SlideManagerProps) {
    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === totalSlides - 1;
    
    const handleDelete = () => {
      if (totalSlides === 1) {
        alert("You can't delete the last slide!");
        return;
      }
      if (window.confirm(`Delete Slide ${currentSlideIndex + 1}?`)) {
        onDeleteSlide();
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              disabled={isFirstSlide}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 text-gray-700 rounded transition-colors font-medium"
            >
              ← Previous
            </button>
            
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded font-medium">
              Slide {currentSlideIndex + 1} of {totalSlides}
            </div>
            
            <button
              onClick={onNext}
              disabled={isLastSlide}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 text-gray-700 rounded transition-colors font-medium"
            >
              Next →
            </button>
          </div>
  
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPresent}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-medium text-lg"
            >
              🖥️ Present
            </button>
            
            <button
              onClick={onNewSlide}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium"
            >
              + New Slide
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors font-medium"
            >
              Delete Slide
            </button>
          </div>
        </div>
      </div>
    );
  }