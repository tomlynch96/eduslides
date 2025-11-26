// ============================================
// BLOCK DEFINITIONS - Register All Block Types Here
// ============================================

import { blockRegistry, defineBlockType, createBaseBlock } from './block-registry';
import type { 
  TextBlockInstance, 
  TimerBlockInstance,
  ObjectivesBlockInstance,
  QuestionBlockInstance,
  SequenceBlockInstance,
  ImageBlockInstance,
  ClozeBlockInstance
} from './types/core';

// Import all renderers
import { TextBlockRenderer } from './blocks/renderers/TextBlockRenderer';
import { TimerBlockRenderer } from './blocks/renderers/TimerBlockRenderer';
import { ObjectivesBlockRenderer } from './blocks/renderers/ObjectivesBlockRenderer';
import { QuestionBlockRenderer } from './blocks/renderers/QuestionBlockRenderer';
import { SequenceBlockRenderer } from './blocks/renderers/SequenceBlockRenderer';
import { ImageBlockRenderer } from './blocks/renderers/ImageBlockRenderer';
import { ClozeBlockRenderer } from './blocks/renderers/ClozeBlockRenderer';

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
    
    component: TimerBlockRenderer,
    
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
    
    component: ObjectivesBlockRenderer,
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
    
    component: QuestionBlockRenderer,
    
    validate: (block) => {
      const validQuestions = block.content.questions.filter(q => q.trim()).length;
      const validAnswers = block.content.answers.filter(a => a.trim()).length;
      
      if (validQuestions === 0 || validAnswers === 0) {
        return 'Must have at least one question and answer';
      }
      
      if (validQuestions !== validAnswers) {
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
    
    component: SequenceBlockRenderer,
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
    
    component: ImageBlockRenderer,
  })
);
/**
 * CLOZE BLOCK
 */
blockRegistry.register(
  defineBlockType<ClozeBlockInstance>({
    id: 'cloze',
    label: 'Cloze (Fill in Blanks)',
    description: 'Click words to turn them into blanks',
    icon: '📄',
    category: 'assessment',
    keywords: ['fill in the blank', 'gap fill', 'cloze test', 'missing words'],
    supportsTemplates: true,
    
    createDefault: () => ({
      ...createBaseBlock('cloze'),
      type: 'cloze' as const,
      content: {
        text: '',
        blankedIndices: [],
      },
    }),
    
    component: ClozeBlockRenderer,
    
    validate: (block) => {
      if (!block.content.text?.trim()) {
        return 'Text content cannot be empty';
      }
      return null;
    },
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