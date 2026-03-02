# Firebase Setup Guide

Follow these steps to connect your Firebase project to this application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Enable the following sign-in methods:
   - **Email/Password** (Enable)
   - **Google** (Enable - you'll need to configure OAuth consent screen)

### For Google Sign-In:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Select your Firebase project
- Go to **APIs & Services** > **OAuth consent screen**
- Configure the consent screen (choose "External" for testing)
- Add your email as a test user
- Go to **Credentials** > **Create Credentials** > **OAuth client ID**
- Choose "Web application"
- Add authorized redirect URIs: `http://localhost:8080` (and your production domain)
- Copy the Client ID

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

### Firestore Security Rules (Update these for production!)

Go to **Firestore Database** > **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Exchanges collection
    match /exchanges/{exchangeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Rooms collection
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.senderId || 
        request.auth.uid == resource.data.receiverId
      );
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
    }
  }
}
```

## Step 4: Enable Storage (Optional - for profile pictures)

1. Go to **Storage** > **Get started**
2. Start in test mode (for development)
3. Choose same location as Firestore

## Step 5: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have a web app, click **</>** (Web icon) to add one
4. Register your app with a nickname (e.g., "TravelMate Web")
5. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 7: Create Firestore Indexes

For better query performance, create these indexes in Firestore:

1. Go to **Firestore Database** > **Indexes**
2. Click **Create Index** and add:

**Index 1: Exchanges**
- Collection: `exchanges`
- Fields:
  - `status` (Ascending)
  - `type` (Ascending) 
  - `createdAt` (Descending)

**Index 2: Rooms**
- Collection: `rooms`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 3: Conversations**
- Collection: `conversations`
- Fields:
  - `participants` (Array)
  - `lastMessageAt` (Descending)

**Index 4: Messages**
- Collection: `messages`
- Fields:
  - `conversationId` (Ascending)
  - `createdAt` (Ascending)

## Step 8: Test Your Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up/create an account
3. Check Firebase Console to see if:
   - A new user appears in **Authentication** > **Users**
   - A user document is created in **Firestore** > **users** collection

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to **Authentication** > **Settings** > **Authorized domains**
- Add `localhost` if not already there
- Add your production domain when deploying

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're logged in
- Verify the rules match the structure above

### "Index not found"
- Create the indexes mentioned in Step 7
- Wait a few minutes for indexes to build

## Production Deployment

Before deploying to production:

1. Update Firestore security rules (remove test mode)
2. Add your production domain to authorized domains
3. Set up proper CORS rules if needed
4. Review and tighten security rules
5. Enable Firebase App Check for additional security

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

