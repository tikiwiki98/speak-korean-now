import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface UserProfile {
  name: string;
  koreanName: string;
  hasCompletedOnboarding: boolean;
}

interface UserContextType extends UserProfile {
  setProfile: (name: string, koreanName: string) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: "",
  koreanName: "",
  hasCompletedOnboarding: false,
};

const STORAGE_KEY = "korean-app-user";

const UserContext = createContext<UserContextType | undefined>(undefined);

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProfile;
    return JSON.parse(stored) as UserProfile;
  } catch {
    return defaultProfile;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setProfile = useCallback((name: string, koreanName: string) => {
    setProfileState({ name, koreanName, hasCompletedOnboarding: true });
  }, []);

  const resetProfile = useCallback(() => {
    setProfileState(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserContext.Provider value={{ ...profile, setProfile, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
