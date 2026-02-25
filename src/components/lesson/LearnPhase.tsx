import { useState } from "react";
import { getVocabForTopic, getGrammarForTopic, type VocabItem } from "@/data/content";
import { ChevronLeft, ChevronRight, Eye, RotateCcw } from "lucide-react";

interface LearnPhaseProps {
  topicId: string;
  onComplete: () => void;
}

export default function LearnPhase({ topicId, onComplete }: LearnPhaseProps) {
  const vocab = getVocabForTopic(topicId);
  const grammarPoints = getGrammarForTopic(topicId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));

  const totalCards = vocab.length;
  const current = vocab[currentIndex];
  const allViewed = viewedCards.size === totalCards;

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
    setViewedCards((prev) => new Set([...prev, index]));
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Learn the words</span>
          <span className="text-muted-foreground">
            {viewedCards.size}/{totalCards}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(viewedCards.size / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <FlashCard
        item={current}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        index={currentIndex}
        total={totalCards}
      />

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl border border-border bg-card disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            if (!isFlipped) {
              setIsFlipped(true);
            } else if (currentIndex < totalCards - 1) {
              goTo(currentIndex + 1);
            }
          }}
          className="flex-1 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
        >
          {!isFlipped ? (
            <span className="flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" /> Tap to reveal
            </span>
          ) : currentIndex < totalCards - 1 ? (
            "Next word"
          ) : (
            "Done reviewing"
          )}
        </button>

        <button
          onClick={() => goTo(Math.min(totalCards - 1, currentIndex + 1))}
          disabled={currentIndex === totalCards - 1}
          className="p-3 rounded-xl border border-border bg-card disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {vocab.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? "bg-primary w-4"
                : viewedCards.has(i)
                  ? "bg-primary/40"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Grammar tip */}
      {grammarPoints.length > 0 && currentIndex === totalCards - 1 && isFlipped && (
        <div className="bg-surface-warm rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold">Grammar tips for this topic</p>
          {grammarPoints.map((g) => (
            <div key={g.id} className="space-y-1">
              <p className="text-sm">
                <span className="font-korean font-semibold">{g.korean}</span>
                {" — "}
                {g.title}
              </p>
              <p className="text-xs text-muted-foreground">{g.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Complete button */}
      {allViewed && (
        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90"
        >
          I've learned these — start the quiz!
        </button>
      )}
    </div>
  );
}

function FlashCard({
  item,
  isFlipped,
  onFlip,
  index,
  total,
}: {
  item: VocabItem;
  isFlipped: boolean;
  onFlip: () => void;
  index: number;
  total: number;
}) {
  return (
    <button
      onClick={onFlip}
      className="w-full text-left bg-card rounded-2xl border border-border p-6 min-h-[220px] flex flex-col justify-center transition-all hover:border-primary/20 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-muted-foreground font-medium">
          {index + 1} of {total}
        </span>
        {!isFlipped && (
          <span className="text-xs text-primary flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Tap to flip
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center text-center space-y-3">
        <p className="text-korean font-korean text-3xl font-semibold leading-relaxed">
          {item.korean}
        </p>
        <p className="text-romanization text-sm">{item.romanization}</p>

        {isFlipped && (
          <div className="space-y-3 pt-2 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-lg font-medium">{item.english}</p>
            <div className="bg-surface-warm rounded-lg p-3 text-left">
              <p className="text-korean font-korean text-sm">{item.exampleSentence.korean}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.exampleSentence.english}</p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
