# Quick Firebase Setup

## 🚀 Quick Steps

### 1. Get Firebase Config (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/Select your project
3. Click the **⚙️ Settings** icon → **Project settings**
4. Scroll to **Your apps** → Click **</>** (Web icon)
5. Register app → Copy the config values

### 2. Create Environment File

Create a file named `.env` in the root directory:

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# Or just create it manually in your editor
```

Paste this template and fill in your values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Enable Firebase Services (5 minutes)

#### Authentication
- Go to **Authentication** → **Get started**
- Enable **Email/Password**
- Enable **Google** (optional but recommended)

#### Firestore Database
- Go to **Firestore Database** → **Create database**
- Start in **test mode** (for development)
- Choose location → **Enable**

#### Storage (Optional)
- Go to **Storage** → **Get started**
- Start in **test mode** → **Done**

### 4. Set Firestore Rules

Go to **Firestore Database** → **Rules** → Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Note:** This is for development only! Update rules for production (see FIREBASE_SETUP.md)

### 5. Create Indexes (Optional but Recommended)

Go to **Firestore Database** → **Indexes** → **Create Index**:

**For Exchanges:**
- Collection: `exchanges`
- Fields: `status` (Asc), `type` (Asc), `createdAt` (Desc)

**For Rooms:**
- Collection: `rooms`  
- Fields: `status` (Asc), `createdAt` (Desc)

**For Conversations:**
- Collection: `conversations`
- Fields: `participants` (Array), `lastMessageAt` (Desc)

**For Messages:**
- Collection: `messages`
- Fields: `conversationId` (Asc), `createdAt` (Asc)

### 6. Test It!

```bash
npm run dev
```

1. Try signing up
2. Check Firebase Console → **Authentication** → Should see your user
3. Check **Firestore** → Should see a `users` document

## ✅ Done!

Your Firebase is now connected! For detailed setup and production configuration, see `FIREBASE_SETUP.md`.

## 🐛 Troubleshooting

**"Missing credentials"**
- Make sure `.env` file exists in root directory
- Restart dev server after creating `.env`
- Check that all variables start with `VITE_`

**"Permission denied"**
- Check Firestore rules are set correctly
- Make sure you're logged in

**"Index not found"**
- Create the indexes mentioned above
- Wait 2-3 minutes for them to build

