/**
 * Layout Engine
 * Automatically calculates optimal layouts for blocks on a slide
 * NOW WITH 6-ROW MAXIMUM CONSTRAINT
 */

const MAX_ROWS = 6; // Fixed constraint for 16:9 canvas

export interface LayoutPosition {
  blockId: string;
  column: number;      // Grid column start (1-12)
  columnSpan: number;  // How many columns wide (1-12)
  row: number;         // Grid row
  rowSpan: number;     // How many rows tall
  isTitle?: boolean;   // Whether this is in the title zone
}

export interface LayoutOption {
  name: string;
  description: string;
  positions: LayoutPosition[];
}

/**
 * Generate all possible layout options for a given number of blocks
 */
export function getLayoutOptions(blockIds: string[], hasTitleZone: boolean = false): LayoutOption[] {
  if (hasTitleZone && blockIds.length > 0) {
    // First block is title (takes 1 row), layout the rest in remaining 5 rows
    const titleId = blockIds[0];
    const contentIds = blockIds.slice(1);
    const contentLayouts = getContentLayoutOptions(contentIds, 5); // Only 5 rows left
    
    return contentLayouts.map(option => ({
      ...option,
      positions: [
        { blockId: titleId, column: 1, columnSpan: 12, row: 1, rowSpan: 1, isTitle: true },
        ...option.positions.map(pos => ({ ...pos, row: pos.row + 1 }))
      ]
    }));
  }
  
  return getContentLayoutOptions(blockIds, MAX_ROWS);
}

/**
 * Generate layout options for content blocks with row limit
 */
function getContentLayoutOptions(blockIds: string[], maxRows: number): LayoutOption[] {
  const count = blockIds.length;

  if (count === 0) {
    return [{
      name: 'Empty',
      description: 'No content blocks',
      positions: []
    }];
  }

  // If blocks fit naturally, use standard layouts
  if (count <= maxRows) {
    return getStandardLayouts(blockIds);
  }

  // Too many blocks - need to compress
  return getCompressedLayouts(blockIds, maxRows);
}

/**
 * Standard layouts for blocks that fit within row limit
 */

function getStandardLayouts(blockIds: string[]): LayoutOption[] {
  const count = blockIds.length;

  switch (count) {
    case 1:
      return [{
        name: 'Full Width',
        description: 'Single block fills entire area',
        positions: [
          { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 6 }
        ]
      }];
    
    case 2:
      return [
        {
          name: 'Side by Side',
          description: 'Two blocks split horizontally',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 6 },
            { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 6 }
          ]
        },
        {
          name: 'Stacked',
          description: 'Two blocks stacked vertically',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 3 },
            { blockId: blockIds[1], column: 1, columnSpan: 12, row: 4, rowSpan: 3 }
          ]
        }
      ];
    
    case 3:
      return [
        {
          name: 'Left + Right Split',
          description: 'One block left, two stacked right',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 6 },
            { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 3 },
            { blockId: blockIds[2], column: 7, columnSpan: 6, row: 4, rowSpan: 3 }
          ]
        },
        {
          name: 'Top + Bottom Split',
          description: 'One block top, two side-by-side bottom',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 2 },
            { blockId: blockIds[1], column: 1, columnSpan: 6, row: 3, rowSpan: 4 },
            { blockId: blockIds[2], column: 7, columnSpan: 6, row: 3, rowSpan: 4 }
          ]
        },
        {
          name: 'Three Columns',
          description: 'Three blocks side by side',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 4, row: 1, rowSpan: 6 },
            { blockId: blockIds[1], column: 5, columnSpan: 4, row: 1, rowSpan: 6 },
            { blockId: blockIds[2], column: 9, columnSpan: 4, row: 1, rowSpan: 6 }
          ]
        },
        {
          name: 'Stacked',
          description: 'Three blocks stacked vertically',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 2 },
            { blockId: blockIds[1], column: 1, columnSpan: 12, row: 3, rowSpan: 2 },
            { blockId: blockIds[2], column: 1, columnSpan: 12, row: 5, rowSpan: 2 }
          ]
        }
      ];
    
    case 4:
      return [
        {
          name: '2x2 Grid',
          description: 'Four blocks in a square grid',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 3 },
            { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 3 },
            { blockId: blockIds[2], column: 1, columnSpan: 6, row: 4, rowSpan: 3 },
            { blockId: blockIds[3], column: 7, columnSpan: 6, row: 4, rowSpan: 3 }
          ]
        },
        {
          name: 'Stacked',
          description: 'Four blocks stacked vertically',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 2 },
            { blockId: blockIds[1], column: 1, columnSpan: 12, row: 3, rowSpan: 1 },
            { blockId: blockIds[2], column: 1, columnSpan: 12, row: 4, rowSpan: 2 },
            { blockId: blockIds[3], column: 1, columnSpan: 12, row: 6, rowSpan: 1 }
          ]
        }
      ];
    
    case 5:
      return [
        {
          name: 'Stacked',
          description: 'Five blocks stacked vertically',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
            { blockId: blockIds[1], column: 1, columnSpan: 12, row: 2, rowSpan: 2 },
            { blockId: blockIds[2], column: 1, columnSpan: 12, row: 4, rowSpan: 1 },
            { blockId: blockIds[3], column: 1, columnSpan: 12, row: 5, rowSpan: 1 },
            { blockId: blockIds[4], column: 1, columnSpan: 12, row: 6, rowSpan: 1 }
          ]
        }
      ];
    
    case 6:
      return [
        {
          name: 'Stacked',
          description: 'Six blocks stacked vertically',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
            { blockId: blockIds[1], column: 1, columnSpan: 12, row: 2, rowSpan: 1 },
            { blockId: blockIds[2], column: 1, columnSpan: 12, row: 3, rowSpan: 1 },
            { blockId: blockIds[3], column: 1, columnSpan: 12, row: 4, rowSpan: 1 },
            { blockId: blockIds[4], column: 1, columnSpan: 12, row: 5, rowSpan: 1 },
            { blockId: blockIds[5], column: 1, columnSpan: 12, row: 6, rowSpan: 1 }
          ]
        },
        {
          name: '2x3 Grid',
          description: 'Six blocks in a 2x3 grid',
          positions: [
            { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 2 },
            { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 2 },
            { blockId: blockIds[2], column: 1, columnSpan: 6, row: 3, rowSpan: 2 },
            { blockId: blockIds[3], column: 7, columnSpan: 6, row: 3, rowSpan: 2 },
            { blockId: blockIds[4], column: 1, columnSpan: 6, row: 5, rowSpan: 2 },
            { blockId: blockIds[5], column: 7, columnSpan: 6, row: 5, rowSpan: 2 }
          ]
        }
      ];
    
    default:
      return getCompressedLayouts(blockIds, MAX_ROWS);
  }
}

