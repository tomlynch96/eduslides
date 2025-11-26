// ============================================
// BLOCK REGISTRY - SINGLE SOURCE OF TRUTH
// ============================================

import type { BlockInstance } from './types/core';
import type { ComponentType } from 'react';

/**
 * Props that every block renderer receives
 */
export interface BlockRendererProps<T extends BlockInstance = BlockInstance> {
  block: T;
  mode: 'view' | 'edit';
  onContentChange?: (content: T['content']) => void;
}

/**
 * Complete definition of a block type
 * This is what you register for each block type
 */
export interface BlockTypeDefinition<T extends BlockInstance = BlockInstance> {
  // Metadata
  id: T['type'];
  label: string;
  description: string;
  icon: string;
  category: 'content' | 'interactive' | 'assessment' | 'media';
  
  // Factory function to create a new instance with defaults
  createDefault: () => T;
  
  // React component that renders this block type
  component: ComponentType<BlockRendererProps<T>>;
  
  // Optional: Custom validation
  validate?: (block: T) => string | null;
  
  // Optional: Search keywords
  keywords?: string[];
  
  // Optional: Can this block be templated?
  supportsTemplates?: boolean;
}

/**
 * The Registry - manages all block type definitions
 */
class BlockTypeRegistry {
  private definitions = new Map<string, BlockTypeDefinition>();

  /**
   * Register a new block type
   */
  register<T extends BlockInstance>(definition: BlockTypeDefinition<T>) {
    this.definitions.set(definition.id, definition as any);
    return this; // Chainable
  }

  /**
   * Get a specific block type definition
   */
  get(type: string): BlockTypeDefinition | undefined {
    return this.definitions.get(type);
  }

  /**
   * Get all registered block types
   */
  getAll(): BlockTypeDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Get block types by category
   */
  getAllByCategory(category: BlockTypeDefinition['category']): BlockTypeDefinition[] {
    return this.getAll().filter(def => def.category === category);
  }

  /**
   * Create a default instance of a block type
   */
  createDefaultBlock(type: string): BlockInstance | null {
    const def = this.get(type);
    return def ? def.createDefault() : null;
  }

  /**
   * Get the renderer component for a block type
   */
  getComponent(type: string): BlockTypeDefinition['component'] | null {
    const def = this.get(type);
    return def?.component || null;
  }

  /**
   * Validate a block instance
   */
  validate(block: BlockInstance): string | null {
    const def = this.get(block.type);
    return def?.validate ? def.validate(block) : null;
  }

  /**
   * Search for block types by keyword
   */
  search(query: string): BlockTypeDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(def => {
      const searchableText = [
        def.label,
        def.description,
        ...(def.keywords || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowerQuery);
    });
  }
}

/**
 * The global registry instance
 */
export const blockRegistry = new BlockTypeRegistry();

/**
 * Helper to create base block data (common fields)
 */
export function createBaseBlock<T extends BlockInstance['type']>(type: T): Omit<BlockInstance, 'content'> & { type: T } {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    topic: 'general',
    difficulty: 'core',
    author: 'current-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Helper function for type-safe block definitions
 */
export function defineBlockType<T extends BlockInstance>(
  definition: BlockTypeDefinition<T>
): BlockTypeDefinition<T> {
  return definition;
}