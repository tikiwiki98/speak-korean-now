import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { grammar, topics } from "@/data/content";
import { useProgress } from "@/contexts/ProgressContext";
import { ChevronLeft, ChevronDown, ChevronUp, Check } from "lucide-react";

export default function GrammarView() {
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight");
  const { reviewedGrammar, markGrammarReviewed } = useProgress();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Grammar</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Bite-sized grammar points to help you speak correctly. Just enough to use in conversation — no heavy theory.
      </p>

      <div className="space-y-3">
        {grammar.map((point) => (
          <GrammarCard
            key={point.id}
            point={point}
            isHighlighted={highlight === point.id}
            isReviewed={reviewedGrammar.includes(point.id)}
            onReview={() => markGrammarReviewed(point.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GrammarCard({
  point,
  isHighlighted,
  isReviewed,
  onReview,
}: {
  point: (typeof grammar)[0];
  isHighlighted: boolean;
  isReviewed: boolean;
  onReview: () => void;
}) {
  const [expanded, setExpanded] = useState(isHighlighted);
  const topic = topics.find((t) => t.id === point.topicId);

  return (
    <div
      className={`bg-card rounded-xl border transition-colors ${
        isHighlighted ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-korean font-korean text-lg font-semibold">{point.korean}</span>
            {isReviewed && <Check className="w-4 h-4 text-success shrink-0" />}
          </div>
          <p className="text-sm font-medium mt-0.5">{point.title}</p>
          {topic && (
            <p className="text-xs text-muted-foreground mt-0.5">{topic.emoji} {topic.title}</p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{point.explanation}</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examples</p>
            {point.examples.map((ex, i) => (
              <div key={i} className="bg-surface-warm rounded-lg p-3">
                <p className="text-korean font-korean text-lg">{ex.korean}</p>
                <p className="text-romanization text-sm">{ex.romanization}</p>
                <p className="text-sm text-muted-foreground">{ex.english}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onReview}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isReviewed
                ? "bg-success/10 text-success"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isReviewed ? "Reviewed ✓" : "Mark as reviewed"}
          </button>
        </div>
      )}
    </div>
  );
}
