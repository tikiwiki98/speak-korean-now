import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { conversationPrompts, topics, grammar } from "@/data/content";
import { useProgress } from "@/contexts/ProgressContext";
import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle2, Volume2 } from "lucide-react";

export default function ConversationPractice() {
  const [searchParams] = useSearchParams();
  const topicFilter = searchParams.get("topic");

  const filtered = topicFilter
    ? conversationPrompts.filter((p) => p.topicId === topicFilter)
    : conversationPrompts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const prompt = filtered[currentIndex];

  const topic = topics.find((t) => t.id === prompt?.topicId);

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No prompts available for this topic.</p>
        <Link to="/" className="text-primary mt-2 inline-block">← Back home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Conversation Practice</h1>
          {topic && (
            <p className="text-sm text-muted-foreground">{topic.emoji} {topic.title}</p>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{currentIndex + 1}/{filtered.length}</span>
      </div>

      <PromptCard
        prompt={prompt}
        onNext={() => setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1))}
        onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        hasNext={currentIndex < filtered.length - 1}
        hasPrev={currentIndex > 0}
      />
    </div>
  );
}

function PromptCard({
  prompt,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: {
  prompt: (typeof conversationPrompts)[0];
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const [showModel, setShowModel] = useState(false);
  const [showPhrases, setShowPhrases] = useState(true);
  const { markPromptComplete, completedPrompts } = useProgress();
  const isCompleted = completedPrompts.includes(prompt.id);
  const relatedGrammar = grammar.filter((g) => prompt.grammarIds.includes(g.id));

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h2 className="font-bold text-lg mb-2">{prompt.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{prompt.scenario}</p>
      </div>

      {/* What would you say? */}
      <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
        <p className="text-sm font-semibold text-primary mb-1">💬 What would you say?</p>
        <p className="text-sm text-muted-foreground">Try to say your answer out loud before looking at the hints.</p>
      </div>

      {/* Suggested phrases */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <button
          onClick={() => setShowPhrases(!showPhrases)}
          className="flex items-center gap-2 text-sm font-semibold w-full"
        >
          {showPhrases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Helpful phrases</span>
        </button>
        {showPhrases && (
          <div className="mt-3 space-y-2">
            {prompt.suggestedPhrases.map((phrase, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                <div className="flex-1 min-w-0">
                  <p className="text-korean font-korean text-lg">{phrase.korean}</p>
                  <p className="text-romanization text-sm">{phrase.romanization}</p>
                  <p className="text-sm text-muted-foreground">{phrase.english}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Model sentence */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <button
          onClick={() => setShowModel(!showModel)}
          className="flex items-center gap-2 text-sm font-semibold w-full"
        >
          {showModel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Model answer</span>
        </button>
        {showModel && (
          <div className="mt-3 bg-surface-warm rounded-lg p-4">
            <p className="text-korean font-korean text-xl leading-relaxed">{prompt.modelSentence.korean}</p>
            <p className="text-romanization text-sm mt-1">{prompt.modelSentence.romanization}</p>
            <p className="text-muted-foreground text-sm mt-1">{prompt.modelSentence.english}</p>
            <p className="text-xs text-primary mt-3 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Try saying this out loud!
            </p>
          </div>
        )}
      </div>

      {/* Related grammar */}
      {relatedGrammar.length > 0 && (
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm font-semibold mb-2">📝 Grammar used here</p>
          <div className="space-y-1">
            {relatedGrammar.map((g) => (
              <Link
                key={g.id}
                to={`/grammar?highlight=${g.id}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span className="font-korean">{g.korean}</span>
                <span className="text-muted-foreground">— {g.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="p-3 rounded-xl border border-border bg-card disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => markPromptComplete(prompt.id)}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
            isCompleted
              ? "bg-success text-primary-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? "Practiced ✓" : "I practiced this!"}
          </span>
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="p-3 rounded-xl border border-border bg-card disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
