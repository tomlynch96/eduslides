import { SlideLayout, type LayoutDefinition } from '../types/core';

export const LAYOUT_REGISTRY: Record<SlideLayout, LayoutDefinition> = {
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

  [SlideLayout.TITLE_SINGLE]: {
    id: SlideLayout.TITLE_SINGLE,
    name: 'Title + Content',
    description: 'Title at top, content below',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▬',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 12, row: 1, rowSpan: 1, label: 'Title' },
      { id: 'slot-2', column: 1, columnSpan: 12, row: 2, rowSpan: 5, label: 'Content' }
    ]
  },

  [SlideLayout.TWO_HORIZONTAL]: {
    id: SlideLayout.TWO_HORIZONTAL,
    name: 'Two Columns',
    description: 'Two blocks side by side',
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
    description: 'Two blocks stacked vertically',
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
    description: 'Narrow left sidebar with main content',
    minBlocks: 2,
    maxBlocks: 2,
    icon: '▌▭',
    slots: [
      { id: 'slot-1', column: 1, columnSpan: 3, row: 1, rowSpan: 6, label: 'Sidebar' },
      { id: 'slot-2', column: 4, columnSpan: 9, row: 1, rowSpan: 6, label: 'Main' }
    ]
  },

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
};

export function getLayoutsForBlockCount(blockCount: number): LayoutDefinition[] {
  return Object.values(LAYOUT_REGISTRY).filter(layout => 
    blockCount >= layout.minBlocks && blockCount <= layout.maxBlocks
  );
}

export function getDefaultLayout(blockCount: number): SlideLayout {
  if (blockCount === 0 || blockCount === 1) return SlideLayout.SINGLE;
  if (blockCount === 2) return SlideLayout.TWO_HORIZONTAL;
  if (blockCount >= 4) return SlideLayout.GRID_2x2;
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