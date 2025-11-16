import type { TextBlockInstance } from '../../types/core';

interface TextBlockProps {
  block: TextBlockInstance;
}

export function TextBlock({ block }: TextBlockProps) {
  const { text, fontSize, alignment } = block.content;

  // Map fontSize to actual CSS classes
  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl',
  }[fontSize];

  // Map alignment to CSS classes
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  return (
    <div className={`p-6 ${alignmentClass}`}>
      <p className={`${fontSizeClass} text-gray-900 whitespace-pre-wrap`}>
        {text}
      </p>
    </div>
  );
}