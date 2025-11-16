import type { BlockType } from '../types/core';
// ============================================
// PLATFORM-DEFINED BLOCK TYPES
// These are immutable - every user shares these
// ============================================

export const BLOCK_TYPES: Record<string, BlockType> = {
  text: {
    id: 'text',
    name: 'Text Block',
    description: 'Display formatted text content',
    fields: [
      {
        name: 'text',
        type: 'string',
        required: true,
        isTemplateable: true,
      },
      {
        name: 'fontSize',
        type: 'enum',
        required: true,
        isTemplateable: false,
        enumOptions: ['small', 'medium', 'large'],
      },
      {
        name: 'alignment',
        type: 'enum',
        required: true,
        isTemplateable: false,
        enumOptions: ['left', 'center', 'right'],
      },
    ],
    icon: '📝',
  },

  timer: {
    id: 'timer',
    name: 'Timer Block',
    description: 'Countdown timer for activities',
    fields: [
      {
        name: 'duration',
        type: 'number',
        required: true,
        isTemplateable: true,
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        isTemplateable: true,
      },
      {
        name: 'autoStart',
        type: 'boolean',
        required: false,
        isTemplateable: false,
      },
    ],
    icon: '⏱️',
  },

  objectives: {
    id: 'objectives',
    name: 'Learning Objectives',
    description: 'Display lesson objectives with checkboxes',
    fields: [
      {
        name: 'objectives',
        type: 'string',
        required: true,
        isTemplateable: true,
      },
      {
        name: 'showCheckboxes',
        type: 'boolean',
        required: false,
        isTemplateable: false,
      },
    ],
    icon: '🎯',
  },

  sequence: {
    id: 'sequence',
    name: 'Information Sequence',
    description: 'Reveal information step by step',
    fields: [
      {
        name: 'items',
        type: 'string',
        required: true,
        isTemplateable: true,
      },
      {
        name: 'revealMode',
        type: 'enum',
        required: true,
        isTemplateable: false,
        enumOptions: ['all', 'one-by-one', 'click-to-reveal'],
      },
    ],
    icon: '📋',
  },

  image: {
    id: 'image',
    name: 'Image Block',
    description: 'Display an image with optional caption',
    fields: [
      {
        name: 'resourceId',
        type: 'string',
        required: true,
        isTemplateable: false,
      },
      {
        name: 'caption',
        type: 'string',
        required: false,
        isTemplateable: true,
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        isTemplateable: false,
      },
    ],
    icon: '🖼️',
  },

  question: {
    id: 'question',
    name: 'Question & Answer Block',
    description: 'Interactive Q&A with reveal and fullscreen modes',
    fields: [
      {
        name: 'questions',
        type: 'string',
        required: true,
        isTemplateable: true,
      },
      {
        name: 'answers',
        type: 'string',
        required: true,
        isTemplateable: true,
      },
    ],
    icon: '❓',
  },
};

// Helper to get a block type by ID
export function getBlockType(id: string): BlockType | undefined {
  return BLOCK_TYPES[id];
}

// Get all available block types as an array
export function getAllBlockTypes(): BlockType[] {
  return Object.values(BLOCK_TYPES);
}