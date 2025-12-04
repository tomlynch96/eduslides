import { useState, useEffect } from 'react';
import type { BlockInstance, BlockTypeName, SimpleSlide } from './types/core';
import { SlideLayout } from './types/core';
import './block-definitions'; // Initialize block registry
import { blockRegistry } from './block-registry';
import { getDefaultLayout } from './layouts/layoutRegistry';
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

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Lesson state
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [savedLessons, setSavedLessons] = useState<SimpleLessonData[]>([]);
  
  // Slide state
  const [slides, setSlides] = useState<SimpleSlide[]>([
    { 
      id: 'slide-1', 
      blockIds: [], 
      layout: SlideLayout.SINGLE 
    }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = slides[currentSlideIndex];
  
  // Block state
  const [allBlocks, setAllBlocks] = useState<BlockInstance[]>([]);
  const currentSlideBlocks = allBlocks.filter(block => 
    currentSlide.blockIds.includes(block.id)
  );
  
  // Objectives state
  const [lessonObjectives, setLessonObjectives] = useState<Array<{ id: string; text: string }>>([]);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  
  // UI state
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [fullscreenBlockId, setFullscreenBlockId] = useState<string | null>(null);

  // ============================================
  // INITIALIZATION
  // ============================================
  
  useEffect(() => {
    // Load all blocks from storage
    const blocks = getAllBlockInstances();
    setAllBlocks(blocks);
    
    // Load saved lessons list
    const lessons = getAllSimpleLessons();
    setSavedLessons(lessons);
  }, []);

  // ============================================
  // BLOCK HANDLERS
  // ============================================
  
  const handleInsertBlock = (blockType: BlockTypeName) => {
    const blockDef = blockRegistry.get(blockType);
    
    if (!blockDef) {
      console.error(`Block type ${blockType} not found in registry`);
      return;
    }
    
    // Create new block instance
    const newBlock = blockDef.createDefault();
    
    // Save to storage
    saveBlockInstance(newBlock);
    
    // Add to state
    setAllBlocks([...allBlocks, newBlock]);
    
    // Add to current slide and auto-select appropriate layout
    const updatedSlides = [...slides];
    const newBlockIds = [...currentSlide.blockIds, newBlock.id];
    
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: newBlockIds,
      layout: getDefaultLayout(newBlockIds.length) // Auto-select layout based on block count
    };
    
    setSlides(updatedSlides);
  };
  
  const handleUpdateBlock = (updatedBlock: BlockInstance) => {
    // Update in storage
    saveBlockInstance(updatedBlock);
    
    // Update in state
    setAllBlocks(allBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };
  
  const handleRemoveFromSlide = (blockId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: currentSlide.blockIds.filter(id => id !== blockId)
    };
    setSlides(updatedSlides);
  };
  
  const handleToggleBlockFullscreen = (blockId: string) => {
    setFullscreenBlockId(fullscreenBlockId === blockId ? null : blockId);
  };

  // ============================================
  // LAYOUT HANDLER
  // ============================================
  
  const handleLayoutChange = (newLayout: SlideLayout) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      layout: newLayout
    };
    setSlides(updatedSlides);
  };

  // ============================================
  // SLIDE NAVIGATION HANDLERS
  // ============================================
  
  const handleNewSlide = () => {
    const newSlide: SimpleSlide = {
      id: `slide-${Date.now()}`,
      blockIds: [],
      layout: SlideLayout.SINGLE
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDeleteSlide = () => {
    if (slides.length === 1) return; // Can't delete last slide
    
    const updatedSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(updatedSlides);
    
    // Adjust current index if needed
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

  // ============================================
  // LESSON MANAGEMENT HANDLERS
  // ============================================
  
  const handleSaveLesson = (name: string) => {
    const lessonData: SimpleLessonData = {
      id: currentLessonId || generateId(),
      name,
      slides: slides.map(slide => ({
        id: slide.id,
        blockIds: [...slide.blockIds],
        layout: slide.layout
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
    
    // Load slides with layout information
    setSlides(lesson.slides.map(slide => ({
      id: slide.id,
      blockIds: [...slide.blockIds],
      layout: slide.layout
    })));
    
    // Load objectives
    setLessonObjectives(lesson.objectives || []);
    setCompletedObjectives(lesson.objectivesState?.completed || []);
    
    // Update current lesson
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
      setSlides([{ 
        id: 'slide-1', 
        blockIds: [], 
        layout: SlideLayout.SINGLE 
      }]);
      setCurrentSlideIndex(0);
      setCurrentLessonId(null);
      setLessonObjectives([]);
      setCompletedObjectives([]);
    }
  };

  // ============================================
  // IMPORT/EXPORT HANDLERS
  // ============================================
  
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

      if (!result.success || !result.data) {
        alert(`Import failed: ${result.error || 'No data'}`);
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

      // Import blocks
      const importedBlocks = importData.blocks;
      importedBlocks.forEach(block => {
        saveBlockInstance(block);
      });

      // Add imported blocks to state
      const newAllBlocks = [...allBlocks];
      importedBlocks.forEach(block => {
        if (!newAllBlocks.find(b => b.id === block.id)) {
          newAllBlocks.push(block);
        }
      });
      setAllBlocks(newAllBlocks);

      // Import slides (default to SINGLE layout for imported lessons)
      setSlides(importData.slides.map(slide => ({
        id: slide.id,
        blockIds: [...slide.blockIds],
        layout: SlideLayout.SINGLE
      })));

      // Import objectives
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

  // ============================================
  // OBJECTIVES HANDLERS
  // ============================================
  
  const handleToggleObjective = (objectiveId: string) => {
    const newCompleted = completedObjectives.includes(objectiveId)
      ? completedObjectives.filter(id => id !== objectiveId)
      : [...completedObjectives, objectiveId];
    
    setCompletedObjectives(newCompleted);
  };

  // ============================================
  // RENDER: PRESENTATION MODE
  // ============================================
  
  if (isPresentationMode) {
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
          fullscreenBlockId={fullscreenBlockId}
          onToggleBlockFullscreen={handleToggleBlockFullscreen}
        />
      </LessonProvider>
    );
  }

  // ============================================
  // RENDER: EDITING MODE
  // ============================================
  
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

      {/* Main Content - Slide Editor */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-6 w-full">
        <LessonProvider
          lessonObjectives={lessonObjectives}
          completedObjectives={completedObjectives}
          onToggleObjective={handleToggleObjective}
        >
          <SlideCanvas
            blocks={currentSlideBlocks}
            currentLayout={currentSlide.layout}
            onLayoutChange={handleLayoutChange}
            onRemoveBlock={handleRemoveFromSlide}
            onUpdateBlock={handleUpdateBlock}
            fullscreenBlockId={fullscreenBlockId}
            onToggleBlockFullscreen={handleToggleBlockFullscreen}
          />
        </LessonProvider>
      </div>
    </div>
  );
}

export default App;