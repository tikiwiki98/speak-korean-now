import { useState, useMemo, useEffect } from "react";
import { getVocabForTopic, vocabulary, type VocabItem } from "@/data/content";
import { Check, X } from "lucide-react";

interface QuizPhaseProps {
  topicId: string;
  onComplete: (score: number) => void;
}

type QuizQuestion =
  | { type: "mc-korean-to-english"; vocab: VocabItem; options: string[]; correctIndex: number }
  | { type: "mc-english-to-korean"; vocab: VocabItem; options: string[]; correctIndex: number }
  | { type: "fill-in-blank"; vocab: VocabItem; blanked: string; answer: string; english: string; options: string[]; correctIndex: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(topicId: string): QuizQuestion[] {
  const topicVocab = getVocabForTopic(topicId);
  const otherVocab = vocabulary.filter((v) => v.topicId !== topicId);
  const questions: QuizQuestion[] = [];
  const shuffled = shuffle(topicVocab);

  // 4 MC Korean → English (exposure 3)
  for (let i = 0; i < Math.min(4, shuffled.length); i++) {
    const correct = shuffled[i];
    const distractors = shuffle(
      [...otherVocab, ...topicVocab.filter((v) => v.id !== correct.id)]
    )
      .slice(0, 3)
      .map((v) => v.english);
    const options = shuffle([correct.english, ...distractors]);
    questions.push({
      type: "mc-korean-to-english",
      vocab: correct,
      options,
      correctIndex: options.indexOf(correct.english),
    });
  }

  // 3 MC English → Korean (exposure 4)
  for (let i = 4; i < Math.min(7, shuffled.length); i++) {
    const correct = shuffled[i];
    const distractors = shuffle(
      [...otherVocab, ...topicVocab.filter((v) => v.id !== correct.id)]
    )
      .slice(0, 3)
      .map((v) => v.korean);
    const options = shuffle([correct.korean, ...distractors]);
    questions.push({
      type: "mc-english-to-korean",
      vocab: correct,
      options,
      correctIndex: options.indexOf(correct.korean),
    });
  }

  // 3 fill-in-blank as word-bank MC (exposure 5-6)
  const fillVocab = shuffle(topicVocab).slice(0, 3);
  for (const v of fillVocab) {
    const distractors = shuffle(
      [...otherVocab, ...topicVocab.filter((w) => w.id !== v.id)]
    )
      .slice(0, 3)
      .map((w) => w.korean);
    const options = shuffle([v.exampleSentence.blankAnswer, ...distractors]);
    questions.push({
      type: "fill-in-blank",
      vocab: v,
      blanked: v.exampleSentence.blanked,
      answer: v.exampleSentence.blankAnswer,
      english: v.exampleSentence.english,
      options,
      correctIndex: options.indexOf(v.exampleSentence.blankAnswer),
    });
  }

  return questions;
}

export default function QuizPhase({ topicId, onComplete }: QuizPhaseProps) {
  const questions = useMemo(() => generateQuestions(topicId), [topicId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const total = questions.length;
  const question = questions[currentIndex];

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex >= total - 1) {
      onComplete(Math.round((score / total) * 100));
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  if (!question) return null;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Quiz</span>
          <span className="text-muted-foreground">
            {currentIndex + 1}/{total}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {question.type === "mc-korean-to-english" && (
        <MCQuestion
          prompt={question.vocab.korean}
          promptLabel="What does this mean?"
          options={question.options}
          correctIndex={question.correctIndex}
          answered={answered}
          onAnswer={handleAnswer}
          isKoreanPrompt
        />
      )}

      {question.type === "mc-english-to-korean" && (
        <MCQuestion
          prompt={question.vocab.english}
          promptLabel="Choose the Korean word"
          options={question.options}
          correctIndex={question.correctIndex}
          answered={answered}
          onAnswer={handleAnswer}
          isKoreanOptions
        />
      )}

      {question.type === "fill-in-blank" && (
        <FillInBlank
          blanked={question.blanked}
          answer={question.answer}
          english={question.english}
          options={question.options}
          correctIndex={question.correctIndex}
          answered={answered}
          onAnswer={handleAnswer}
        />
      )}

      {/* Feedback & Next */}
      {answered && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={`rounded-xl p-4 flex items-center gap-3 ${
              isCorrect
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isCorrect ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : (
              <X className="w-5 h-5 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {isCorrect ? "Correct!" : "Not quite"}
              </p>
              {!isCorrect && question.type !== "fill-in-blank" && (
                <p className="text-sm mt-0.5">
                  The answer is{" "}
                  <span className="font-semibold font-korean">
                    {question.options[question.correctIndex]}
                  </span>
                </p>
              )}
              {!isCorrect && question.type === "fill-in-blank" && (
                <p className="text-sm mt-0.5">
                  The answer is{" "}
                  <span className="font-semibold font-korean">{question.answer}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90"
          >
            {currentIndex >= total - 1 ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Multiple Choice ───

function MCQuestion({
  prompt,
  promptLabel,
  options,
  correctIndex,
  answered,
  onAnswer,
  isKoreanPrompt,
  isKoreanOptions,
}: {
  prompt: string;
  promptLabel: string;
  options: string[];
  correctIndex: number;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
  isKoreanPrompt?: boolean;
  isKoreanOptions?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [prompt]);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    onAnswer(index === correctIndex);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-5 border border-border text-center">
        <p className="text-xs text-muted-foreground mb-2">{promptLabel}</p>
        <p
          className={`text-2xl font-semibold ${
            isKoreanPrompt ? "text-korean font-korean" : ""
          }`}
        >
          {prompt}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option, i) => {
          let style = "border-border hover:border-primary/30";
          if (answered) {
            if (i === correctIndex) style = "border-success bg-success/5";
            else if (i === selected && i !== correctIndex)
              style = "border-destructive bg-destructive/5";
            else style = "border-border opacity-50";
          } else if (i === selected) {
            style = "border-primary bg-primary/5";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${style} ${
                isKoreanOptions ? "font-korean" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    answered && i === correctIndex
                      ? "border-success text-success"
                      : answered && i === selected
                        ? "border-destructive text-destructive"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`text-sm ${isKoreanOptions ? "text-lg" : ""}`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Fill in the Blank (Word Bank) ───

function FillInBlank({
  blanked,
  answer,
  english,
  options,
  correctIndex,
  answered,
  onAnswer,
}: {
  blanked: string;
  answer: string;
  english: string;
  options: string[];
  correctIndex: number;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [blanked]);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    onAnswer(index === correctIndex);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-5 border border-border text-center">
        <p className="text-xs text-muted-foreground mb-2">Fill in the blank</p>
        <p className="text-korean font-korean text-xl leading-relaxed">{blanked}</p>
        <p className="text-sm text-muted-foreground mt-2">{english}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option, i) => {
          let style = "border-border hover:border-primary/30";
          if (answered) {
            if (i === correctIndex) style = "border-success bg-success/5";
            else if (i === selected && i !== correctIndex)
              style = "border-destructive bg-destructive/5";
            else style = "border-border opacity-50";
          } else if (i === selected) {
            style = "border-primary bg-primary/5";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`px-4 py-3 rounded-xl border transition-all text-center font-korean text-lg ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
