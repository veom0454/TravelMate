import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export type UserRole = 'student' | 'provider';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  trustScore: number;
  completedExchanges: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: Date;
  bio?: string;
  university?: string;
  preferences?: {
    foodPreference?: string;
    sleepSchedule?: string;
    cleanliness?: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserProfile = async (uid: string, email: string, displayName: string, role: UserRole, photoURL?: string) => {
    const userProfile: UserProfile = {
      uid,
      email,
      displayName,
      role,
      photoURL,
      trustScore: 50,
      completedExchanges: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), {
      ...userProfile,
      createdAt: serverTimestamp()
    });

    setProfile(userProfile);
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await sendEmailVerification(user);
    await createUserProfile(user.uid, email, displayName, role);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (role: UserRole = 'student') => {
    const result = await signInWithPopup(auth, googleProvider);
    const docRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await createUserProfile(
        result.user.uid,
        result.user.email || '',
        result.user.displayName || '',
        role,
        result.user.photoURL || undefined
      );
    } else {
      setProfile(docSnap.data() as UserProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, data, { merge: true });

    if (profile) {
      setProfile({ ...profile, ...data });
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    resendVerificationEmail,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
