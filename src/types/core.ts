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
  | 'image';

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
export interface TextBlockInstance extends BlockInstance {
  type: 'text';
  content: {
    text: string;
    fontSize: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
  };
}

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