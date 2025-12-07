// ============================================
// SLIDE TEMPLATE MANAGER
// ============================================
// Saves entire slide layouts with templateable fields from all blocks

import type { SimpleSlide, BlockInstance, SlideLayout } from '../types/core';
import { getBlockType } from '../data/blockTypes';

const STORAGE_KEY = 'eduslides_slide_templates';

// Slide template structure
export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  layout: SlideLayout;
  blocks: Array<{
    type: string;
    templateContent: Record<string, any>; // Only templateable fields
  }>;
  createdAt: string;
  tags?: string[];
}

// ============================================
// TEMPLATE CREATION
// ============================================

/**
 * Create a slide template from a slide and its blocks
 * Only templateable fields are preserved from each block
 */
export function createTemplateFromSlide(
  slide: SimpleSlide,
  blocks: BlockInstance[],
  templateName: string,
  description?: string
): SlideTemplate {
  // Extract templateable content from each block
  const templateBlocks = blocks.map(block => {
    const blockType = getBlockType(block.type);
    const templateContent: Record<string, any> = {};
    
    if (blockType) {
      blockType.fields.forEach(field => {
        if (field.isTemplateable && block.content[field.name] !== undefined) {
          templateContent[field.name] = block.content[field.name];
        }
      });
    }
    
    return {
      type: block.type,
      templateContent,
    };
  });

  return {
    id: `slide-template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: templateName,
    description,
    layout: slide.layout,
    blocks: templateBlocks,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a new slide from a template
 * Creates new block instances with templateable fields pre-filled
 */
export function createSlideFromTemplate(
  template: SlideTemplate,
  createDefaultBlock: (type: string) => BlockInstance | null
): { slide: SimpleSlide; blocks: BlockInstance[] } | null {
  const newBlocks: BlockInstance[] = [];
  
  // Create each block from the template
  for (const templateBlock of template.blocks) {
    const defaultBlock = createDefaultBlock(templateBlock.type);
    
    if (!defaultBlock) {
      console.error(`Failed to create block of type: ${templateBlock.type}`);
      continue;
    }
    
    // Merge template content into default block
    const blockWithTemplateContent: BlockInstance = {
      ...defaultBlock,
      content: {
        ...defaultBlock.content,
        ...templateBlock.templateContent,
      },
    };
    
    newBlocks.push(blockWithTemplateContent);
  }
  
  if (newBlocks.length === 0) {
    return null;
  }
  
  // Create new slide with these blocks
  const newSlide: SimpleSlide = {
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    blockIds: newBlocks.map(b => b.id),
    layout: template.layout,
  };
  
  return { slide: newSlide, blocks: newBlocks };
}

// ============================================
// STORAGE (localStorage)
// ============================================

/**
 * Get all saved slide templates
 */
export function getAllSlideTemplates(): SlideTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const templates = JSON.parse(stored);
    return Array.isArray(templates) ? templates : [];
  } catch (error) {
    console.error('Failed to load slide templates:', error);
    return [];
  }
}

/**
 * Save a slide template
 */
export function saveSlideTemplate(template: SlideTemplate): void {
  try {
    const templates = getAllSlideTemplates();
    
    // Check if updating existing template
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save slide template:', error);
    throw new Error('Failed to save slide template');
  }
}

/**
 * Delete a slide template
 */
export function deleteSlideTemplate(templateId: string): void {
  try {
    const templates = getAllSlideTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete slide template:', error);
    throw new Error('Failed to delete slide template');
  }
}

/**
 * Get a preview of template (for UI display)
 */
export function getSlideTemplatePreview(template: SlideTemplate): string {
  const blockCount = template.blocks.length;
  const blockTypes = template.blocks.map(b => b.type).join(', ');
  return `${blockCount} block${blockCount !== 1 ? 's' : ''}: ${blockTypes}`;
}

// ============================================
// EXPORT/IMPORT
// ============================================

/**
 * Export a slide template as JSON string
 */
export function exportSlideTemplateAsJSON(template: SlideTemplate): string {
  return JSON.stringify(template, null, 2);
}

/**
 * Import a slide template from JSON string
 */
export function importSlideTemplateFromJSON(jsonString: string): SlideTemplate {
  try {
    const template = JSON.parse(jsonString);
    
    // Validate structure
    if (!template.id || !template.name || !template.layout || !Array.isArray(template.blocks)) {
      throw new Error('Invalid slide template format');
    }
    
    return template as SlideTemplate;
  } catch (error) {
    console.error('Failed to import slide template:', error);
    throw new Error('Invalid slide template JSON');
  }
}