import { SlideLayout, type LayoutDefinition } from '../types/core';

export const LAYOUT_REGISTRY: Record<SlideLayout, LayoutDefinition> = {
  // ============================================
  // 1 BLOCK
  // ============================================
  
  [SlideLayout.SINGLE]: {
    id: SlideLayout.SINGLE,
    name: 'Single Block',
    description: 'One block fills the entire slide',
    minBlocks: 1,
    maxBlocks: 1,
    icon: '▭',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 6 }
    ]
  },

  // ============================================
  // 2 BLOCKS
  // ============================================

  [SlideLayout.TWO_HORIZONTAL]: {
    id: SlideLayout.TWO_HORIZONTAL,
    name: 'Two Columns',
    description: 'Two blocks side by side (50/50)',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▮▮',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 6, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 7, columnSpan: 6, row: 1, rowSpan: 6 }
    ]
  },

  [SlideLayout.TWO_VERTICAL]: {
    id: SlideLayout.TWO_VERTICAL,
    name: 'Two Rows',
    description: 'Two blocks stacked (50/50)',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 1, columnSpan: 12, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.SIDEBAR_LEFT]: {
    id: SlideLayout.SIDEBAR_LEFT,
    name: 'Sidebar Left',
    description: 'Narrow left sidebar (25/75)',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▌▭',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 3, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 4, columnSpan: 9, row: 1, rowSpan: 6 }
    ]
  },

  [SlideLayout.SIDEBAR_RIGHT]: {
    id: SlideLayout.SIDEBAR_RIGHT,
    name: 'Sidebar Right',
    description: 'Narrow right sidebar (75/25)',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▭▐',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 9, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 10, columnSpan: 3, row: 1, rowSpan: 6 }
    ]
  },

  // ============================================
  // 3 BLOCKS
  // ============================================

  [SlideLayout.THREE_COLUMNS]: {
    id: SlideLayout.THREE_COLUMNS,
    name: 'Three Columns',
    description: 'Three blocks side by side',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▮▮▮',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 4, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 5, columnSpan: 4, row: 1, rowSpan: 6 },
      { id: 'slot-3', column: 9, columnSpan: 4, row: 1, rowSpan: 6 }
    ]
  },

  [SlideLayout.THREE_ROWS]: {
    id: SlideLayout.THREE_ROWS,
    name: 'Three Rows',
    description: 'Three blocks stacked',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 2 },
      { id: 'slot-2', column: 1, columnSpan: 12, row: 3, rowSpan: 2 },
      { id: 'slot-3', column: 1, columnSpan: 12, row: 5, rowSpan: 2 }
    ]
  },

  [SlideLayout.BIG_TOP]: {
    id: SlideLayout.BIG_TOP,
    name: 'Big Top',
    description: 'Top: 1 full, Bottom: 2 side-by-side',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 1, columnSpan: 6, row: 4, rowSpan: 3 },
      { id: 'slot-3', column: 7, columnSpan: 6, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.BIG_BOTTOM]: {
    id: SlideLayout.BIG_BOTTOM,
    name: 'Big Bottom',
    description: 'Top: 2 side-by-side, Bottom: 1 full',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 7, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-3', column: 1, columnSpan: 12, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.SIDEBAR_LEFT_STACK]: {
    id: SlideLayout.SIDEBAR_LEFT_STACK,
    name: 'Sidebar Left + Stack',
    description: 'Left: narrow sidebar, Right: 2 stacked (25/75)',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▌▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 3, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 4, columnSpan: 9, row: 1, rowSpan: 3 },
      { id: 'slot-3', column: 4, columnSpan: 9, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.SIDEBAR_RIGHT_STACK]: {
    id: SlideLayout.SIDEBAR_RIGHT_STACK,
    name: 'Sidebar Right + Stack',
    description: 'Left: 2 stacked, Right: narrow sidebar (75/25)',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▬▐',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 9, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 1, columnSpan: 9, row: 4, rowSpan: 3 },
      { id: 'slot-3', column: 10, columnSpan: 3, row: 1, rowSpan: 6 }
    ]
  },

  [SlideLayout.WIDE_LEFT_STACK]: {
    id: SlideLayout.WIDE_LEFT_STACK,
    name: 'Wide Left + Stack',
    description: 'Left: wide block, Right: 2 stacked (50/50)',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▮▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 6, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 7, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-3', column: 7, columnSpan: 6, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.WIDE_RIGHT_STACK]: {
    id: SlideLayout.WIDE_RIGHT_STACK,
    name: 'Wide Right + Stack',
    description: 'Left: 2 stacked, Right: wide block (50/50)',
    minBlocks: 3,
    maxBlocks: 3,
    icon: '▬▮',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 1, columnSpan: 6, row: 4, rowSpan: 3 },
      { id: 'slot-3', column: 7, columnSpan: 6, row: 1, rowSpan: 6 }
    ]
  },

  // ============================================
  // 4 BLOCKS
  // ============================================

  [SlideLayout.GRID_2x2]: {
    id: SlideLayout.GRID_2x2,
    name: 'Grid 2×2',
    description: 'Four blocks in a grid',
    minBlocks: 4,
    maxBlocks: 4,
    icon: '▦',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-2', column: 7, columnSpan: 6, row: 1, rowSpan: 3 },
      { id: 'slot-3', column: 1, columnSpan: 6, row: 4, rowSpan: 3 },
      { id: 'slot-4', column: 7, columnSpan: 6, row: 4, rowSpan: 3 }
    ]
  },

  [SlideLayout.FOUR_COLUMNS]: {
    id: SlideLayout.FOUR_COLUMNS,
    name: 'Four Columns',
    description: 'Four blocks side by side',
    minBlocks: 4,
    maxBlocks: 4,
    icon: '▮▮▮▮',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 3, row: 1, rowSpan: 6 },
      { id: 'slot-2', column: 4, columnSpan: 3, row: 1, rowSpan: 6 },
      { id: 'slot-3', column: 7, columnSpan: 3, row: 1, rowSpan: 6 },
      { id: 'slot-4', column: 10, columnSpan: 3, row: 1, rowSpan: 6 }
    ]
  },

  [SlideLayout.FOUR_ROWS]: {
    id: SlideLayout.FOUR_ROWS,
    name: 'Four Rows',
    description: 'Four blocks stacked',
    minBlocks: 4,
    maxBlocks: 4,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
      { id: 'slot-2', column: 1, columnSpan: 12, row: 2, rowSpan: 2 },
      { id: 'slot-3', column: 1, columnSpan: 12, row: 4, rowSpan: 2 },
      { id: 'slot-4', column: 1, columnSpan: 12, row: 6, rowSpan: 1 }
    ]
  },

  // ============================================
  // DEPRECATED (backward compatibility)
  // ============================================

  [SlideLayout.TITLE_SINGLE]: {
    id: SlideLayout.TITLE_SINGLE,
    name: 'Title + Content (Deprecated)',
    description: 'Use slide title feature instead',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
      { id: 'slot-2', column: 1, columnSpan: 12, row: 2, rowSpan: 5 }
    ]
  },
};

export function getLayoutsForBlockCount(blockCount: number): LayoutDefinition[] {
  return Object.values(LAYOUT_REGISTRY).filter(layout => {
    // Exclude deprecated layouts
    if (layout.id === SlideLayout.TITLE_SINGLE) return false;
    
    return blockCount >= layout.minBlocks && blockCount <= layout.maxBlocks;
  });
}

export function getDefaultLayout(blockCount: number): SlideLayout {
  if (blockCount === 0 || blockCount === 1) return SlideLayout.SINGLE;
  if (blockCount === 2) return SlideLayout.TWO_HORIZONTAL;
  if (blockCount === 3) return SlideLayout.THREE_COLUMNS;
  if (blockCount === 4) return SlideLayout.GRID_2x2;
  
  // Shouldn't happen (we block > 4), but fallback
  return SlideLayout.SINGLE;
}

export function assignBlocksToSlots(
  blockIds: string[], 
  layout: LayoutDefinition
): Map<string, string> {
  const assignment = new Map<string, string>();
  
  layout.slots.forEach((slot, index) => {
    if (blockIds[index]) {
      assignment.set(slot.id, blockIds[index]);
    }
  });
  
  return assignment;
}