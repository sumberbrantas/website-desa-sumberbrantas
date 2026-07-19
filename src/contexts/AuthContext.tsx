"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, getUserProfile, UserProfile, MOCK_USER, MOCK_PROFILE, useMockData } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isMockMode: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isMockMode: false,
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check mock mode
    const mockEnabled = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
    setIsMockMode(mockEnabled);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If mock mode, use mock user
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      setUser(MOCK_USER);
      setProfile(MOCK_PROFILE);
      setLoading(false);
      return;
    }

    // Real Firebase auth
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);

      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "",
              name: user.displayName || user.email?.split('@')[0] || "Pengguna",
              role: "pending",
              createdAt: new Date(),
            };

            try {
              const { setDoc, doc } = await import("firebase/firestore");
              const { db } = await import("@/lib/firebase");
              if (db) {
                await setDoc(doc(db, "users", user.uid), newProfile);
              }
            } catch (firestoreError) {
              console.error("Error saving new profile to Firestore:", firestoreError);
            }

            setProfile(newProfile);
          }
        } catch (error) {
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            name: user.displayName || user.email?.split('@')[0] || "Pengguna",
            role: "pending",
            createdAt: new Date(),
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {}
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user && !!profile,
    isMockMode,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
