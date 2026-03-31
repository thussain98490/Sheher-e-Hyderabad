import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { AuthChangeEvent, User } from '@supabase/supabase-js';
import type { Profile } from '@/types';
import { createProfileIfMissing } from '@/db/api';

function getSupabaseInitError() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }

  try {
    new URL(supabaseUrl);
  } catch {
    return 'VITE_SUPABASE_URL is not a valid URL.';
  }

  return null;
}

const AUTH_TIMEOUT_MS = 8000;

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await withTimeout(
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    AUTH_TIMEOUT_MS,
    'Profile request timed out while checking your access.',
  );

  if (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
  return data;
}

async function getOrCreateProfile(user: User) {
  const existingProfile = await getProfile(user.id);
  if (existingProfile) {
    return existingProfile;
  }

  return createProfileIfMissing(user);
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    userType: 'tourist' | 'local'
  ) => Promise<{ error: Error | null; pendingConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseInitError = getSupabaseInitError();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(supabaseInitError);
  const userRef = useRef<User | null>(null);
  const profileRef = useRef<Profile | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      setProfileLoading(true);
      const profileData = await getProfile(user.id);
      setProfile(profileData ?? profileRef.current);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const setSafeState = (next: {
      user?: User | null;
      profile?: Profile | null;
      loading?: boolean;
      profileLoading?: boolean;
      authError?: string | null;
    }) => {
      if (!mounted) return;

      if ('user' in next) setUser(next.user ?? null);
      if ('profile' in next) setProfile(next.profile ?? null);
      if ('loading' in next) setLoading(next.loading ?? false);
      if ('profileLoading' in next) setProfileLoading(next.profileLoading ?? false);
      if ('authError' in next) setAuthError(next.authError ?? null);
    };

    const getReadableError = (stage: string, error: unknown) => {
      const details = error instanceof Error ? error.message : 'Unknown error';
      return `Authentication ${stage} failed. ${details}`;
    };

    const loadProfileForUser = async (sessionUser: User, options?: { preserveProfileOnError?: boolean }) => {
      setSafeState({ profileLoading: true });

      try {
        const profileData = await getOrCreateProfile(sessionUser);
        setSafeState({
          profile: profileData ?? profileRef.current,
          profileLoading: false,
        });
      } catch (error) {
        console.error('Failed to sync user profile:', error);
        setSafeState({
          profile: options?.preserveProfileOnError ? profileRef.current : null,
          profileLoading: false,
        });
      }
    };

    const syncSession = async (sessionUser: User | null, options?: { preserveProfileOnError?: boolean }) => {
      if (!sessionUser) {
        setSafeState({
          user: null,
          profile: null,
          authError: supabaseInitError,
          loading: false,
          profileLoading: false,
        });
        return;
      }

      setSafeState({
        user: sessionUser,
        authError: null,
        loading: false,
      });

      void loadProfileForUser(sessionUser, options);
    };

    const bootstrap = async () => {
      if (supabaseInitError) {
        setSafeState({
          user: null,
          profile: null,
          authError: supabaseInitError,
          loading: false,
          profileLoading: false,
        });
        return;
      }

      setSafeState({ loading: true });

      try {
        const {
          data: { session },
        } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS,
          'Session check timed out while checking your access.',
        );
        await syncSession(session?.user ?? null);
      } catch (error) {
        const message = getReadableError('startup', error);
        console.error('Failed to bootstrap auth session:', error);
        setSafeState({
          user: null,
          profile: null,
          authError: message,
          loading: false,
          profileLoading: false,
        });
      } finally {
        setSafeState({ loading: false });
      }
    };

    void bootstrap();

    if (supabaseInitError) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      const sessionUser = session?.user ?? null;
      const currentUser = userRef.current;
      const isSameUser = Boolean(sessionUser?.id && currentUser?.id && sessionUser.id === currentUser.id);
      const isBackgroundRefresh = event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION';

      if (isBackgroundRefresh && isSameUser && sessionUser) {
        setSafeState({
          user: sessionUser,
          loading: false,
        });
        void loadProfileForUser(sessionUser, { preserveProfileOnError: true });
        return;
      }

      setSafeState({ loading: true });

      try {
        await syncSession(sessionUser, {
          preserveProfileOnError: isSameUser,
        });
      } catch (error) {
        const message = getReadableError('state refresh', error);
        console.error('Failed during auth state change:', error);
        setSafeState({
          authError: message,
          loading: false,
          profileLoading: false,
        });
      } finally {
        setSafeState({ loading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const retryAuth = async () => {
    if (supabaseInitError) {
      setAuthError(supabaseInitError);
      setLoading(false);
      setProfileLoading(false);
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await withTimeout(
        supabase.auth.getSession(),
        AUTH_TIMEOUT_MS,
        'Session retry timed out while checking your access.',
      );

      setUser(session?.user ?? null);

      if (!session?.user) {
        setProfile(null);
        setAuthError(null);
        setProfileLoading(false);
        return;
      }

      setAuthError(null);
      try {
        setProfileLoading(true);
        const profileData = await getOrCreateProfile(session.user);
        setProfile(profileData ?? profileRef.current);
      } catch (error) {
        console.error('Retry auth profile lookup failed:', error);
      } finally {
        setProfileLoading(false);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Retry auth failed:', error);
      setUser(null);
      setProfile(null);
      setAuthError(`Authentication retry failed. ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (supabaseInitError) {
      return { error: new Error(supabaseInitError) };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: 'tourist' | 'local') => {
    if (supabaseInitError) {
      return { error: new Error(supabaseInitError), pendingConfirmation: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType,
          },
        },
      });

      if (error) throw error;
      const pendingConfirmation = !data.session && !!data.user;
      return { error: null, pendingConfirmation };
    } catch (error) {
      return { error: error as Error, pendingConfirmation: false };
    }
  };

  const signOut = async () => {
    if (supabaseInitError) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      setProfileLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setProfileLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, profileLoading, authError, signIn, signUp, signOut, refreshProfile, retryAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
