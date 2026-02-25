import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const { setProfile } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [koreanName, setKoreanName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    setProfile(name.trim(), koreanName.trim());
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <p className="text-4xl">🇰🇷</p>
              <h1 className="text-2xl font-bold">Welcome!</h1>
              <p className="text-muted-foreground">
                Let's learn Korean together. First, what's your name?
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
                placeholder="e.g. Josh"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
            </div>

            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <p className="text-4xl font-korean">안녕!</p>
              <h1 className="text-2xl font-bold">
                Nice to meet you, {name}!
              </h1>
              <p className="text-muted-foreground">
                Do you have a Korean name? If not, no worries — you can skip this or pick one later.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="koreanName" className="text-sm font-medium">
                Korean name <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="koreanName"
                type="text"
                value={koreanName}
                onChange={(e) => setKoreanName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. 민지"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-korean"
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to personalize your practice conversations.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all hover:opacity-90"
              >
                {koreanName.trim() ? "Let's go!" : "Skip & start learning"}
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
