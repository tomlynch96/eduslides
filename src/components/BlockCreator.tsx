import { useState } from 'react';
import type { BlockInstance, Difficulty, BlockTypeName } from '../types/core';
import { getAllTopics } from '../data/topics';
import { getAllBlockTypes } from '../data/blockTypes';
import { saveBlockInstance, generateId } from '../storage/storage';

interface BlockCreatorProps {
  onBlockCreated: (block: BlockInstance) => void;
}

export function BlockCreator({ onBlockCreated }: BlockCreatorProps) {
  const [selectedType, setSelectedType] = useState<BlockTypeName>('text');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('core');

  // Text block fields
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  // Timer block fields
  const [duration, setDuration] = useState(60); // seconds
  const [label, setLabel] = useState('');
  const [autoStart, setAutoStart] = useState(false);

  const topics = getAllTopics();
  const blockTypes = getAllBlockTypes();

  const handleCreate = () => {
    if (!topic) {
      alert('Please select a topic');
      return;
    }

    let blockContent: any;

    // Build content based on selected type
    if (selectedType === 'text') {
      if (!text.trim()) {
        alert('Please enter some text');
        return;
      }
      blockContent = { text, fontSize, alignment };
    } else if (selectedType === 'timer') {
      if (duration <= 0) {
        alert('Please enter a valid duration');
        return;
      }
      blockContent = { duration, label, autoStart };
    } else {
      alert('Block type not yet implemented');
      return;
    }

    const newBlock: BlockInstance = {
      id: generateId(),
      type: selectedType,
      topic,
      difficulty,
      author: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: blockContent,
    };

    saveBlockInstance(newBlock);
    onBlockCreated(newBlock);

    // Reset form
    if (selectedType === 'text') {
      setText('');
    } else if (selectedType === 'timer') {
      setDuration(60);
      setLabel('');
      setAutoStart(false);
    }
    setTopic('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create Block
      </h2>

      <div className="space-y-4">
        {/* Block Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as BlockTypeName)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {blockTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Block Fields */}
        {selectedType === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value as 'left' | 'center' | 'right')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        {/* Timer Block Fields */}
        {selectedType === 'timer' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(duration / 60)}m {duration % 60}s
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Group Discussion Time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoStart"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="autoStart" className="text-sm text-gray-700">
                Auto-start timer when slide loads
              </label>
            </div>
          </>
        )}

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a topic...</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.subject})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="foundation">Foundation</option>
            <option value="core">Core</option>
            <option value="extension">Extension</option>
          </select>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Create {blockTypes.find(t => t.id === selectedType)?.name || 'Block'}
        </button>
      </div>
    </div>
  );
}