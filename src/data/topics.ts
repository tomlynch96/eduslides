import type { Topic } from '../types/core';

// ============================================
// GLOBAL TOPIC DICTIONARY
// In production, this would be a comprehensive curriculum database
// For now, we'll use a simple hardcoded list
// ============================================

export const TOPICS: Record<string, Topic> = {
  'waves_introduction': {
    id: 'waves_introduction',
    name: 'Introduction to Waves',
    subject: 'Physics',
    examBoard: 'AQA',
    specificationPoints: ['4.6.1.1'],
  },
  'waves_reflection': {
    id: 'waves_reflection',
    name: 'Reflection of Waves',
    subject: 'Physics',
    examBoard: 'AQA',
    specificationPoints: ['4.6.1.2'],
  },
  'waves_refraction': {
    id: 'waves_refraction',
    name: 'Refraction and Snell\'s Law',
    subject: 'Physics',
    examBoard: 'AQA',
    specificationPoints: ['4.6.1.3'],
  },
  'algebra_linear': {
    id: 'algebra_linear',
    name: 'Linear Equations',
    subject: 'Mathematics',
    examBoard: 'Edexcel',
  },
  'algebra_quadratic': {
    id: 'algebra_quadratic',
    name: 'Quadratic Equations',
    subject: 'Mathematics',
    examBoard: 'Edexcel',
  },
  'forces_newtons_laws': {
    id: 'forces_newtons_laws',
    name: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    examBoard: 'AQA',
  },
};

// Helper functions
export function getTopic(id: string): Topic | undefined {
  return TOPICS[id];
}

export function getAllTopics(): Topic[] {
  return Object.values(TOPICS);
}

export function getTopicsBySubject(subject: string): Topic[] {
  return Object.values(TOPICS).filter(topic => topic.subject === subject);
}