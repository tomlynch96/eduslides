// ============================================
// ENHANCED TEXT BLOCK RENDERER - FIXED BUTTONS
// ============================================

import { useState, useRef } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { TextBlockInstance } from '../../types/core';

// Pastel warm color palette
const PASTEL_COLORS = {
  none: { name: 'None', bg: 'bg-transparent', border: 'border-transparent' },
  'warm-yellow': { name: 'Warm Yellow', bg: 'bg-amber-50', border: 'border-amber-200' },
  'warm-peach': { name: 'Warm Peach', bg: 'bg-orange-50', border: 'border-orange-200' },
  'warm-pink': { name: 'Warm Pink', bg: 'bg-rose-50', border: 'border-rose-200' },
  'warm-blue': { name: 'Warm Blue', bg: 'bg-sky-50', border: 'border-sky-200' },
  'warm-green': { name: 'Warm Green', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'warm-purple': { name: 'Warm Purple', bg: 'bg-purple-50', border: 'border-purple-200' },
} as const;

type BackgroundColor = keyof typeof PASTEL_COLORS;

export function TextBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<TextBlockInstance>) {
  const { text, fontSize, alignment, backgroundColor = 'none' } = block.content;
  const [showFormatHelp, setShowFormatHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Map fontSize to CSS classes
  const fontSizeClass: Record<'small' | 'medium' | 'large', string> = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  // Map alignment to CSS classes
  const alignmentClass: Record<'left' | 'center' | 'right', string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Reduced padding for large text blocks (typically titles)
  const paddingClass = fontSize === 'large' ? 'p-3' : 'p-6';

  // Get background color classes
  const bgColor = PASTEL_COLORS[backgroundColor as BackgroundColor] || PASTEL_COLORS.none;

  // Parse and render rich text with formatting
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;

    // Split by lines to handle bullet points and numbering
    const lines = rawText.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check for bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <div key={lineIndex} className="flex gap-2 mb-1">
            <span>•</span>
            <span>{formatInlineText(content)}</span>
          </div>
        );
      }
      
      // Check for numbered lists
      const numberMatch = line.trim().match(/^(\d+)\.\s(.+)/);
      if (numberMatch) {
        return (
          <div key={lineIndex} className="flex gap-2 mb-1">
            <span>{numberMatch[1]}.</span>
            <span>{formatInlineText(numberMatch[2])}</span>
          </div>
        );
      }

      // Regular line with inline formatting
      return <div key={lineIndex} className="mb-1">{formatInlineText(line)}</div>;
    });
  };

  // Format inline text with bold, italic, underline
  const formatInlineText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Regular expressions for formatting
    const formatRegex = /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~)/g;
    
    let match;
    while ((match = formatRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }
      
      const matched = match[0];
      
      // Bold: **text**
      if (matched.startsWith('**') && matched.endsWith('**')) {
        parts.push(<strong key={match.index}>{matched.slice(2, -2)}</strong>);
      }
      // Italic: *text*
      else if (matched.startsWith('*') && matched.endsWith('*')) {
        parts.push(<em key={match.index}>{matched.slice(1, -1)}</em>);
      }
      // Underline: __text__
      else if (matched.startsWith('__') && matched.endsWith('__')) {
        parts.push(<u key={match.index}>{matched.slice(2, -2)}</u>);
      }
      // Strikethrough: ~~text~~
      else if (matched.startsWith('~~') && matched.endsWith('~~')) {
        parts.push(<s key={match.index}>{matched.slice(2, -2)}</s>);
      }
      
      currentIndex = match.index + matched.length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Fixed: Quick insert functions that properly work with textarea
  const insertFormatting = (prefix: string, suffix: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = 
      text.substring(0, start) + 
      prefix + textToInsert + suffix + 
      text.substring(end);
    
    // Update the content
    onContentChange?.({ ...block.content, text: newText });

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className={`${paddingClass} ${bgColor.bg} ${bgColor.border} border-2 rounded-xl space-y-4`}>
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            className="px-2 py-1 text-xs font-bold bg-white hover:bg-gray-100 border border-gray-300 rounded"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            className="px-2 py-1 text-xs italic bg-white hover:bg-gray-100 border border-gray-300 rounded"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('__', '__', 'underlined text')}
            className="px-2 py-1 text-xs underline bg-white hover:bg-gray-100 border border-gray-300 rounded"
            title="Underline (Ctrl+U)"
          >
            U
          </button>
          
          <span className="text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => {
              const newText = text + (text.endsWith('\n') || text === '' ? '' : '\n') + '• ';
              onContentChange?.({ ...block.content, text: newText });
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
            className="px-2 py-1 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded"
            title="Add bullet point"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => {
              // Find the next number
              const lines = text.split('\n');
              const lastNumbered = lines.reverse().find(l => /^\d+\./.test(l.trim()));
              const nextNum = lastNumbered ? parseInt(lastNumbered.match(/^(\d+)\./)?.[1] || '0') + 1 : 1;
              const newText = text + (text.endsWith('\n') || text === '' ? '' : '\n') + `${nextNum}. `;
              onContentChange?.({ ...block.content, text: newText });
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
            className="px-2 py-1 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded"
            title="Add numbered item"
          >
            1. List
          </button>

          <button
            type="button"
            onClick={() => setShowFormatHelp(!showFormatHelp)}
            className="ml-auto px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
          >
            ? Help
          </button>
        </div>

        {/* Help Panel */}
        {showFormatHelp && (
          <div className="text-xs bg-blue-50 border border-blue-200 rounded p-3 space-y-1">
            <p><strong>Formatting Guide:</strong></p>
            <p><code>**bold text**</code> → <strong>bold text</strong></p>
            <p><code>*italic text*</code> → <em>italic text</em></p>
            <p><code>__underlined__</code> → <u>underlined</u></p>
            <p><code>• Bullet point</code> or <code>- Bullet point</code></p>
            <p><code>1. Numbered item</code></p>
          </div>
        )}

        {/* Text Area */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onContentChange?.({
              ...block.content,
              text: e.target.value,
            })}
            onKeyDown={(e) => {
              // Keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') {
                  e.preventDefault();
                  insertFormatting('**', '**', 'bold');
                } else if (e.key === 'i') {
                  e.preventDefault();
                  insertFormatting('*', '*', 'italic');
                } else if (e.key === 'u') {
                  e.preventDefault();
                  insertFormatting('__', '__', 'underline');
                }
              }
            }}
            placeholder="Type your text here... Use formatting buttons above or type **bold**, *italic*, __underline__"
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSizeClass[fontSize]} ${alignmentClass[alignment]} bg-white`}
            rows={6}
            autoFocus
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => onContentChange?.({
                ...block.content,
                fontSize: e.target.value as 'small' | 'medium' | 'large',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={alignment}
              onChange={(e) => onContentChange?.({
                ...block.content,
                alignment: e.target.value as 'left' | 'center' | 'right',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background
            </label>
            <select
              value={backgroundColor}
              onChange={(e) => onContentChange?.({
                ...block.content,
                backgroundColor: e.target.value as BackgroundColor,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {Object.entries(PASTEL_COLORS).map(([key, color]) => (
                <option key={key} value={key}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Preview:</p>
          <div className={`px-4 py-3 ${fontSizeClass[fontSize]} ${alignmentClass[alignment]} text-gray-900`}>
            {renderFormattedText(text)}
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  return (
    <div className={`${paddingClass} ${bgColor.bg} ${alignmentClass[alignment]} rounded-xl`}>
      {text ? (
        <div className={`${fontSizeClass[fontSize]} text-gray-900`}>
          {renderFormattedText(text)}
        </div>
      ) : (
        <div className="text-gray-400 italic">
          Click to add text content
        </div>
      )}
    </div>
  );
}