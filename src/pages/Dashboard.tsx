import { useProgress } from "@/contexts/ProgressContext";
import { useUser } from "@/contexts/UserContext";
import { topics } from "@/data/content";
import { Link } from "react-router-dom";
import { Flame, Clock, ChevronRight, Lock, CheckCircle2, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { todayMinutes, currentStreak, isTopicUnlocked, isTopicComplete, getTopicProgress } = useProgress();
  const { name, koreanName } = useUser();

  const completedTopics = topics.filter((t) => isTopicComplete(t.id)).length;
  const displayName = koreanName || name;

  // Find the next topic to continue
  const nextTopic = topics.find((t) => isTopicUnlocked(t.id) && !isTopicComplete(t.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          안녕{displayName ? `, ${displayName}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {completedTopics === 0
            ? "Ready to start learning Korean?"
            : completedTopics === topics.length
              ? "You've completed all topics! 축하해요!"
              : `${completedTopics}/${topics.length} topics complete — keep going!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-streak" />
            <span className="text-sm font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold">
            {currentStreak}{" "}
            <span className="text-sm font-normal text-muted-foreground">days</span>
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Today</span>
          </div>
          <p className="text-2xl font-bold">
            {todayMinutes}{" "}
            <span className="text-sm font-normal text-muted-foreground">min</span>
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      {nextTopic && (
        <Link
          to={`/lesson/${nextTopic.id}`}
          className="block bg-primary text-primary-foreground rounded-xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {isTopicComplete(nextTopic.id) ? "Review" : "Continue Learning"}
              </p>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                {nextTopic.emoji} {nextTopic.title}
              </p>
            </div>
            <BookOpen className="w-8 h-8 opacity-80" />
          </div>
        </Link>
      )}

      {/* Topics */}
      <div>
        <h2 className="font-semibold mb-3">Topics</h2>
        <div className="space-y-2">
          {topics.map((topic) => {
            const unlocked = isTopicUnlocked(topic.id);
            const complete = isTopicComplete(topic.id);
            const tp = getTopicProgress(topic.id);

            const phases = [tp.learnComplete, tp.quizComplete, tp.speakComplete];
            const phasesComplete = phases.filter(Boolean).length;

            return (
              <Link
                key={topic.id}
                to={unlocked ? `/lesson/${topic.id}` : "#"}
                className={`flex items-center gap-3 bg-card rounded-xl p-4 border transition-colors ${
                  !unlocked
                    ? "border-border opacity-50 cursor-not-allowed"
                    : complete
                      ? "border-success/30 hover:border-success/50"
                      : "border-border hover:border-primary/30"
                }`}
                onClick={(e) => {
                  if (!unlocked) e.preventDefault();
                }}
              >
                <span className="text-2xl">{topic.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{topic.title}</p>
                    {complete && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </div>
                  <p className="text-sm text-muted-foreground font-korean">
                    {topic.titleKorean}
                  </p>
                  {unlocked && phasesComplete > 0 && !complete && (
                    <div className="flex gap-1 mt-1.5">
                      {["Learn", "Quiz", "Speak"].map((label, i) => (
                        <span
                          key={label}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            phases[i]
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {!unlocked ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Vocab & Grammar reference links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/vocabulary"
          className="bg-card rounded-xl p-4 border border-border hover:border-primary/20 transition-colors text-center"
        >
          <p className="text-lg mb-1">📖</p>
          <p className="text-sm font-medium">Vocabulary</p>
          <p className="text-xs text-muted-foreground">Reference</p>
        </Link>
        <Link
          to="/grammar"
          className="bg-card rounded-xl p-4 border border-border hover:border-primary/20 transition-colors text-center"
        >
          <p className="text-lg mb-1">📝</p>
          <p className="text-sm font-medium">Grammar</p>
          <p className="text-xs text-muted-foreground">Reference</p>
        </Link>
      </div>
    </div>
  );
}
