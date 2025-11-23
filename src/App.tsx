import { useState, useEffect } from 'react';
import type { BlockInstance } from './types/core';
import './block-definitions'; // Initialize block registry
import { blockRegistry } from './block-registry';
import { LessonProvider } from './LessonContext';
import { SlideCanvas } from './components/SlideCanvas';
import { PresentationView } from './components/PresentationView';
import { TopMenuBar } from './components/TopMenuBar';
import { 
  getAllBlockInstances, 
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

// Slide with layout information
interface SimpleSlide {
  id: string;
  blockIds: string[];
  layout: 'auto' | 'vertical-stack';
  layoutPattern?: number;
  hasTitleZone?: boolean;  // NEW
}

function App() {
  // All blocks that have been created
  const [allBlocks, setAllBlocks] = useState<BlockInstance[]>([]);
  
  // All slides in the current lesson
  const [slides, setSlides] = useState<SimpleSlide[]>([
    { id: 'slide-1', blockIds: [], layout: 'auto', layoutPattern: 0, hasTitleZone: false }
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

  const handleRemoveFromSlide = (blockId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: currentSlide.blockIds.filter(id => id !== blockId)
    };
    setSlides(updatedSlides);
  };
  
  const handleInsertBlock = (blockType: string) => {
    console.log('Inserting block type:', blockType);
    
    const blockDef = blockRegistry.get(blockType);
    console.log('Block definition:', blockDef);
    
    if (!blockDef) {
      console.error(`Block type ${blockType} not found in registry`);
      return;
    }
    
    const newBlock = blockDef.createDefault();
    console.log('Created block:', newBlock);
    
    saveBlockInstance(newBlock);
    setAllBlocks([...allBlocks, newBlock]);
    // Add to current slide
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: [...currentSlide.blockIds, newBlock.id],
    };
    console.log('Updated slides:', updatedSlides);
    setSlides(updatedSlides);
  };
  
  const handleUpdateBlock = (updatedBlock: BlockInstance) => {
    // Update in storage
    saveBlockInstance(updatedBlock);
    
    // Update in allBlocks state
    setAllBlocks(allBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };
  const handleChangeLayout = (pattern: number) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      layoutPattern: pattern
    };
    setSlides(updatedSlides);
  };
  
  const handleToggleLayoutMode = () => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      layout: currentSlide.layout === 'auto' ? 'vertical-stack' : 'auto',
      layoutPattern: 0  // Reset pattern when switching modes
    };
    setSlides(updatedSlides);
  };
  const handleToggleTitleZone = () => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      hasTitleZone: !currentSlide.hasTitleZone,
      layoutPattern: 0  // Reset pattern when toggling title zone
    };
    setSlides(updatedSlides);
  };
  const handleNewSlide = () => {
    const newSlide: SimpleSlide = {
      id: `slide-${Date.now()}`,
      blockIds: [],
      layout: 'auto',
      layoutPattern: 0,
      hasTitleZone: false
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
        blockIds: [...slide.blockIds],
        layout: slide.layout,
        layoutPattern: slide.layoutPattern,
        hasTitleZone: slide.hasTitleZone
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
      blockIds: [...slide.blockIds],
      layout: slide.layout || 'auto',
      layoutPattern: slide.layoutPattern || 0,
      hasTitleZone: slide.hasTitleZone || false
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
      setSlides([{ id: 'slide-1', blockIds: [], layout: 'auto', layoutPattern: 0, hasTitleZone: false }]);
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
        layout: 'auto',
        layoutPattern: 0
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
    // Put debug logs BEFORE the return statement:
console.log('App.tsx - lessonObjectives:', lessonObjectives);
    return (
      <LessonProvider
        lessonObjectives={lessonObjectives}
        completedObjectives={completedObjectives}
        onToggleObjective={handleToggleObjective}
      >
        <PresentationView
          slides={slides}
          allBlocks={allBlocks}
          currentSlideIndex={currentSlideIndex}
          onNextSlide={handleNextSlide}
          onPreviousSlide={handlePreviousSlide}
          onExit={() => setIsPresentationMode(false)}
        />
      </LessonProvider>
    );
  }

  // Otherwise show editing interface
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            EduSlides
          </h1>
        </div>
      </div>

      {/* Top Menu Bar */}
      <TopMenuBar
        currentLessonName={
          currentLessonId 
            ? savedLessons.find(l => l.id === currentLessonId)?.name || null
            : null
        }
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        savedLessons={savedLessons}
        currentLessonId={currentLessonId}
        lessonObjectives={lessonObjectives}
        onUpdateObjectives={setLessonObjectives}
        onNewLesson={handleNewLesson}
        onSaveLesson={handleSaveLesson}
        onLoadLesson={handleLoadLesson}
        onDeleteLesson={handleDeleteLesson}
        onExportLesson={handleExportLesson}
        onImportLesson={handleImportLesson}
        onPreviousSlide={handlePreviousSlide}
        onNextSlide={handleNextSlide}
        onNewSlide={handleNewSlide}
        onDeleteSlide={handleDeleteSlide}
        onPresent={() => setIsPresentationMode(true)}
        onInsertBlock={handleInsertBlock}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-6 w-full">
        <LessonProvider
          lessonObjectives={lessonObjectives}
          completedObjectives={completedObjectives}
          onToggleObjective={handleToggleObjective}
        >
          <SlideCanvas
            blocks={currentSlideBlocks}
            onRemoveBlock={handleRemoveFromSlide}
            onUpdateBlock={handleUpdateBlock}
            layout={currentSlide.layout}
            layoutPattern={currentSlide.layoutPattern || 0}
            hasTitleZone={currentSlide.hasTitleZone || false}
            onChangeLayout={handleChangeLayout}
            onToggleLayoutMode={handleToggleLayoutMode}
            onToggleTitleZone={handleToggleTitleZone}
          />
        </LessonProvider>
      </div>
    </div>
    
  );
}

export default App;