/**
 * Compressed layouts for when there are too many blocks
 * Distributes blocks across multiple columns to fit within row limit
 */
function getCompressedLayouts(blockIds: string[], maxRows: number): LayoutOption[] {
  const count = blockIds.length;
  
  // Calculate how many columns we need
  const blocksPerColumn = Math.ceil(count / 2); // Try 2 columns first
  
  if (blocksPerColumn <= maxRows) {
    // 2 columns works
    const leftColumn = blockIds.slice(0, blocksPerColumn);
    const rightColumn = blockIds.slice(blocksPerColumn);
    
    return [{
      name: '2 Column Grid',
      description: `${count} blocks in 2 columns`,
      positions: [
        ...leftColumn.map((id, index) => ({
          blockId: id,
          column: 1,
          columnSpan: 6,
          row: index + 1,
          rowSpan: 1
        })),
        ...rightColumn.map((id, index) => ({
          blockId: id,
          column: 7,
          columnSpan: 6,
          row: index + 1,
          rowSpan: 1
        }))
      ]
    }];
  }
  
  // Need 3 columns
  const blocksPerColumn3 = Math.ceil(count / 3);
  const col1 = blockIds.slice(0, blocksPerColumn3);
  const col2 = blockIds.slice(blocksPerColumn3, blocksPerColumn3 * 2);
  const col3 = blockIds.slice(blocksPerColumn3 * 2);
  
  return [{
    name: '3 Column Grid',
    description: `${count} blocks in 3 columns`,
    positions: [
      ...col1.map((id, index) => ({
        blockId: id,
        column: 1,
        columnSpan: 4,
        row: index + 1,
        rowSpan: 1
      })),
      ...col2.map((id, index) => ({
        blockId: id,
        column: 5,
        columnSpan: 4,
        row: index + 1,
        rowSpan: 1
      })),
      ...col3.map((id, index) => ({
        blockId: id,
        column: 9,
        columnSpan: 4,
        row: index + 1,
        rowSpan: 1
      }))
    ]
  }];
}

/**
 * Get the current layout for a slide
 */
export function getCurrentLayout(
  blockIds: string[],
  layoutMode: 'auto' | 'vertical-stack',
  layoutPattern: number = 0,
  hasTitleZone: boolean = false
): LayoutPosition[] {
  if (layoutMode === 'vertical-stack') {
    const maxRows = hasTitleZone ? 5 : 6;
    
    // If too many blocks for vertical stack, compress into columns
    if (blockIds.length > maxRows) {
      const options = getLayoutOptions(blockIds, hasTitleZone);
      return options[0]?.positions || [];
    }
    
    // Standard vertical stack
    return blockIds.map((id, index) => ({
      blockId: id,
      column: 1,
      columnSpan: 12,
      row: hasTitleZone ? index + 2 : index + 1,
      rowSpan: 1,
      isTitle: hasTitleZone && index === 0
    }));
  }

  // Auto mode
  const options = getLayoutOptions(blockIds, hasTitleZone);
  const selectedOption = options[layoutPattern] || options[0];
  
  return selectedOption?.positions || [];
}