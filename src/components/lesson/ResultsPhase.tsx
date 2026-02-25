import { useEffect } from "react";
import { topics, getNextTopic, getVocabForTopic } from "@/data/content";
import { useProgress } from "@/contexts/ProgressContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, ChevronRight, RotateCcw, Home } from "lucide-react";

interface ResultsPhaseProps {
  topicId: string;
  quizScore: number;
}

export default function ResultsPhase({ topicId, quizScore }: ResultsPhaseProps) {
  const { name, koreanName } = useUser();
  const { completeLearnPhase, completeQuizPhase, completeSpeakPhase, isTopicUnlocked } = useProgress();
  const navigate = useNavigate();

  const topic = topics.find((t) => t.id === topicId);
  const nextTopic = getNextTopic(topicId);
  const vocabCount = getVocabForTopic(topicId).length;
  const nextUnlocked = nextTopic ? isTopicUnlocked(nextTopic.id) : false;

  useEffect(() => {
    completeLearnPhase(topicId);
    completeQuizPhase(topicId, quizScore);
    completeSpeakPhase(topicId);
  }, [topicId, quizScore, completeLearnPhase, completeQuizPhase, completeSpeakPhase]);

  const displayName = koreanName || name;
  const isGreatScore = quizScore >= 80;
  const isPerfect = quizScore === 100;

  return (
    <div className="space-y-6">
      {/* Celebration header */}
      <div className="text-center space-y-3 py-4">
        <div className="text-5xl">
          {isPerfect ? "🎉" : isGreatScore ? "🌟" : "💪"}
        </div>
        <h1 className="text-2xl font-bold">
          {isPerfect
            ? `완벽해요! Perfect, ${displayName}!`
            : isGreatScore
              ? `잘했어요! Great job, ${displayName}!`
              : `좋아요! Good effort, ${displayName}!`}
        </h1>
        <p className="text-muted-foreground">
          You completed{" "}
          <span className="font-semibold">
            {topic?.emoji} {topic?.title}
          </span>
        </p>
      </div>

      {/* Score card */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-5 h-5 text-streak" />
            </div>
            <p className="text-3xl font-bold">{quizScore}%</p>
            <p className="text-xs text-muted-foreground">Quiz Score</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 text-streak" />
            </div>
            <p className="text-3xl font-bold">{vocabCount}</p>
            <p className="text-xs text-muted-foreground">Words Learned</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 ${
                quizScore >= star * 33
                  ? "text-streak fill-streak"
                  : "text-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {nextTopic && (nextUnlocked || true) && (
          <button
            onClick={() => navigate(`/lesson/${nextTopic.id}`, { replace: true })}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            <span>
              Next: {nextTopic.emoji} {nextTopic.title}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => navigate(`/lesson/${topicId}`, { replace: true })}
          className="w-full py-3 rounded-xl border border-border bg-card font-semibold text-sm transition-all hover:bg-muted flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice again</span>
        </button>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to home</span>
        </button>
      </div>
    </div>
  );
}
