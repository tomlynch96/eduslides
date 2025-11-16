import type { BlockInstance } from './types/core';
import type { CompleteLessonExport } from './storage/storage';

// ============================================
// EXPORT LESSON AS JSON
// ============================================

interface ExportData {
  slides: Array<{
    id: string;
    blockIds: string[];
  }>;
  allBlocks: BlockInstance[];
  lessonName: string;
}

export function exportLessonAsJSON(data: ExportData): string {
  // Get unique blocks used in this lesson
  const usedBlockIds = new Set<string>();
  data.slides.forEach(slide => {
    slide.blockIds.forEach(id => usedBlockIds.add(id));
  });

  const usedBlocks = data.allBlocks.filter(block => 
    usedBlockIds.has(block.id)
  );

  const exportData: CompleteLessonExport = {
    formatVersion: '1.0',
    lesson: {
      id: `lesson-${Date.now()}`,
      name: data.lessonName,
      description: `Exported lesson: ${data.lessonName}`,
      author: 'EduSlides User',
      createdAt: new Date().toISOString(),
    },
    slides: data.slides.map(slide => ({
      id: slide.id,
      blockIds: [...slide.blockIds],
    })),
    blocks: usedBlocks,
  };

  return JSON.stringify(exportData, null, 2);
}

// ============================================
// DOWNLOAD JSON FILE
// ============================================

export function downloadJSON(jsonString: string, filename: string): void {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// IMPORT & VALIDATE JSON
// ============================================

export interface ImportResult {
  success: boolean;
  error?: string;
  data?: CompleteLessonExport;
}

export function validateAndParseJSON(jsonString: string): ImportResult {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data.formatVersion) {
      return { success: false, error: 'Missing format version' };
    }

    if (data.formatVersion !== '1.0') {
      return { 
        success: false, 
        error: `Unsupported format version: ${data.formatVersion}` 
      };
    }

    if (!data.lesson || !data.lesson.name) {
      return { success: false, error: 'Missing lesson information' };
    }

    if (!Array.isArray(data.slides)) {
      return { success: false, error: 'Invalid slides format' };
    }

    if (!Array.isArray(data.blocks)) {
      return { success: false, error: 'Invalid blocks format' };
    }

    // Validate blocks have required fields
    for (const block of data.blocks) {
      if (!block.id || !block.type || !block.content) {
        return { 
          success: false, 
          error: 'Block missing required fields (id, type, content)' 
        };
      }
    }

    return { success: true, data: data as CompleteLessonExport };
  } catch (error) {
    return { 
      success: false, 
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// ============================================
// READ FILE
// ============================================

export function readJSONFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}