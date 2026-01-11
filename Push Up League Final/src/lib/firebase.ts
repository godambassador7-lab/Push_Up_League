import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCiyPRBwCM3S8j9kdp6TdZGpM9Cxk6a_cw",
  authDomain: "push-up-league.firebaseapp.com",
  projectId: "push-up-league",
  storageBucket: "push-up-league.firebasestorage.app",
  messagingSenderId: "373813383937",
  appId: "1:373813383937:web:53a180a36f245605458100",
  measurementId: "G-E0DLD0BJ9F"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, analytics };

// Auth Functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use the login page instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    }
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please register first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    }
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error: any) {
    let errorMessage = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by the browser. Please allow popups and try again.';
    }
    return { success: false, error: errorMessage };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore Functions
export interface FirestoreUser {
  userId: string;
  username: string;
  email: string;
  proficiency: string;
  maxPushupsInOneSet: number;
  accountCreatedAt: string;
  isWorldRecordCandidate: boolean;
  totalXp: number;
  coins: number;
  currentRank: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  personalBest: number;
  dailyGoal: number;
  streakFreezes: number;
}

export interface FirestoreWorkout {
  id: string;
  userId: string;
  date: string;
  pushups: number;
  sets?: number;
  xpEarned: number;
  coinsEarned?: number;
  goalCompleted?: boolean;
  streakMultiplier: number;
  challengeBonus: boolean;
  isLocked: boolean;
  lockedAt?: string;
  createdAt: Timestamp;
}

export interface FirestoreAchievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  unlockedAt: string;
  type: string;
}

// Create user profile in Firestore
export const createUserProfile = async (userId: string, userData: Partial<FirestoreUser>) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      userId,
      ...userData,
      accountCreatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<FirestoreUser>) => {
  try {
    const docRef = doc(db, 'users', userId);

    // Try updateDoc first
    try {
      await updateDoc(docRef, updates);
    } catch (updateError: any) {
      // If document doesn't exist, create it with setDoc and merge
      if (updateError.code === 'not-found') {
        console.log('Document not found, creating with setDoc...');
        await setDoc(docRef, updates, { merge: true });
      } else {
        throw updateError;
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Save workout
export const saveWorkout = async (workout: FirestoreWorkout) => {
  try {
    await setDoc(doc(db, 'workouts', workout.id), {
      ...workout,
      createdAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user workouts
export const getUserWorkouts = async (userId: string, limitCount: number = 100) => {
  try {
    const q = query(
      collection(db, 'workouts'),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const workouts: FirestoreWorkout[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreWorkout;
      if (data.userId === userId) {
        workouts.push(data);
      }
    });

    return workouts;
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

// Subscribe to user workouts (real-time)
export const subscribeToUserWorkouts = (userId: string, callback: (workouts: FirestoreWorkout[]) => void) => {
  const q = query(
    collection(db, 'workouts'),
    orderBy('date', 'desc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const workouts: FirestoreWorkout[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreWorkout;
      if (data.userId === userId) {
        workouts.push(data);
      }
    });
    callback(workouts);
  });
};

// Save achievement
export const saveAchievement = async (achievement: FirestoreAchievement) => {
  try {
    await setDoc(doc(db, 'achievements', achievement.id), achievement);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user achievements
export const getUserAchievements = async (userId: string) => {
  try {
    const q = query(collection(db, 'achievements'));
    const querySnapshot = await getDocs(q);
    const achievements: FirestoreAchievement[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreAchievement;
      if (data.userId === userId) {
        achievements.push(data);
      }
    });

    return achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Get leaderboard (standard)
export const getStandardLeaderboard = async (limitCount: number = 50) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('totalXp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaders: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.isWorldRecordCandidate) {
        leaders.push({
          rank: leaders.length + 1,
          username: data.username,
          totalXp: data.totalXp,
          currentStreak: data.currentStreak,
          currentRank: data.currentRank,
        });
      }
    });

    return leaders;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// Get world record leaderboard
export const getWorldRecordLeaderboard = async (limitCount: number = 50) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('totalXp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaders: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isWorldRecordCandidate) {
        leaders.push({
          rank: leaders.length + 1,
          username: data.username,
          totalXp: data.totalXp,
          currentStreak: data.currentStreak,
          currentRank: data.currentRank,
          isWorldRecord: true,
        });
      }
    });

    return leaders;
  } catch (error) {
    console.error('Error getting world record leaderboard:', error);
    return [];
  }
};
