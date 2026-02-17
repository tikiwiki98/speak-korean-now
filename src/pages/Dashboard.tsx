import { useProgress } from "@/contexts/ProgressContext";
import { topics, conversationPrompts, vocabulary, grammar } from "@/data/content";
import { Link } from "react-router-dom";
import { Flame, Clock, MessageCircle, BookOpen, Languages, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { todayMinutes, currentStreak, completedPrompts, reviewedVocab, reviewedGrammar } = useProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">안녕! 👋</h1>
        <p className="text-muted-foreground mt-1">Ready to practice speaking Korean?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-streak" />
            <span className="text-sm font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold">{currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Today</span>
          </div>
          <p className="text-2xl font-bold">{todayMinutes} <span className="text-sm font-normal text-muted-foreground">min</span></p>
        </div>
      </div>

      {/* Quick practice CTA */}
      <Link
        to="/practice"
        className="block bg-primary text-primary-foreground rounded-xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">Start Speaking</p>
            <p className="text-primary-foreground/80 text-sm mt-0.5">Practice a conversation prompt</p>
          </div>
          <MessageCircle className="w-8 h-8 opacity-80" />
        </div>
      </Link>

      {/* Progress summary */}
      <div className="bg-surface-warm rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">Your Progress</h2>
        <div className="space-y-2">
          <ProgressRow
            icon={<MessageCircle className="w-4 h-4" />}
            label="Prompts practiced"
            count={completedPrompts.length}
            total={conversationPrompts.length}
          />
          <ProgressRow
            icon={<BookOpen className="w-4 h-4" />}
            label="Vocab reviewed"
            count={reviewedVocab.length}
            total={vocabulary.length}
          />
          <ProgressRow
            icon={<Languages className="w-4 h-4" />}
            label="Grammar points"
            count={reviewedGrammar.length}
            total={grammar.length}
          />
        </div>
      </div>

      {/* Topics */}
      <div>
        <h2 className="font-semibold mb-3">Topics</h2>
        <div className="space-y-2">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/practice?topic=${topic.id}`}
              className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">{topic.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{topic.title}</p>
                <p className="text-sm text-muted-foreground font-korean">{topic.titleKorean}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  icon,
  label,
  count,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span className="text-muted-foreground">{count}/{total}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
