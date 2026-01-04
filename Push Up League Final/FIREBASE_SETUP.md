# Firebase Setup Guide for Push-Up League

## ✅ Completed Setup

Your Firebase app is already configured! Here's what has been integrated:

### Firebase Configuration
- **Project ID**: push-up-league
- **Auth Domain**: push-up-league.firebaseapp.com
- **App ID**: 1:373813383937:web:53a180a36f245605458100

## 🔥 Firebase Console Setup

### Step 1: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **push-up-league**
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started**
5. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### Step 2: Create Firestore Database

1. In Firebase Console, navigate to **Firestore Database**
2. Click **Create Database**
3. Select **Start in test mode** (we'll secure it later)
4. Choose your preferred location (e.g., us-central1)
5. Click **Enable**

### Step 3: Set Up Firestore Security Rules

Once Firestore is created, go to the **Rules** tab and replace with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles for leaderboards
      allow read: if true;

      // Only the user can create/update their own profile
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if false; // Prevent deletion
    }

    // Workouts collection
    match /workouts/{workoutId} {
      // Users can read their own workouts
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;

      // Users can create workouts
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;

      // Users can update only if not locked
      allow update: if isAuthenticated()
                    && resource.data.userId == request.auth.uid
                    && resource.data.isLocked == false;

      // Prevent deletion
      allow delete: if false;
    }

    // Achievements collection
    match /achievements/{achievementId} {
      // Users can read their own achievements
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;

      // Users can create achievements
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;

      // Prevent updates and deletion
      allow update, delete: if false;
    }
  }
}
```

### Step 4: Create Firestore Indexes

For efficient leaderboard queries, create these composite indexes:

1. Go to **Firestore Database** → **Indexes** tab
2. Click **Create Index**

**Index 1: Standard Leaderboard**
- Collection ID: `users`
- Fields:
  - `isWorldRecordCandidate` (Ascending)
  - `totalXp` (Descending)
- Query scope: Collection

**Index 2: World Record Leaderboard**
- Collection ID: `users`
- Fields:
  - `isWorldRecordCandidate` (Ascending)
  - `totalXp` (Descending)
- Query scope: Collection

**Index 3: User Workouts**
- Collection ID: `workouts`
- Fields:
  - `userId` (Ascending)
  - `date` (Descending)
- Query scope: Collection

## 📁 Firestore Database Structure

### Collections

#### `users/{userId}`
```javascript
{
  userId: string,
  username: string,
  email: string,
  proficiency: string, // 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'world-class'
  maxPushupsInOneSet: number,
  accountCreatedAt: string, // ISO timestamp
  isWorldRecordCandidate: boolean,
  totalXp: number,
  coins: number,
  currentRank: number,
  currentStreak: number,
  longestStreak: number,
  lastWorkoutDate: string | null, // YYYY-MM-DD
  personalBest: number,
  dailyGoal: number,
  streakFreezes: number
}
```

#### `workouts/{workoutId}`
```javascript
{
  id: string,
  userId: string, // Reference to user
  date: string, // YYYY-MM-DD
  pushups: number,
  sets: number | undefined,
  xpEarned: number,
  streakMultiplier: number,
  challengeBonus: boolean,
  isLocked: boolean,
  lockedAt: string | undefined, // ISO timestamp
  createdAt: Timestamp
}
```

#### `achievements/{achievementId}`
```javascript
{
  id: string,
  userId: string, // Reference to user
  title: string,
  description: string,
  unlockedAt: string, // ISO timestamp
  type: string // 'streak' | 'volume' | 'rank' | 'consistency'
}
```

## 🚀 Usage in the App

### Authentication Flow

```typescript
// Register new user
import { OnboardingWithAuth } from '@/components/OnboardingWithAuth';

// Login existing user
import { Login } from '@/components/Login';
```

### Syncing Data

The app automatically syncs data to Firebase when users:
- Create an account (OnboardingWithAuth)
- Log workouts (saves to Firestore)
- Unlock achievements (saves to Firestore)
- Update profile stats (auto-synced)

### Real-time Features

To enable real-time leaderboard updates, use the subscribe functions:

```typescript
import { subscribeToUserWorkouts } from '@/lib/firebase';

// Subscribe to workout changes
const unsubscribe = subscribeToUserWorkouts(userId, (workouts) => {
  console.log('Workouts updated:', workouts);
});

// Cleanup
unsubscribe();
```

## 🔐 Security Best Practices

1. **Never expose API keys in client code** - They're already in your config, which is fine for web apps
2. **Use Firestore Security Rules** - Already configured above
3. **Validate data server-side** - Consider adding Cloud Functions for integrity checks
4. **Rate limiting** - Firebase has built-in rate limiting for auth

## 🌐 Optional: Cloud Functions

For advanced integrity checks and Guinness notifications, create Cloud Functions:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions
firebase init functions
```

Example Cloud Function for world record detection:

```javascript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const checkWorldRecord = functions.firestore
  .document('workouts/{workoutId}')
  .onCreate(async (snap, context) => {
    const workout = snap.data();

    if (workout.pushups > 46001) { // World record threshold
      // Send notification
      console.log(`🚨 WORLD RECORD ALERT: User ${workout.userId} logged ${workout.pushups} push-ups`);

      // Could send email, SMS, or log to separate collection
      await admin.firestore().collection('worldRecordAlerts').add({
        userId: workout.userId,
        pushups: workout.pushups,
        date: workout.date,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
```

## 📊 Monitoring

1. **Firebase Console → Analytics** - Track user engagement
2. **Firebase Console → Crashlytics** - Monitor app crashes
3. **Firebase Console → Performance** - Monitor app performance

## 🎯 Testing

Before going live, test with these accounts:

1. Create a test user via OnboardingWithAuth
2. Log some workouts
3. Check Firestore to verify data is saving
4. Test leaderboard queries
5. Test day locking functionality

## 🔄 Migration from Local Storage

To migrate existing users from localStorage to Firebase:

1. User creates Firebase account
2. On first login, check for localStorage data
3. If exists, upload to Firestore
4. Clear localStorage after successful upload

## ✅ Checklist

- [ ] Enable Email/Password authentication in Firebase Console
- [ ] Create Firestore database
- [ ] Set up security rules
- [ ] Create composite indexes
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Verify data syncing
- [ ] Test leaderboards
- [ ] Optional: Set up Cloud Functions
- [ ] Optional: Enable Analytics

## 🆘 Troubleshooting

**"Permission denied" errors**
- Check Firestore security rules are deployed
- Verify user is authenticated
- Ensure userId matches auth.uid

**"Index required" errors**
- Go to the error link provided
- Click "Create Index"
- Wait a few minutes for index to build

**Authentication errors**
- Verify Email/Password is enabled in Firebase Console
- Check password is at least 6 characters
- Ensure email format is valid

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

---

**Need help?** Contact the development team or check the Firebase Console for detailed error logs.
