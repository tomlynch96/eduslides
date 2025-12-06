// ============================================
// CORE EDUSLIDES TYPE SYSTEM
// ============================================

// Basic metadata types
export type Difficulty = 'foundation' | 'core' | 'extension';
export type TopicId = string; // References the global topic dictionary

// ============================================
// BLOCK TYPES (Immutable, Platform-Defined)
// ============================================

export type BlockTypeName = 
  | 'text'
  | 'timer'
  | 'objectives'
  | 'sequence'
  | 'image'
  | 'question'
  | 'cloze'
  | 'match';

export interface BlockTypeField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  required: boolean;
  isTemplateable: boolean; // Can this field be saved as a template?
  enumOptions?: string[]; // For enum types
}

export interface BlockType {
  id: BlockTypeName;
  name: string;
  description: string;
  fields: BlockTypeField[];
  icon?: string;
}

// ============================================
// BLOCK INSTANCES (User-Created Content)
// ============================================

export interface BlockInstance {
  id: string; // Unique identifier
  type: BlockTypeName; // Which block type this is
  topic: TopicId; // What curriculum topic this covers
  difficulty: Difficulty;
  author: string;
  createdAt: string;
  updatedAt: string;
  content: Record<string, any>; // The actual content (varies by block type)
}

// Specific block instance types


// ============================================
// ENHANCED TEXT BLOCK TYPES
// ============================================
// Add these to your existing src/types/core.ts file

// Update the TextBlockInstance interface to include new fields:

export interface TextBlockInstance extends BlockInstance {
  type: 'text';
  content: {
    text: string;
    fontSize: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
    backgroundColor?: 'none' | 'warm-yellow' | 'warm-peach' | 'warm-pink' | 'warm-blue' | 'warm-green' | 'warm-purple'; // NEW
    // Rich text formatting stored as markdown-style markers that we'll parse
    // This keeps the data as plain text (searchable, templatable) while supporting formatting
  };
}

// Pastel warm color palette
export const PASTEL_COLORS = {
  none: {
    name: 'None',
    bg: 'bg-transparent',
    preview: '#ffffff'
  },
  'warm-yellow': {
    name: 'Warm Yellow',
    bg: 'bg-amber-50',
    preview: '#fffbeb'
  },
  'warm-pink': {
    name: 'Warm Pink', 
    bg: 'bg-rose-50',
    preview: '#fff1f2'
  },
  'warm-blue': {
    name: 'Warm Blue',
    bg: 'bg-sky-50', 
    preview: '#f0f9ff'
  },
  'warm-green': {
    name: 'Warm Green',
    bg: 'bg-emerald-50',
    preview: '#ecfdf5'
  },
  'warm-purple': {
    name: 'Warm Purple',
    bg: 'bg-purple-50',
    preview: '#faf5ff'
  }
} as const;

export type BackgroundColor = keyof typeof PASTEL_COLORS;

export interface TimerBlockInstance extends BlockInstance {
  type: 'timer';
  content: {
    duration: number; // in seconds
    label: string;
    autoStart: boolean;
  };
}

export interface ImageBlockInstance extends BlockInstance {
  type: 'image';
  content: {
    resourceId: string; // References global resource dictionary
    caption?: string;
    width?: number;
  };
}

export interface ObjectivesBlockInstance extends BlockInstance {
  type: 'objectives';
  content: {
    objectives: string[];
    showCheckboxes: boolean;
  };
}

export interface SequenceBlockInstance extends BlockInstance {
  type: 'sequence';
  content: {
    items: string[];
    revealMode: 'all' | 'one-by-one' | 'click-to-reveal';
  };
}
export interface QuestionBlockInstance extends BlockInstance {
  type: 'question';
  content: {
    questions: string[];  // Array of questions
    answers: string[];    // Array of corresponding answers
    instructions?: string;  // NEW: Optional instructions
  };
}
export interface ClozeBlockInstance extends BlockInstance {
  type: 'cloze';
  content: {
    text: string;              // The full text
    blankedIndices: number[];  // Which word indices are blanked
    instructions?: string; 
  };
}
export interface MatchBlockInstance extends BlockInstance {
  type: 'match';
  content: {
    terms: string[];          // Array of terms
    descriptions: string[];   // Array of descriptions (same order as terms)
    shuffled?: number[];      // Indices for shuffled descriptions (set on first view)
  };
}

