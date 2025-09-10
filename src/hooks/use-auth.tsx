
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, displayName: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlowNetworkMessage, setShowSlowNetworkMessage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!user && !isPublicRoute) {
        router.push('/sign-in');
      }
      if (user && (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/')) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowSlowNetworkMessage(true);
      }, 3000); // Show message after 3 seconds
    } else {
      setShowSlowNetworkMessage(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const sendPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    sendPasswordReset,
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
            <div className='flex items-center gap-4'>
                <AppLogo className="h-12 w-12 text-primary animate-pulse" />
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <p className="mt-6 text-lg font-semibold">Loading LearnFlowAI...</p>
            <div className="h-8 mt-2">
              {showSlowNetworkMessage && (
                  <p className="text-sm text-muted-foreground animate-in fade-in">
                      A slow network connection may cause a delay. The app works offline after the first load.
                  </p>
              )}
            </div>
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
