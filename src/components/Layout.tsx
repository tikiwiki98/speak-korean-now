import { Link, useLocation } from "react-router-dom";
import { BookOpen, Languages, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/vocabulary", icon: BookOpen, label: "Vocab" },
  { to: "/grammar", icon: Languages, label: "Grammar" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isInLesson = location.pathname.startsWith("/lesson");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 ${isInLesson ? "pb-6" : "pb-20"} max-w-lg mx-auto w-full px-4 pt-6`}>
        {children}
      </main>

      {!isInLesson && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
