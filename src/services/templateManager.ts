// ============================================
// TEMPLATE MANAGER - Block Template System
// ============================================
// Handles saving, loading, and managing block templates
// Templates save ONLY the templateable fields (instructional scaffolds)

import type { BlockInstance, BlockTemplate, BlockTypeName } from '../types/core';
import { getBlockType } from '../data/blockTypes';

const STORAGE_KEY = 'eduslides_block_templates';

// ============================================
// TEMPLATE CREATION
// ============================================

/**
 * Create a template from a block instance
 * Only templateable fields are preserved
 */
export function createTemplateFromBlock(
  block: BlockInstance,
  templateName: string,
  description?: string
): BlockTemplate {
  const blockType = getBlockType(block.type);
  
  if (!blockType) {
    throw new Error(`Unknown block type: ${block.type}`);
  }

  // Extract only templateable fields
  const templateContent: Record<string, any> = {};
  
  blockType.fields.forEach(field => {
    if (field.isTemplateable && block.content[field.name] !== undefined) {
      templateContent[field.name] = block.content[field.name];
    }
  });

  return {
    id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    blockType: block.type,
    name: templateName,
    description,
    templateContent,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a block instance from a template
 * Templateable fields are pre-filled, non-templateable fields get defaults
 */
export function createBlockFromTemplate(
  template: BlockTemplate,
  createDefaultBlock: (type: BlockTypeName) => BlockInstance | null
): BlockInstance | null {
  // Create a fresh default block
  const defaultBlock = createDefaultBlock(template.blockType);
  
  if (!defaultBlock) {
    return null;
  }

  // Merge template content into the default block
  const blockWithTemplateContent: BlockInstance = {
    ...defaultBlock,
    content: {
      ...defaultBlock.content,
      ...template.templateContent,
    },
  };

  return blockWithTemplateContent;
}

// ============================================
// TEMPLATE STORAGE (localStorage)
// ============================================

/**
 * Get all saved templates
 */
export function getAllTemplates(): BlockTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const templates = JSON.parse(stored);
    return Array.isArray(templates) ? templates : [];
  } catch (error) {
    console.error('Failed to load templates:', error);
    return [];
  }
}

/**
 * Get templates for a specific block type
 */
export function getTemplatesForBlockType(blockType: BlockTypeName): BlockTemplate[] {
  return getAllTemplates().filter(t => t.blockType === blockType);
}

/**
 * Save a template
 */
export function saveTemplate(template: BlockTemplate): void {
  try {
    const templates = getAllTemplates();
    
    // Check if updating existing template
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save template:', error);
    throw new Error('Failed to save template');
  }
}

/**
 * Delete a template
 */
export function deleteTemplate(templateId: string): void {
  try {
    const templates = getAllTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete template:', error);
    throw new Error('Failed to delete template');
  }
}

/**
 * Update a template
 */
export function updateTemplate(templateId: string, updates: Partial<BlockTemplate>): void {
  try {
    const templates = getAllTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    
    if (index < 0) {
      throw new Error('Template not found');
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error('Failed to update template');
  }
}

// ============================================
// TEMPLATE EXPORT/IMPORT (JSON)
// ============================================

/**
 * Export a template as JSON string
 */
export function exportTemplateAsJSON(template: BlockTemplate): string {
  return JSON.stringify(template, null, 2);
}

/**
 * Export all templates as JSON string
 */
export function exportAllTemplatesAsJSON(): string {
  return JSON.stringify(getAllTemplates(), null, 2);
}

/**
 * Import a template from JSON string
 */
export function importTemplateFromJSON(jsonString: string): BlockTemplate {
  try {
    const template = JSON.parse(jsonString);
    
    // Validate structure
    if (!template.id || !template.blockType || !template.name || !template.templateContent) {
      throw new Error('Invalid template format');
    }
    
    return template as BlockTemplate;
  } catch (error) {
    console.error('Failed to import template:', error);
    throw new Error('Invalid template JSON');
  }
}

/**
 * Import multiple templates from JSON string
 */
export function importTemplatesFromJSON(jsonString: string): BlockTemplate[] {
  try {
    const templates = JSON.parse(jsonString);
    
    if (!Array.isArray(templates)) {
      throw new Error('Expected array of templates');
    }
    
    // Validate each template
    templates.forEach(t => {
      if (!t.id || !t.blockType || !t.name || !t.templateContent) {
        throw new Error('Invalid template format in array');
      }
    });
    
    return templates as BlockTemplate[];
  } catch (error) {
    console.error('Failed to import templates:', error);
    throw new Error('Invalid templates JSON');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if a template has any templateable content
 */
export function templateHasContent(template: BlockTemplate): boolean {
  return Object.keys(template.templateContent).length > 0;
}

/**
 * Get a preview of template content (for UI display)
 */
export function getTemplatePreview(template: BlockTemplate, maxLength: number = 50): string {
  const contentValues = Object.values(template.templateContent);
  
  if (contentValues.length === 0) {
    return 'Empty template';
  }
  
  // Get first string value as preview
  const firstStringValue = contentValues.find(v => typeof v === 'string');
  
  if (firstStringValue && typeof firstStringValue === 'string') {
    return firstStringValue.length > maxLength 
      ? firstStringValue.substring(0, maxLength) + '...'
      : firstStringValue;
  }
  
  return `${contentValues.length} field${contentValues.length === 1 ? '' : 's'}`;
}