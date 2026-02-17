import { useState } from "react";
import { vocabulary, topics } from "@/data/content";
import { useProgress } from "@/contexts/ProgressContext";
import { ChevronLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function VocabView() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { reviewedVocab, markVocabReviewed } = useProgress();

  const filtered = selectedTopic
    ? vocabulary.filter((v) => v.topicId === selectedTopic)
    : vocabulary;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Vocabulary</h1>
      </div>

      {/* Topic filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedTopic
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTopic === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.emoji} {t.title}
          </button>
        ))}
      </div>

      {/* Vocab cards */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const isReviewed = reviewedVocab.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => markVocabReviewed(item.id)}
              className={`w-full text-left bg-card rounded-xl p-4 border transition-colors ${
                isReviewed ? "border-success/30" : "border-border hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-korean font-korean text-xl">{item.korean}</p>
                  <p className="text-romanization text-sm mt-0.5">{item.romanization}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.english}</p>
                </div>
                {isReviewed && (
                  <Check className="w-4 h-4 text-success shrink-0 mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