//NEW SLIDE LAYOUT
// Add this enum
export enum SlideLayout {
  // 1 block
  SINGLE = 'single',
  
  // 2 blocks
  TWO_HORIZONTAL = 'two-h',
  TWO_VERTICAL = 'two-v',
  SIDEBAR_LEFT = 'sidebar-l',
  SIDEBAR_RIGHT = 'sidebar-r',
  
  // 3 blocks
  THREE_COLUMNS = 'three-col',
  THREE_ROWS = 'three-rows',
  BIG_TOP = 'big-top',
  BIG_BOTTOM = 'big-bottom',
  SIDEBAR_LEFT_STACK = 'sidebar-l-stack',
  SIDEBAR_RIGHT_STACK = 'sidebar-r-stack',
  WIDE_LEFT_STACK = 'wide-l-stack',
  WIDE_RIGHT_STACK = 'wide-r-stack',
  
  // 4 blocks
  GRID_2x2 = 'grid-2x2',
  FOUR_COLUMNS = 'four-col',
  FOUR_ROWS = 'four-rows',
  
  // Deprecated (keep for backward compatibility)
  TITLE_SINGLE = 'title-single',
}

// Add SimpleSlide interface (move from App.tsx)
export interface SimpleSlide {
  id: string;
  blockIds: string[];
  layout: SlideLayout;
  title?: string;  // Simple string title
}

// Add these new interfaces
export interface LayoutSlot {
  id: string;
  column: number;
  columnSpan: number;
  row: number;
  rowSpan: number;
  label?: string;
}

export interface LayoutDefinition {
  id: SlideLayout;
  name: string;
  description: string;
  slots: LayoutSlot[];
  minBlocks: number;
  maxBlocks: number;
  icon: string;
}
// ============================================
// SLIDES
// ============================================

export interface BlockLayout {
  blockId: string;
  x: number; // Position (0-100, percentage of slide width)
  y: number; // Position (0-100, percentage of slide height)
  width: number; // Size (0-100, percentage)
  height: number; // Size (0-100, percentage)
  isFullscreen: boolean;
  isMinimized: boolean;
}

export interface Slide {
  id: string;
  sequenceNumber: number;
  layouts: BlockLayout[]; // How blocks are arranged on this slide
  persistentBlockIds: string[]; // Blocks that persist across slides
  notes?: string; // Teacher notes for this slide
}

// ============================================
// FLOWS (Sequences of Slides)
// ============================================

export interface Flow {
  id: string;
  name: string;
  description?: string;
  author: string;
  slideIds: string[]; // Ordered list of slides
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LESSONS (Complete Teaching Sessions)
// ============================================

export interface Lesson {
  id: string;
  name: string;
  description?: string;
  author: string;
  slideIds: string[]; // All slides in order (can include standalone + flow slides)
  flowIds: string[]; // Flows used in this lesson
  topicsCovered: TopicId[];
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TEMPLATES
// ============================================

export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  layouts: Omit<BlockLayout, 'blockId'>[]; // Layout without specific blocks
  blockTypes: BlockTypeName[]; // Which block types this template expects
  createdAt: string;
}

export interface BlockTemplate {
  id: string;
  blockType: BlockTypeName;
  name: string;
  description?: string;
  templateContent: Partial<Record<string, any>>; // Pre-filled content
  createdAt: string;
}

// ============================================
// RESOURCES (Global Media Dictionary)
// ============================================

export interface Resource {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'audio';
  url: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

// ============================================
// TOPICS (Curriculum Dictionary)
// ============================================

export interface Topic {
  id: TopicId;
  name: string;
  subject: string; // e.g., 'Physics', 'Math'
  examBoard?: string; // e.g., 'AQA', 'Edexcel'
  specificationPoints?: string[]; // Curriculum references
  parentTopicId?: TopicId; // For hierarchical topics
}