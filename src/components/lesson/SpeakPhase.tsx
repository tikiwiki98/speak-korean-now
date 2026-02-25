import { useState, useRef, useEffect } from "react";
import { getPromptsForTopic, type ConversationPrompt } from "@/data/content";
import { useUser } from "@/contexts/UserContext";
import { Mic, Square, Play, Pause, RotateCcw, Eye, EyeOff, ChevronRight } from "lucide-react";

interface SpeakPhaseProps {
  topicId: string;
  onComplete: () => void;
}

export default function SpeakPhase({ topicId, onComplete }: SpeakPhaseProps) {
  const prompts = getPromptsForTopic(topicId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedPrompts, setCompletedPrompts] = useState<Set<number>>(new Set());

  const prompt = prompts[currentIndex];
  const allDone = completedPrompts.size === prompts.length;

  if (!prompt) return null;

  const handlePromptDone = () => {
    setCompletedPrompts((prev) => new Set([...prev, currentIndex]));
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Speaking practice</span>
          <span className="text-muted-foreground">
            {currentIndex + 1}/{prompts.length}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((completedPrompts.size) / prompts.length) * 100}%` }}
          />
        </div>
      </div>

      <SpeakCard prompt={prompt} onDone={handlePromptDone} />

      {allDone && (
        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90"
        >
          Finish lesson
        </button>
      )}
    </div>
  );
}

function SpeakCard({
  prompt,
  onDone,
}: {
  prompt: ConversationPrompt;
  onDone: () => void;
}) {
  const { name, koreanName } = useUser();
  const [showPhrases, setShowPhrases] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Reset state when prompt changes
  useEffect(() => {
    setShowPhrases(false);
    setShowModel(false);
    setHasRecorded(false);
  }, [prompt.id]);

  const personalizedScenario = prompt.scenario
    .replace(/your name/gi, koreanName || name || "your name");

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h2 className="font-bold text-lg mb-2">{prompt.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{personalizedScenario}</p>
      </div>

      {/* Prompt */}
      <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 text-center">
        <p className="text-sm font-semibold text-primary mb-1">
          What would you say?
        </p>
        <p className="text-xs text-muted-foreground">
          Record yourself speaking, then compare with the model answer.
        </p>
      </div>

      {/* Recorder */}
      <AudioRecorder onRecordingComplete={() => setHasRecorded(true)} />

      {/* Helpful phrases (collapsible) */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowPhrases(!showPhrases)}
          className="w-full flex items-center gap-2 text-sm font-semibold p-4"
        >
          {showPhrases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Helpful phrases</span>
        </button>
        {showPhrases && (
          <div className="px-4 pb-4 space-y-2 animate-in fade-in duration-200">
            {prompt.suggestedPhrases.map((phrase, i) => (
              <div key={i} className="py-1.5">
                <p className="text-korean font-korean text-lg">{phrase.korean}</p>
                <p className="text-romanization text-sm">{phrase.romanization}</p>
                <p className="text-sm text-muted-foreground">{phrase.english}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Model answer (collapsible) */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowModel(!showModel)}
          className="w-full flex items-center gap-2 text-sm font-semibold p-4"
        >
          {showModel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Model answer</span>
        </button>
        {showModel && (
          <div className="px-4 pb-4 animate-in fade-in duration-200">
            <div className="bg-surface-warm rounded-lg p-4">
              <p className="text-korean font-korean text-xl leading-relaxed">
                {prompt.modelSentence.korean}
              </p>
              <p className="text-romanization text-sm mt-1">
                {prompt.modelSentence.romanization}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {prompt.modelSentence.english}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Done button */}
      {hasRecorded && (
        <button
          onClick={onDone}
          className="w-full py-3 rounded-xl bg-success text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <span>Done with this prompt</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Audio Recorder ───

function AudioRecorder({
  onRecordingComplete,
}: {
  onRecordingComplete: () => void;
}) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        setState("recorded");
        onRecordingComplete();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setError("Couldn't access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  };

  const playAudio = () => {
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const reRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setDuration(0);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (error) {
    return (
      <div className="bg-destructive/10 rounded-xl p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => setError(null)}
          className="text-sm text-primary mt-2 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      {state === "idle" && (
        <button
          onClick={startRecording}
          className="w-full flex flex-col items-center gap-3 py-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <Mic className="w-7 h-7 text-primary-foreground" />
          </div>
          <p className="text-sm font-medium">Tap to record</p>
        </button>
      )}

      {state === "recording" && (
        <button
          onClick={stopRecording}
          className="w-full flex flex-col items-center gap-3 py-4"
        >
          <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center animate-pulse-soft">
            <Square className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <p className="text-sm font-medium text-destructive">
            Recording... {formatTime(duration)}
          </p>
          <p className="text-xs text-muted-foreground">Tap to stop</p>
        </button>
      )}

      {state === "recorded" && (
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? pauseAudio : playAudio}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Your recording</p>
            <p className="text-xs text-muted-foreground">{formatTime(duration)}</p>
          </div>
          <button
            onClick={reRecord}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Re-record"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
