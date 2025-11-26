// ============================================
// BLOCK DEFINITIONS - Register All Block Types Here
// ============================================
// This is the ONLY file you need to edit to add a new block type

import { blockRegistry, defineBlockType, createBaseBlock } from './block-registry';
import type { 
  TextBlockInstance, 
  TimerBlockInstance,
  ObjectivesBlockInstance,
  QuestionBlockInstance,
  SequenceBlockInstance,
  ImageBlockInstance
} from './types/core';

// Import renderers
import { TextBlockRenderer } from './blocks/renderers/TextBlockRenderer';
// Note: We'll import the other renderers after we convert them to the new pattern
// For now, we'll use placeholders

/**
 * TEXT BLOCK
 */
blockRegistry.register(
  defineBlockType<TextBlockInstance>({
    id: 'text',
    label: 'Text',
    description: 'Add text with formatting',
    icon: '📝',
    category: 'content',
    keywords: ['paragraph', 'writing', 'content', 'note'],
    supportsTemplates: true,
    
    createDefault: () => ({
      ...createBaseBlock('text'),
      type: 'text' as const,
      content: {
        text: '',
        fontSize: 'medium' as const,
        alignment: 'left' as const,
      },
    }),
    
    component: TextBlockRenderer,
    
    validate: (block) => {
      if (!block.content.text?.trim()) {
        return 'Text content cannot be empty';
      }
      if (block.content.text.length > 5000) {
        return 'Text is too long (max 5000 characters)';
      }
      return null;
    },
  })
);

/**
 * TIMER BLOCK
 */
blockRegistry.register(
  defineBlockType<TimerBlockInstance>({
    id: 'timer',
    label: 'Timer',
    description: 'Countdown timer for activities',
    icon: '⏱️',
    category: 'interactive',
    keywords: ['countdown', 'time', 'stopwatch', 'clock'],
    
    createDefault: () => ({
      ...createBaseBlock('timer'),
      type: 'timer' as const,
      content: {
        duration: 300, // 5 minutes default
        label: 'Activity Timer',
        autoStart: false,
      },
    }),
    
    // TODO: Convert TimerBlock to new pattern
    component: (() => null) as any, // Placeholder
    
    validate: (block) => {
      if (block.content.duration <= 0) {
        return 'Duration must be greater than 0';
      }
      if (block.content.duration > 86400) {
        return 'Duration cannot exceed 24 hours';
      }
      return null;
    },
  })
);

/**
 * OBJECTIVES BLOCK
 */
blockRegistry.register(
  defineBlockType<ObjectivesBlockInstance>({
    id: 'objectives',
    label: 'Learning Objectives',
    description: 'Display lesson objectives with checkboxes',
    icon: '🎯',
    category: 'content',
    keywords: ['goals', 'aims', 'targets', 'learning outcomes'],
    
    createDefault: () => ({
      ...createBaseBlock('objectives'),
      type: 'objectives' as const,
      content: {
        objectives: [],
        showCheckboxes: true,
      },
    }),
    
    // TODO: Convert ObjectivesBlock to new pattern
    component: (() => null) as any, // Placeholder
  })
);

/**
 * QUESTION BLOCK
 */
blockRegistry.register(
  defineBlockType<QuestionBlockInstance>({
    id: 'question',
    label: 'Questions',
    description: 'Add questions with hidden answers',
    icon: '❓',
    category: 'assessment',
    keywords: ['quiz', 'test', 'q&a', 'assessment'],
    
    createDefault: () => ({
      ...createBaseBlock('question'),
      type: 'question' as const,
      content: {
        questions: [''],
        answers: [''],
      },
    }),
    
    // TODO: Convert QuestionBlock to new pattern
    component: (() => null) as any, // Placeholder
    
    validate: (block) => {
      if (block.content.questions.length !== block.content.answers.length) {
        return 'Each question must have a corresponding answer';
      }
      return null;
    },
  })
);

/**
 * SEQUENCE BLOCK
 */
blockRegistry.register(
  defineBlockType<SequenceBlockInstance>({
    id: 'sequence',
    label: 'Sequence',
    description: 'Display information step-by-step',
    icon: '📋',
    category: 'content',
    keywords: ['steps', 'list', 'ordered', 'process'],
    
    createDefault: () => ({
      ...createBaseBlock('sequence'),
      type: 'sequence' as const,
      content: {
        items: [''],
        revealMode: 'all' as const,
      },
    }),
    
    // TODO: Convert SequenceBlock to new pattern
    component: (() => null) as any, // Placeholder
  })
);

/**
 * IMAGE BLOCK
 */
blockRegistry.register(
  defineBlockType<ImageBlockInstance>({
    id: 'image',
    label: 'Image',
    description: 'Add an image to your slide',
    icon: '🖼️',
    category: 'media',
    keywords: ['picture', 'photo', 'graphic', 'visual'],
    
    createDefault: () => ({
      ...createBaseBlock('image'),
      type: 'image' as const,
      content: {
        resourceId: '',
        caption: '',
        width: undefined,
      },
    }),
    
    // TODO: Convert ImageBlock to new pattern
    component: (() => null) as any, // Placeholder
  })
);

/**
 * TO ADD A NEW BLOCK TYPE:
 * 
 * 1. Create the renderer component in src/blocks/renderers/YourBlockRenderer.tsx
 * 2. Import it at the top of this file
 * 3. Add a new blockRegistry.register() call following the pattern above
 * 
 * That's it! The insert toolbar, rendering, and validation will all work automatically.
 */