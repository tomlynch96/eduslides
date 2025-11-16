import { useState } from 'react';
import type { TextBlockInstance, Difficulty } from '../types/core';
import { getAllTopics } from '../data/topics';
import { saveBlockInstance, generateId } from '../storage/storage';

interface BlockCreatorProps {
  onBlockCreated: (block: TextBlockInstance) => void;
}

export function BlockCreator({ onBlockCreated }: BlockCreatorProps) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('core');

  const topics = getAllTopics();

  const handleCreate = () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    if (!topic) {
      alert('Please select a topic');
      return;
    }

    const newBlock: TextBlockInstance = {
      id: generateId(),
      type: 'text',
      topic,
      difficulty,
      author: 'demo-user', // In production, this would be the logged-in user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        text,
        fontSize,
        alignment,
      },
    };

    // Save to storage
    saveBlockInstance(newBlock);

    // Notify parent component
    onBlockCreated(newBlock);

    // Reset form
    setText('');
    setTopic('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📝 Create Text Block
      </h2>

      <div className="space-y-4">
        {/* Text Content */}
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

        {/* Font Size */}
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

        {/* Alignment */}
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

        {/* Topic */}
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

        {/* Difficulty */}
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
          Create Block
        </button>
      </div>
    </div>
  );
}