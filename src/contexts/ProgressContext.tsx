import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { topics } from "@/data/content";

export interface TopicProgress {
  learnComplete: boolean;
  quizComplete: boolean;
  quizScore: number;
  speakComplete: boolean;
}

interface ProgressData {
  totalMinutes: number;
  todayMinutes: number;
  currentStreak: number;
  lastPracticeDate: string | null;
  completedPrompts: string[];
  reviewedVocab: string[];
  reviewedGrammar: string[];
  topicProgress: Record<string, TopicProgress>;
}

interface ProgressContextType extends ProgressData {
  startSession: () => void;
  endSession: () => void;
  markPromptComplete: (id: string) => void;
  markVocabReviewed: (id: string) => void;
  markGrammarReviewed: (id: string) => void;
  completeLearnPhase: (topicId: string) => void;
  completeQuizPhase: (topicId: string, score: number) => void;
  completeSpeakPhase: (topicId: string) => void;
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  getTopicProgress: (topicId: string) => TopicProgress;
  isSessionActive: boolean;
}

const defaultTopicProgress: TopicProgress = {
  learnComplete: false,
  quizComplete: false,
  quizScore: 0,
  speakComplete: false,
};

const defaultProgress: ProgressData = {
  totalMinutes: 0,
  todayMinutes: 0,
  currentStreak: 0,
  lastPracticeDate: null,
  completedPrompts: [],
  reviewedVocab: [],
  reviewedGrammar: [],
  topicProgress: {},
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
    if (data.lastPracticeDate !== getToday()) {
      data.todayMinutes = 0;
    }
    if (!data.topicProgress) {
      data.topicProgress = {};
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

  const completeLearnPhase = useCallback((topicId: string) => {
    setProgress((prev) => ({
      ...prev,
      topicProgress: {
        ...prev.topicProgress,
        [topicId]: {
          ...(prev.topicProgress[topicId] || defaultTopicProgress),
          learnComplete: true,
        },
      },
      lastPracticeDate: getToday(),
    }));
  }, []);

  const completeQuizPhase = useCallback((topicId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      topicProgress: {
        ...prev.topicProgress,
        [topicId]: {
          ...(prev.topicProgress[topicId] || defaultTopicProgress),
          quizComplete: true,
          quizScore: Math.max(prev.topicProgress[topicId]?.quizScore || 0, score),
        },
      },
      lastPracticeDate: getToday(),
    }));
  }, []);

  const completeSpeakPhase = useCallback((topicId: string) => {
    setProgress((prev) => ({
      ...prev,
      topicProgress: {
        ...prev.topicProgress,
        [topicId]: {
          ...(prev.topicProgress[topicId] || defaultTopicProgress),
          speakComplete: true,
        },
      },
      lastPracticeDate: getToday(),
    }));
  }, []);

  const getTopicProgress = useCallback(
    (topicId: string): TopicProgress => {
      return progress.topicProgress[topicId] || defaultTopicProgress;
    },
    [progress.topicProgress]
  );

  const isTopicComplete = useCallback(
    (topicId: string): boolean => {
      const tp = progress.topicProgress[topicId];
      if (!tp) return false;
      return tp.learnComplete && tp.quizComplete && tp.speakComplete;
    },
    [progress.topicProgress]
  );

  const isTopicUnlocked = useCallback(
    (topicId: string): boolean => {
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) return false;
      if (topic.order === 1) return true;
      const prevTopic = topics.find((t) => t.order === topic.order - 1);
      if (!prevTopic) return true;
      return isTopicComplete(prevTopic.id);
    },
    [isTopicComplete]
  );

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
        completeLearnPhase,
        completeQuizPhase,
        completeSpeakPhase,
        isTopicUnlocked,
        isTopicComplete,
        getTopicProgress,
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
