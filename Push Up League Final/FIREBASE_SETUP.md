# Firebase Setup Guide

## Current Issue
The login is showing but Firebase Firestore permissions are blocking access. You need to update the security rules in Firebase Console.

## Quick Fix - Copy These Rules to Firebase Console

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/

### Step 2: Select Your Project
Click on **"push-up-league"**

### Step 3: Navigate to Firestore Rules
1. Click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab at the top

### Step 4: Replace the Rules
Copy and paste these rules:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - Anyone can read, only authenticated can write
    match /users/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    // Workouts collection - Anyone can read and write (supports guest mode)
    match /workouts/{workoutId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null
        ? resource.data.userId == request.auth.uid
        : true;
      allow delete: if false;
    }

    // Achievements collection - Anyone can read and create
    match /achievements/{achievementId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }

    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 5: Publish
Click the **"Publish"** button to save changes

### Step 6: Test
1. Wait 1-2 minutes for rules to propagate
2. Refresh your app
3. Try logging in OR click "Skip for now" to use guest mode
