/**
 * blockDefaults.ts
 * 
 * Defines default values for each block type.
 * Used when inserting new blocks with in-place editing.
 */

import type { BlockInstance } from './types/core';

/**
 * Generate a unique ID for new blocks
 */
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current timestamp in ISO format
 */
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Create a base block instance with common metadata
 */
function createBaseBlock(type: BlockInstance['type']): Omit<BlockInstance, 'content'> {
  return {
    id: generateBlockId(),
    type,
    topic: '', // Empty - teacher will fill or leave blank
    difficulty: 'core',
    author: 'current-user', // TODO: Replace with actual user context
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * TEXT BLOCK DEFAULT
 */
export function createDefaultTextBlock(): BlockInstance {
  return {
    ...createBaseBlock('text'),
    content: {
      text: '',
      fontSize: 'medium',
      alignment: 'left',
    },
  };
}

/**
 * TIMER BLOCK DEFAULT
 */
export function createDefaultTimerBlock(): BlockInstance {
  return {
    ...createBaseBlock('timer'),
    content: {
      duration: 300, // 5 minutes default
      label: 'Activity Timer',
      autoStart: false,
    },
  };
}

/**
 * OBJECTIVES BLOCK DEFAULT
 */
export function createDefaultObjectivesBlock(): BlockInstance {
  return {
    ...createBaseBlock('objectives'),
    content: {
      objectives: [''],
      showCheckboxes: true,
    },
  };
}

/**
 * QUESTION BLOCK DEFAULT
 */
export function createDefaultQuestionBlock(): BlockInstance {
  return {
    ...createBaseBlock('question'),
    content: {
      questions: [''],
      answers: [''],
    },
  };
}

/**
 * IMAGE BLOCK DEFAULT
 */
export function createDefaultImageBlock(): BlockInstance {
  return {
    ...createBaseBlock('image'),
    content: {
      resourceId: '', // Empty - will prompt for image
      caption: '',
      width: undefined,
    },
  };
}

/**
 * SEQUENCE BLOCK DEFAULT
 */
export function createDefaultSequenceBlock(): BlockInstance {
  return {
    ...createBaseBlock('sequence'),
    content: {
      items: [''],
      revealMode: 'all',
    },
  };
}

/**
 * MASTER LOOKUP: Get default block by type
 */
export function getDefaultBlockByType(type: BlockInstance['type']): BlockInstance {
  switch (type) {
    case 'text':
      return createDefaultTextBlock();
    case 'timer':
      return createDefaultTimerBlock();
    case 'objectives':
      return createDefaultObjectivesBlock();
    case 'question':
      return createDefaultQuestionBlock();
    case 'image':
      return createDefaultImageBlock();
    case 'sequence':
      return createDefaultSequenceBlock();
    default:
      // Fallback to text block if unknown type
      console.warn(`Unknown block type: ${type}, defaulting to text block`);
      return createDefaultTextBlock();
  }
}

/**
 * BLOCK TYPE METADATA
 * Information about each block type for the insert toolbar
 */
export interface BlockTypeMetadata {
  type: BlockInstance['type'];
  label: string;
  description: string;
  icon: string;
  category: 'content' | 'interactive' | 'assessment' | 'media';
}

export const BLOCK_TYPE_METADATA: BlockTypeMetadata[] = [
  {
    type: 'text',
    label: 'Text',
    description: 'Add text with formatting',
    icon: '📝',
    category: 'content',
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Add an image',
    icon: '🖼️',
    category: 'media',
  },
  {
    type: 'timer',
    label: 'Timer',
    description: 'Countdown timer',
    icon: '⏱️',
    category: 'interactive',
  },
  {
    type: 'objectives',
    label: 'Objectives',
    description: 'Learning objectives checklist',
    icon: '🎯',
    category: 'content',
  },
  {
    type: 'question',
    label: 'Question',
    description: 'Question with answers',
    icon: '❓',
    category: 'assessment',
  },
  {
    type: 'sequence',
    label: 'Sequence',
    description: 'Ordered steps',
    icon: '📋',
    category: 'content',
  },
];