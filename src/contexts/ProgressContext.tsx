import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ProgressData {
  totalMinutes: number;
  todayMinutes: number;
  currentStreak: number;
  lastPracticeDate: string | null;
  completedPrompts: string[];
  reviewedVocab: string[];
  reviewedGrammar: string[];
}

interface ProgressContextType extends ProgressData {
  startSession: () => void;
  endSession: () => void;
  markPromptComplete: (id: string) => void;
  markVocabReviewed: (id: string) => void;
  markGrammarReviewed: (id: string) => void;
  isSessionActive: boolean;
}

const defaultProgress: ProgressData = {
  totalMinutes: 0,
  todayMinutes: 0,
  currentStreak: 0,
  lastPracticeDate: null,
  completedPrompts: [],
  reviewedVocab: [],
  reviewedGrammar: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = "korean-app-progress";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadProgress(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const data = JSON.parse(stored) as ProgressData;
    // Reset today's minutes if it's a new day
    if (data.lastPracticeDate !== getToday()) {
      data.todayMinutes = 0;
    }
    return data;
  } catch {
    return defaultProgress;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const isSessionActive = sessionStart !== null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Auto-start session on mount, end on unmount
  useEffect(() => {
    const start = Date.now();
    setSessionStart(start);
    return () => {
      const elapsed = Math.floor((Date.now() - start) / 60000);
      if (elapsed > 0) {
        setProgress((prev) => {
          const today = getToday();
          const isNewDay = prev.lastPracticeDate !== today;
          return {
            ...prev,
            totalMinutes: prev.totalMinutes + elapsed,
            todayMinutes: prev.todayMinutes + elapsed,
            currentStreak: isNewDay ? prev.currentStreak + 1 : prev.currentStreak,
            lastPracticeDate: today,
          };
        });
      }
    };
  }, []);

  // Tick every minute to update today's time
  useEffect(() => {
    if (!sessionStart) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const today = getToday();
        const isNewDay = prev.lastPracticeDate !== today;
        return {
          ...prev,
          todayMinutes: prev.todayMinutes + 1,
          totalMinutes: prev.totalMinutes + 1,
          currentStreak: isNewDay ? prev.currentStreak + 1 : prev.currentStreak,
          lastPracticeDate: today,
        };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const startSession = useCallback(() => {
    if (!sessionStart) setSessionStart(Date.now());
  }, [sessionStart]);

  const endSession = useCallback(() => {
    if (sessionStart) {
      const elapsed = Math.floor((Date.now() - sessionStart) / 60000);
      if (elapsed > 0) {
        setProgress((prev) => ({
          ...prev,
          totalMinutes: prev.totalMinutes + elapsed,
          todayMinutes: prev.todayMinutes + elapsed,
          lastPracticeDate: getToday(),
        }));
      }
      setSessionStart(null);
    }
  }, [sessionStart]);

  const markPromptComplete = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      completedPrompts: prev.completedPrompts.includes(id) ? prev.completedPrompts : [...prev.completedPrompts, id],
      lastPracticeDate: getToday(),
    }));
  }, []);

  const markVocabReviewed = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      reviewedVocab: prev.reviewedVocab.includes(id) ? prev.reviewedVocab : [...prev.reviewedVocab, id],
      lastPracticeDate: getToday(),
    }));
  }, []);

  const markGrammarReviewed = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      reviewedGrammar: prev.reviewedGrammar.includes(id) ? prev.reviewedGrammar : [...prev.reviewedGrammar, id],
      lastPracticeDate: getToday(),
    }));
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        ...progress,
        startSession,
        endSession,
        isSessionActive,
        markPromptComplete,
        markVocabReviewed,
        markGrammarReviewed,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
