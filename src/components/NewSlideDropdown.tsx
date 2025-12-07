import { useState, useRef, useEffect } from 'react';
import type { SimpleSlide, BlockInstance } from '../types/core';
import { getAllSlideTemplates, createSlideFromTemplate, type SlideTemplate } from '../services/slideTemplateManager';
import { blockRegistry } from '../block-registry';

interface NewSlideDropdownProps {
  onCreateBlankSlide: () => void;
  onCreateSlideFromTemplate: (slide: SimpleSlide, blocks: BlockInstance[]) => void;
}

export function NewSlideDropdown({
  onCreateBlankSlide,
  onCreateSlideFromTemplate,
}: NewSlideDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const templates = getAllSlideTemplates();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTemplateClick = (template: SlideTemplate) => {
    const result = createSlideFromTemplate(
      template,
      blockRegistry.createDefaultBlock.bind(blockRegistry)
    );

    if (result) {
      onCreateSlideFromTemplate(result.slide, result.blocks);
      setIsOpen(false);
    } else {
      alert('Failed to create slide from template');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
      >
        New Slide
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Blank Slide Option */}
          <button
            onClick={() => {
              onCreateBlankSlide();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100"
          >
            ✨ Blank Slide
          </button>

          {/* Template Options */}
          {templates.length > 0 ? (
            <>
              <div className="px-4 py-1 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                From Template:
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{template.name}</div>
                  {template.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {template.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5">
                    {template.blocks.length} block{template.blocks.length !== 1 ? 's' : ''} • {template.layout}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-xs text-gray-400 italic">
              No slide templates yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}