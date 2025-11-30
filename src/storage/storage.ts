import type { BlockInstance, Slide, Flow, Lesson } from '../types/core';

// ============================================
// STORAGE LAYER
// Uses localStorage for now, easy to swap for backend later
// ============================================

const STORAGE_KEYS = {
  BLOCKS: 'eduslides_blocks',
  SLIDES: 'eduslides_slides',
  FLOWS: 'eduslides_flows',
  LESSONS: 'eduslides_lessons',
};

// ============================================
// BLOCK INSTANCES
// ============================================

export function saveBlockInstance(block: BlockInstance): void {
  const blocks = getAllBlockInstances();
  const existingIndex = blocks.findIndex(b => b.id === block.id);
  
  if (existingIndex >= 0) {
    blocks[existingIndex] = block;
  } else {
    blocks.push(block);
  }
  
  localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
}

export function getBlockInstance(id: string): BlockInstance | undefined {
  const blocks = getAllBlockInstances();
  return blocks.find(b => b.id === id);
}

export function getAllBlockInstances(): BlockInstance[] {
  const data = localStorage.getItem(STORAGE_KEYS.BLOCKS);
  return data ? JSON.parse(data) : [];
}

export function deleteBlockInstance(id: string): void {
  const blocks = getAllBlockInstances().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
}

// ============================================
// SLIDES
// ============================================

export function saveSlide(slide: Slide): void {
  const slides = getAllSlides();
  const existingIndex = slides.findIndex(s => s.id === slide.id);
  
  if (existingIndex >= 0) {
    slides[existingIndex] = slide;
  } else {
    slides.push(slide);
  }
  
  localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
}

export function getSlide(id: string): Slide | undefined {
  const slides = getAllSlides();
  return slides.find(s => s.id === id);
}

export function getAllSlides(): Slide[] {
  const data = localStorage.getItem(STORAGE_KEYS.SLIDES);
  return data ? JSON.parse(data) : [];
}

export function deleteSlide(id: string): void {
  const slides = getAllSlides().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
}

// ============================================
// FLOWS
// ============================================

export function saveFlow(flow: Flow): void {
  const flows = getAllFlows();
  const existingIndex = flows.findIndex(f => f.id === flow.id);
  
  if (existingIndex >= 0) {
    flows[existingIndex] = flow;
  } else {
    flows.push(flow);
  }
  
  localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(flows));
}

export function getFlow(id: string): Flow | undefined {
  const flows = getAllFlows();
  return flows.find(f => f.id === id);
}

export function getAllFlows(): Flow[] {
  const data = localStorage.getItem(STORAGE_KEYS.FLOWS);
  return data ? JSON.parse(data) : [];
}

// ============================================
// LESSONS
// ============================================

export function saveLesson(lesson: Lesson): void {
  const lessons = getAllLessons();
  const existingIndex = lessons.findIndex(l => l.id === lesson.id);
  
  if (existingIndex >= 0) {
    lessons[existingIndex] = lesson;
  } else {
    lessons.push(lesson);
  }
  
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
}

export function getLesson(id: string): Lesson | undefined {
  const lessons = getAllLessons();
  return lessons.find(l => l.id === id);
}

export function getAllLessons(): Lesson[] {
  const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
  return data ? JSON.parse(data) : [];
}

export function deleteLesson(id: string): void {
  const lessons = getAllLessons().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
}

// ============================================
// SIMPLE LESSON FORMAT (for our current use)
// ============================================

// Simplified lesson format that matches our current app structure
export interface SimpleLessonData {
  id: string;
  name: string;
  slides: Array<{
    id: string;
    blockIds: string[];
    layout?: 'auto' | 'vertical-stack';
    layoutPattern?: number;
    hasTitleZone?: boolean;
    manualPositions?: Array<[string, { column: number; columnSpan: number; row: number; rowSpan: number }]>;
  }>;
  objectives?: Array<{
    id: string;
    text: string;
  }>;
  objectivesState?: {
    completed: string[];
  };
  savedAt: string;
}

export interface CompleteLessonExport {
  formatVersion: '1.0';
  lesson: {
    id: string;
    name: string;
    description?: string;
    author: string;
    createdAt: string;
    objectives?: Array<{
      id: string;
      text: string;
    }>;
    objectivesState?: {
      completed: string[];
    };
  };
  slides: Array<{
    id: string;
    blockIds: string[];
  }>;
  blocks: BlockInstance[];
}

export function saveSimpleLesson(lessonData: SimpleLessonData): void {
  const lessons = getAllSimpleLessons();
  const existingIndex = lessons.findIndex(l => l.id === lessonData.id);
  
  if (existingIndex >= 0) {
    lessons[existingIndex] = lessonData;
  } else {
    lessons.push(lessonData);
  }
  
  localStorage.setItem('eduslides_simple_lessons', JSON.stringify(lessons));
}

export function getAllSimpleLessons(): SimpleLessonData[] {
  const data = localStorage.getItem('eduslides_simple_lessons');
  return data ? JSON.parse(data) : [];
}

export function getSimpleLesson(id: string): SimpleLessonData | undefined {
  const lessons = getAllSimpleLessons();
  return lessons.find(l => l.id === id);
}

export function deleteSimpleLesson(id: string): void {
  const lessons = getAllSimpleLessons().filter(l => l.id !== id);
  localStorage.setItem('eduslides_simple_lessons', JSON.stringify(lessons));
}

// ============================================
// UTILITIES
// ============================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('eduslides_simple_lessons');
}