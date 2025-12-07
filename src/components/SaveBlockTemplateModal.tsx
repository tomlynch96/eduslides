import React, { useState } from 'react';
import type { BlockInstance, BlockTemplate } from '../types/core';
import { createTemplateFromBlock, saveTemplate, templateHasContent } from '../services/templateManager';
import { getBlockType } from '../data/blockTypes';

interface SaveBlockTemplateModalProps {
  block: BlockInstance;
  onClose: () => void;
  onSaved: (template: BlockTemplate) => void;
}

export function SaveBlockTemplateModal({
  block,
  onClose,
  onSaved,
}: SaveBlockTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const blockType = getBlockType(block.type);

  // Get list of templateable fields from this block
  const templateableFields = blockType?.fields
    .filter(f => f.isTemplateable && block.content[f.name] !== undefined)
    .map(f => ({
      name: f.name,
      value: block.content[f.name],
    })) || [];

  const hasTemplateableContent = templateableFields.length > 0;

  const handleSave = () => {
    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }

    if (!hasTemplateableContent) {
      setError('This block has no templateable content to save');
      return;
    }

    try {
      const template = createTemplateFromBlock(
        block,
        templateName.trim(),
        description.trim() || undefined
      );

      saveTemplate(template);
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
            Save Block Template
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Save reusable instructions and scaffolds
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Block Type Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Block Type: {blockType?.name || block.type}
            </div>
            <div className="text-xs text-gray-500">
              {blockType?.icon} {blockType?.description}
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
              placeholder="e.g., Think-Pair-Share Instructions"
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
              placeholder="What is this template for?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Templateable Fields Preview */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Fields that will be saved:
            </div>
            {hasTemplateableContent ? (
              <div className="space-y-2">
                {templateableFields.map(field => (
                  <div key={field.name} className="p-2 bg-green-50 border border-green-200 rounded">
                    <div className="text-xs font-medium text-green-900 mb-0.5">
                      ✓ {field.name}
                    </div>
                    <div className="text-xs text-green-700 truncate">
                      {typeof field.value === 'string' 
                        ? field.value.substring(0, 60) + (field.value.length > 60 ? '...' : '')
                        : JSON.stringify(field.value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ This block has no templateable fields with content.
                Add instructions or other reusable content before saving as a template.
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <strong>How templates work:</strong> Only instructional scaffolding fields 
            (like "instructions") are saved. Lesson-specific content (like questions and answers) 
            will be empty when you use this template.
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
            disabled={!hasTemplateableContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}