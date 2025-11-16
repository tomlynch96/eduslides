import { useState, useEffect } from 'react';
import type { BlockInstance } from './types/core';
import { BlockCreator } from './components/BlockCreator';
import { BlockLibrary } from './components/BlockLibrary';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideManager } from './components/SlideManager';
import { LessonManager } from './components/LessonManager';
import { PresentationView } from './components/PresentationView';
import { ImportExport } from './components/ImportExport';
import { LessonObjectivesManager } from './components/LessonObjectivesManager';
import { 
  getAllBlockInstances, 
  deleteBlockInstance,
  saveSimpleLesson,
  getAllSimpleLessons,
  getSimpleLesson,
  deleteSimpleLesson,
  generateId,
  type SimpleLessonData
} from './storage/storage';
import { 
  exportLessonAsJSON, 
  downloadJSON, 
  validateAndParseJSON, 
  readJSONFile 
} from './lessonExport';
import { saveBlockInstance } from './storage/storage';

// Simple slide type - just tracks which blocks are on it
interface SimpleSlide {
  id: string;
  blockIds: string[];
}

function App() {
  // All blocks that have been created
  const [allBlocks, setAllBlocks] = useState<BlockInstance[]>([]);
  
  // All slides in the current lesson
  const [slides, setSlides] = useState<SimpleSlide[]>([
    { id: 'slide-1', blockIds: [] }
  ]);
  
  // Which slide we're currently viewing/editing
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Current lesson ID (null if unsaved)
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  // All saved lessons
  const [savedLessons, setSavedLessons] = useState<SimpleLessonData[]>([]);

  // Presentation mode
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Lesson objectives (separate from blocks)
  const [lessonObjectives, setLessonObjectives] = useState<Array<{
    id: string;
    text: string;
  }>>([]);
  
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);

  // Load blocks and lessons from storage on mount
  useEffect(() => {
    const savedBlocks = getAllBlockInstances();
    setAllBlocks(savedBlocks);
    
    const lessons = getAllSimpleLessons();
    setSavedLessons(lessons);
  }, []);

  // Get the current slide
  const currentSlide = slides[currentSlideIndex];
  
  // Get the actual block instances for the current slide
  const currentSlideBlocks = currentSlide.blockIds
    .map(id => allBlocks.find(block => block.id === id))
    .filter((block): block is BlockInstance => block !== undefined);

  const handleBlockCreated = (newBlock: BlockInstance) => {
    setAllBlocks([...allBlocks, newBlock]);
  };

  const handleAddToSlide = (blockId: string) => {
    if (!currentSlide.blockIds.includes(blockId)) {
      const updatedSlides = [...slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        blockIds: [...currentSlide.blockIds, blockId]
      };
      setSlides(updatedSlides);
    }
  };

  const handleRemoveFromSlide = (blockId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: currentSlide.blockIds.filter(id => id !== blockId)
    };
    setSlides(updatedSlides);
  };

  const handleDeleteBlock = (blockId: string) => {
    // Remove from storage
    deleteBlockInstance(blockId);
    
    // Remove from all blocks
    setAllBlocks(allBlocks.filter(block => block.id !== blockId));
    
    // Remove from ALL slides that contain it
    const updatedSlides = slides.map(slide => ({
      ...slide,
      blockIds: slide.blockIds.filter(id => id !== blockId)
    }));
    setSlides(updatedSlides);
  };

  const handleNewSlide = () => {
    const newSlide: SimpleSlide = {
      id: `slide-${Date.now()}`,
      blockIds: []
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDeleteSlide = () => {
    if (slides.length === 1) return;
    
    const updatedSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(updatedSlides);
    
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(updatedSlides.length - 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleSaveLesson = (name: string) => {
    const lessonData: SimpleLessonData = {
      id: currentLessonId || generateId(),
      name,
      slides: slides.map(slide => ({
        id: slide.id,
        blockIds: [...slide.blockIds]
      })),
      objectives: lessonObjectives.length > 0 ? lessonObjectives : undefined,
      objectivesState: completedObjectives.length > 0 ? { completed: completedObjectives } : undefined,
      savedAt: new Date().toISOString()
    };
    
    saveSimpleLesson(lessonData);
    setCurrentLessonId(lessonData.id);
    
    // Refresh saved lessons list
    const lessons = getAllSimpleLessons();
    setSavedLessons(lessons);
  };

  const handleLoadLesson = (lessonId: string) => {
    const lesson = getSimpleLesson(lessonId);
    if (!lesson) return;
    
    setSlides(lesson.slides.map(slide => ({
      id: slide.id,
      blockIds: [...slide.blockIds]
    })));
    setLessonObjectives(lesson.objectives || []);
    setCompletedObjectives(lesson.objectivesState?.completed || []);
    setCurrentLessonId(lesson.id);
    setCurrentSlideIndex(0);
  };

  const handleDeleteLesson = (lessonId: string) => {
    deleteSimpleLesson(lessonId);
    
    // Refresh saved lessons list
    const lessons = getAllSimpleLessons();
    setSavedLessons(lessons);
    
    // If we deleted the current lesson, clear the current lesson ID
    if (lessonId === currentLessonId) {
      setCurrentLessonId(null);
    }
  };

  const handleNewLesson = () => {
    if (window.confirm('Start a new lesson? Any unsaved changes will be lost.')) {
      setSlides([{ id: 'slide-1', blockIds: [] }]);
      setCurrentSlideIndex(0);
      setCurrentLessonId(null);
      setLessonObjectives([]);
      setCompletedObjectives([]);
    }
  };

  const handleExportLesson = () => {
    const lessonName = currentLessonId 
      ? savedLessons.find(l => l.id === currentLessonId)?.name || 'Untitled Lesson'
      : 'Untitled Lesson';

    const exportData = {
      slides,
      allBlocks,
      lessonName,
      objectives: lessonObjectives,
      objectivesState: completedObjectives.length > 0 ? { completed: completedObjectives } : undefined
    };

    const jsonString = exportLessonAsJSON(exportData);

    const filename = `${lessonName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.json`;
    downloadJSON(jsonString, filename);
  };

  const handleImportLesson = async (file: File) => {
    try {
      const jsonString = await readJSONFile(file);
      const result = validateAndParseJSON(jsonString);

      if (!result.success) {
        alert(`Import failed: ${result.error}`);
        return;
      }

      if (!result.data) {
        alert('Import failed: No data');
        return;
      }

      const importData = result.data;

      // Confirm with user
      if (!window.confirm(
        `Import lesson "${importData.lesson.name}"?\n\n` +
        `This will replace your current lesson with:\n` +
        `- ${importData.slides.length} slide(s)\n` +
        `- ${importData.blocks.length} block(s)\n\n` +
        `Make sure you've saved your current work!`
      )) {
        return;
      }

      // Import blocks (save to storage and state)
      const importedBlocks = importData.blocks;
      importedBlocks.forEach(block => {
        saveBlockInstance(block);
      });

      // Add imported blocks to allBlocks state
      const newAllBlocks = [...allBlocks];
      importedBlocks.forEach(block => {
        if (!newAllBlocks.find(b => b.id === block.id)) {
          newAllBlocks.push(block);
        }
      });
      setAllBlocks(newAllBlocks);

      // Import slides
      setSlides(importData.slides.map(slide => ({
        id: slide.id,
        blockIds: [...slide.blockIds],
      })));

      // Import objectives if present
      if (importData.lesson.objectives) {
        setLessonObjectives(importData.lesson.objectives);
      } else {
        setLessonObjectives([]);
      }
      
      if (importData.lesson.objectivesState) {
        setCompletedObjectives(importData.lesson.objectivesState.completed);
      } else {
        setCompletedObjectives([]);
      }

      setCurrentSlideIndex(0);
      setCurrentLessonId(null);

      alert(`Successfully imported "${importData.lesson.name}"!`);
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleObjective = (objectiveId: string) => {
    const newCompleted = completedObjectives.includes(objectiveId)
      ? completedObjectives.filter(id => id !== objectiveId)
      : [...completedObjectives, objectiveId];
    
    setCompletedObjectives(newCompleted);
  };

  // If in presentation mode, show presentation view
  if (isPresentationMode) {
    return (
      <PresentationView
        slides={slides}
        allBlocks={allBlocks}
        currentSlideIndex={currentSlideIndex}
        onNextSlide={handleNextSlide}
        onPreviousSlide={handlePreviousSlide}
        onExit={() => setIsPresentationMode(false)}
        lessonObjectives={lessonObjectives}
        completedObjectives={completedObjectives}
        onToggleObjective={handleToggleObjective}
      />
    );
  }

  // Otherwise show editing interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            EduSlides
          </h1>
          <p className="text-gray-600 mt-1">
            Block-based lesson builder for teachers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Lesson Manager */}
        <LessonManager
          savedLessons={savedLessons}
          currentLessonId={currentLessonId}
          onSave={handleSaveLesson}
          onLoad={handleLoadLesson}
          onDelete={handleDeleteLesson}
          onNew={handleNewLesson}
        />

        {/* Import/Export */}
        <ImportExport
          lessonName={
            currentLessonId 
              ? savedLessons.find(l => l.id === currentLessonId)?.name || 'Current Lesson'
              : 'Current Lesson'
          }
          onExport={handleExportLesson}
          onImport={handleImportLesson}
        />

        {/* Lesson Objectives Manager */}
        <LessonObjectivesManager
          objectives={lessonObjectives}
          onUpdate={setLessonObjectives}
        />

        {/* Slide Manager */}
        <SlideManager
          currentSlideIndex={currentSlideIndex}
          totalSlides={slides.length}
          onPrevious={handlePreviousSlide}
          onNext={handleNextSlide}
          onNewSlide={handleNewSlide}
          onDeleteSlide={handleDeleteSlide}
          onPresent={() => setIsPresentationMode(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Block Creator */}
            <BlockCreator onBlockCreated={handleBlockCreated} />
            
            {/* Block Library */}
            <BlockLibrary
              blocks={allBlocks}
              onAddToSlide={handleAddToSlide}
              onDeleteBlock={handleDeleteBlock}
            />
          </div>

          {/* Right Column: Slide Canvas */}
          <div>
            <SlideCanvas
              blocks={currentSlideBlocks}
              onRemoveBlock={handleRemoveFromSlide}
              lessonObjectives={lessonObjectives}
              completedObjectives={completedObjectives}
              onToggleObjective={handleToggleObjective}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;