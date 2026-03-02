# 🔥 Quick Firebase Config Extraction

I can't automatically access your Firebase account, but here are **3 easy ways** to get your config:

## Method 1: Use the HTML Helper (Easiest! ⭐)

1. Open `get-firebase-config.html` in your browser
2. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → ⚙️ Settings → Your apps
3. Copy each value from the Firebase config into the form
4. Click "Generate .env File Content"
5. Copy the output and paste into your `.env` file

## Method 2: Browser Console Script (Automatic)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" section
5. If no web app exists, click `</>` to add one
6. Open browser console (Press `F12`)
7. Copy the entire content of `firebase-config-helper.js`
8. Paste it into the console and press Enter
9. It will automatically extract and copy your config!

## Method 3: Manual Copy (Traditional)

1. Go to Firebase Console → Your Project → ⚙️ Settings
2. Scroll to "Your apps" → Click on your web app (or create one)
3. Find the config object that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
4. Copy each value into your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## 📍 Where to Find Each Value

- **API Key**: Usually starts with `AIzaSy`
- **Auth Domain**: `your-project-id.firebaseapp.com`
- **Project ID**: Your Firebase project name/ID
- **Storage Bucket**: `your-project-id.appspot.com`
- **Messaging Sender ID**: A numeric ID
- **App ID**: Format like `1:123456789:web:abc123def456`

## ✅ After Getting Config

1. Create `.env` file in project root
2. Paste the config values
3. Restart dev server: `npm run dev`
4. Test by signing up - check Firebase Console to see if user appears!

---

**Tip:** Method 2 (console script) is fastest if you're already in Firebase Console! 🚀

