// ============================================
// LESSON CONTEXT
// ============================================
// Provides lesson-level data (objectives, etc.) to all blocks

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface LessonContextValue {
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
}

const LessonContext = createContext<LessonContextValue | null>(null);

export function LessonProvider({ 
  children,
  lessonObjectives,
  completedObjectives,
  onToggleObjective,
}: {
  children: ReactNode;
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
}) {
  return (
    <LessonContext.Provider value={{ 
      lessonObjectives, 
      completedObjectives, 
      onToggleObjective 
    }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLessonContext() {
  const context = useContext(LessonContext);
  if (!context) {
    // Return empty defaults if no context (e.g., in presentation mode without objectives)
    return {
      lessonObjectives: [],
      completedObjectives: [],
      onToggleObjective: () => {},
    };
  }
  return context;
}