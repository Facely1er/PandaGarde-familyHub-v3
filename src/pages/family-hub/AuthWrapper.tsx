import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserRole = 'parent' | 'child';

interface ProfileData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  age?: number;
  bio?: string;
}

interface AuthProfile {
  email?: string;
  profile_data: ProfileData;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { email?: string } | null;
  profile: AuthProfile | null;
  signInLocally: (overrides?: Partial<AuthProfile>) => void;
  signOutLocally: () => void;
  updateProfile: (updates: Partial<ProfileData>) => Promise<{ error: null }>;
}

const AUTH_STORAGE_KEY = 'pandagarde_local_auth_v1';
const PROFILE_STORAGE_KEY = 'pandagarde_local_profile_v1';

const defaultProfile: AuthProfile = {
  email: 'family@pandagarde.local',
  profile_data: {
    firstName: 'PandaGarde',
    lastName: 'Family',
    role: 'parent'
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') {return fallback;}
  const raw = window.localStorage.getItem(key);
  return raw === null ? fallback : raw === 'true';
};

const readProfile = (): AuthProfile => {
  if (typeof window === 'undefined') {return defaultProfile;}
  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {return defaultProfile;}
  try {
    const parsed = JSON.parse(raw) as Partial<AuthProfile>;
    return {
      email: parsed.email || defaultProfile.email,
      profile_data: {
        ...defaultProfile.profile_data,
        ...(parsed.profile_data || {})
      }
    };
  } catch {
    return defaultProfile;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => readBoolean(AUTH_STORAGE_KEY, true));
  const [profile, setProfile] = useState<AuthProfile>(() => readProfile());

  useEffect(() => {
    if (typeof window === 'undefined') {return;}
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') {return;}
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const signInLocally = (overrides?: Partial<AuthProfile>) => {
    setProfile((current) => ({
      email: overrides?.email || current.email || defaultProfile.email,
      profile_data: {
        ...current.profile_data,
        ...(overrides?.profile_data || {})
      }
    }));
    setIsAuthenticated(true);
  };

  const signOutLocally = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    setProfile((current) => ({
      ...current,
      profile_data: {
        ...current.profile_data,
        ...updates
      }
    }));
    return { error: null };
  };

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    user: isAuthenticated ? { email: profile.email } : null,
    profile,
    signInLocally,
    signOutLocally,
    updateProfile
  }), [isAuthenticated, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: true,
      user: { email: defaultProfile.email },
      profile: defaultProfile,
      signInLocally: () => undefined,
      signOutLocally: () => undefined,
      updateProfile: async () => ({ error: null })
    };
  }
  return context;
};

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
