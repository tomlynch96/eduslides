import React, { useState } from 'react';
import type { SimpleSlide, BlockInstance } from '../types/core';
import { createTemplateFromSlide, saveSlideTemplate, type SlideTemplate } from '../services/slideTemplateManager';

interface SaveSlideTemplateModalProps {
  slide: SimpleSlide;
  blocks: BlockInstance[];
  onClose: () => void;
  onSaved: (template: SlideTemplate) => void;
}

export function SaveSlideTemplateModal({
  slide,
  blocks,
  onClose,
  onSaved,
}: SaveSlideTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }

    if (blocks.length === 0) {
      setError('Cannot save empty slide as template');
      return;
    }

    try {
      const template = createTemplateFromSlide(
        slide,
        blocks,
        templateName.trim(),
        description.trim() || undefined
      );

      saveSlideTemplate(template);
      onSaved(template);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Save Slide Template
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Save this slide layout and block structure for reuse
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Slide Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Slide Layout: {slide.layout}
            </div>
            <div className="text-xs text-gray-500">
              {blocks.length} block{blocks.length !== 1 ? 's' : ''}: {blocks.map(b => b.type).join(', ')}
            </div>
          </div>

          {/* Template Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Exit Ticket Slide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this slide template for?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* What Gets Saved */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              What will be saved:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">Slide layout ({slide.layout})</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">Block types and positions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">Instructions from blocks (templateable fields)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400">✗</span>
                <span className="text-gray-500">Specific content (questions, text, etc.)</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <strong>Slide templates</strong> save the structure and instructional scaffolding. 
            When you use this template, you'll get the same layout with instructions pre-filled, 
            but you'll add new content for each lesson.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={blocks.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}