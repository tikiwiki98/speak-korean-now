import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { topics } from "@/data/content";
import { useProgress } from "@/contexts/ProgressContext";
import LearnPhase from "@/components/lesson/LearnPhase";
import QuizPhase from "@/components/lesson/QuizPhase";
import SpeakPhase from "@/components/lesson/SpeakPhase";
import ResultsPhase from "@/components/lesson/ResultsPhase";
import { ChevronLeft, BookOpen, Brain, Mic, Lock } from "lucide-react";

type Phase = "learn" | "quiz" | "speak" | "results";

const phaseLabels: Record<Phase, { label: string; icon: typeof BookOpen }> = {
  learn: { label: "Learn", icon: BookOpen },
  quiz: { label: "Quiz", icon: Brain },
  speak: { label: "Speak", icon: Mic },
  results: { label: "Results", icon: BookOpen },
};

export default function Lesson() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { isTopicUnlocked } = useProgress();

  const [phase, setPhase] = useState<Phase>("learn");
  const [quizScore, setQuizScore] = useState(0);

  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/" className="text-primary mt-2 inline-block">Back home</Link>
      </div>
    );
  }

  if (!isTopicUnlocked(topic.id)) {
    return (
      <div className="text-center py-12 space-y-4">
        <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
        <p className="text-muted-foreground">Complete the previous topic to unlock this one.</p>
        <Link to="/" className="text-primary inline-block">Back home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      {phase !== "results" && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              {topic.emoji} {topic.title}
            </h1>
            <p className="text-sm text-muted-foreground font-korean">
              {topic.titleKorean}
            </p>
          </div>
        </div>
      )}

      {/* Phase indicator */}
      {phase !== "results" && (
        <div className="flex gap-1">
          {(["learn", "quiz", "speak"] as const).map((p) => {
            const { label, icon: Icon } = phaseLabels[p];
            const isActive = p === phase;
            const isPast =
              (p === "learn" && (phase === "quiz" || phase === "speak")) ||
              (p === "quiz" && phase === "speak");

            return (
              <div
                key={p}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isPast
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            );
          })}
        </div>
      )}

      {/* Phase content */}
      {phase === "learn" && (
        <LearnPhase topicId={topic.id} onComplete={() => setPhase("quiz")} />
      )}
      {phase === "quiz" && (
        <QuizPhase
          topicId={topic.id}
          onComplete={(score) => {
            setQuizScore(score);
            setPhase("speak");
          }}
        />
      )}
      {phase === "speak" && (
        <SpeakPhase topicId={topic.id} onComplete={() => setPhase("results")} />
      )}
      {phase === "results" && (
        <ResultsPhase topicId={topic.id} quizScore={quizScore} />
      )}
    </div>
  );
}
