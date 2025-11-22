/**
 * Layout Engine
 * Automatically calculates optimal layouts for blocks on a slide
 */

export interface LayoutPosition {
    blockId: string;
    column: number;      // Grid column start (1-12)
    columnSpan: number;  // How many columns wide (1-12)
    row: number;         // Grid row
    rowSpan: number;     // How many rows tall
  }
  
  export interface LayoutOption {
    name: string;
    description: string;
    positions: LayoutPosition[];
  }
  
  /**
   * Generate all possible layout options for a given number of blocks
   */
  export function getLayoutOptions(blockIds: string[]): LayoutOption[] {
    const count = blockIds.length;
  
    switch (count) {
      case 0:
        return [];
      
      case 1:
        return [
          {
            name: 'Full Width',
            description: 'Single block fills entire slide',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 }
            ]
          }
        ];
      
      case 2:
        return [
          {
            name: 'Side by Side',
            description: 'Two blocks split horizontally',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 1 }
            ]
          },
          {
            name: 'Stacked',
            description: 'Two blocks stacked vertically',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 1, columnSpan: 12, row: 2, rowSpan: 1 }
            ]
          }
        ];
      
      case 3:
        return [
          {
            name: 'Left + Right Split',
            description: 'One block left, two stacked right',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 2 },
              { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 1 },
              { blockId: blockIds[2], column: 7, columnSpan: 6, row: 2, rowSpan: 1 }
            ]
          },
          {
            name: 'Top + Bottom Split',
            description: 'One block top, two side-by-side bottom',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 1, columnSpan: 6, row: 2, rowSpan: 1 },
              { blockId: blockIds[2], column: 7, columnSpan: 6, row: 2, rowSpan: 1 }
            ]
          },
          {
            name: 'Three Columns',
            description: 'Three blocks side by side',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 4, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 5, columnSpan: 4, row: 1, rowSpan: 1 },
              { blockId: blockIds[2], column: 9, columnSpan: 4, row: 1, rowSpan: 1 }
            ]
          },
          {
            name: 'Stacked',
            description: 'Three blocks stacked vertically',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 1, columnSpan: 12, row: 2, rowSpan: 1 },
              { blockId: blockIds[2], column: 1, columnSpan: 12, row: 3, rowSpan: 1 }
            ]
          }
        ];
      
      case 4:
        return [
          {
            name: '2x2 Grid',
            description: 'Four blocks in a square grid',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 6, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 7, columnSpan: 6, row: 1, rowSpan: 1 },
              { blockId: blockIds[2], column: 1, columnSpan: 6, row: 2, rowSpan: 1 },
              { blockId: blockIds[3], column: 7, columnSpan: 6, row: 2, rowSpan: 1 }
            ]
          },
          {
            name: 'Four Columns',
            description: 'Four blocks side by side',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 3, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 4, columnSpan: 3, row: 1, rowSpan: 1 },
              { blockId: blockIds[2], column: 7, columnSpan: 3, row: 1, rowSpan: 1 },
              { blockId: blockIds[3], column: 10, columnSpan: 3, row: 1, rowSpan: 1 }
            ]
          },
          {
            name: 'Stacked',
            description: 'Four blocks stacked vertically',
            positions: [
              { blockId: blockIds[0], column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
              { blockId: blockIds[1], column: 1, columnSpan: 12, row: 2, rowSpan: 1 },
              { blockId: blockIds[2], column: 1, columnSpan: 12, row: 3, rowSpan: 1 },
              { blockId: blockIds[3], column: 1, columnSpan: 12, row: 4, rowSpan: 1 }
            ]
          }
        ];
      
      default:
        // For 5+ blocks, default to vertical stack
        return [
          {
            name: 'Stacked',
            description: `${count} blocks stacked vertically`,
            positions: blockIds.map((id, index) => ({
              blockId: id,
              column: 1,
              columnSpan: 12,
              row: index + 1,
              rowSpan: 1
            }))
          }
        ];
    }
  }
  
  /**
   * Get the current layout for a slide
   */
  export function getCurrentLayout(
    blockIds: string[],
    layoutMode: 'auto' | 'vertical-stack',
    layoutPattern: number = 0
  ): LayoutPosition[] {
    if (layoutMode === 'vertical-stack') {
      // Force vertical stack
      return blockIds.map((id, index) => ({
        blockId: id,
        column: 1,
        columnSpan: 12,
        row: index + 1,
        rowSpan: 1
      }));
    }
  
    // Auto mode - get the selected pattern
    const options = getLayoutOptions(blockIds);
    const selectedOption = options[layoutPattern] || options[0];
    
    return selectedOption ? selectedOption.positions : [];
  }