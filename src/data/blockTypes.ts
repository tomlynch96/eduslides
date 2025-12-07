import type { BlockType } from '../types/core';

// ============================================
// PLATFORM-DEFINED BLOCK TYPES
// These are immutable - every user shares these
// ============================================
// 
// TEMPLATEABLE FIELDS PHILOSOPHY (Use Case A):
// - isTemplateable: true  = Field is KEPT when saving as template (instructional scaffolding)
// - isTemplateable: false = Field is STRIPPED when saving as template (lesson-specific content)
// 
// Templates save the STRUCTURE and INSTRUCTIONS, not the content.
// Example: "Think-Pair-Share" template keeps instructions, removes questions.
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
        isTemplateable: false,  // ← Content changes each lesson
      },
      {
        name: 'fontSize',
        type: 'enum',
        required: true,
        isTemplateable: false,  // ← Styling preference
        enumOptions: ['small', 'medium', 'large'],
      },
      {
        name: 'alignment',
        type: 'enum',
        required: true,
        isTemplateable: false,  // ← Styling preference
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
        isTemplateable: true,  // ✓ Reusable: "2-minute think time"
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        isTemplateable: true,  // ✓ Reusable: "Think Time" label
      },
      {
        name: 'autoStart',
        type: 'boolean',
        required: false,
        isTemplateable: false,  // ← Behavior preference
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
        isTemplateable: false,  // ← Objectives change each lesson
      },
      {
        name: 'showCheckboxes',
        type: 'boolean',
        required: false,
        isTemplateable: false,  // ← UI preference
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
        isTemplateable: false,  // ← Content changes each lesson
      },
      {
        name: 'revealMode',
        type: 'enum',
        required: true,
        isTemplateable: false,  // ← Interaction preference
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
        isTemplateable: false,  // ← Specific image changes
      },
      {
        name: 'caption',
        type: 'string',
        required: false,
        isTemplateable: false,  // ← Specific caption changes
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        isTemplateable: false,  // ← Sizing preference
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
        isTemplateable: false,  // ← Questions change each lesson
      },
      {
        name: 'answers',
        type: 'string',
        required: true,
        isTemplateable: false,  // ← Answers change each lesson
      },
      {
        name: 'instructions',
        type: 'string',
        required: false,
        isTemplateable: true,  // ✓ REUSABLE: "Answer in complete sentences"
      },
    ],
    icon: '❓',
  },

  cloze: {
    id: 'cloze',
    name: 'Cloze (Fill in Blanks)',
    description: 'Click words to turn them into blanks',
    fields: [
      {
        name: 'text',
        type: 'string',
        required: true,
        isTemplateable: false,  // ← Passage content changes
      },
      {
        name: 'blankedIndices',
        type: 'string',  // Array serialized as string
        required: false,
        isTemplateable: false,  // ← Specific blanks change
      },
      {
        name: 'instructions',
        type: 'string',
        required: false,
        isTemplateable: true,  // ✓ REUSABLE: "Fill in the scientific terms"
      },
      {
        name: 'showWordList',
        type: 'boolean',
        required: false,
        isTemplateable: false,  // ← UI preference
      },
    ],
    icon: '📄',
  },

  match: {
    id: 'match',
    name: 'Match Block',
    description: 'Match terms with their definitions',
    fields: [
      {
        name: 'terms',
        type: 'string',  // Array serialized as string
        required: true,
        isTemplateable: false,  // ← Specific terms change
      },
      {
        name: 'descriptions',
        type: 'string',  // Array serialized as string
        required: true,
        isTemplateable: false,  // ← Specific descriptions change
      },
      {
        name: 'shuffled',
        type: 'boolean',
        required: false,
        isTemplateable: false,  // ← State, not templateable
      },
      {
        name: 'instructions',
        type: 'string',
        required: false,
        isTemplateable: true,  // ✓ REUSABLE: "Match the term to its definition"
      },
    ],
    icon: '🔗',
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