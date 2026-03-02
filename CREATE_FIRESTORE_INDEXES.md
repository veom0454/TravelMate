# 🔥 Create Firestore Indexes

Firestore requires composite indexes for certain queries. Here's how to create them:

## Quick Method: Use the Error Link

When you see an index error in the console, **click the link** in the error message. It will take you directly to the Firebase Console to create the index automatically!

Example error link format:
```
https://console.firebase.google.com/v1/r/project/travelmate-caebd/firestore/indexes/...
```

Just click it and Firebase will create the index for you! ⚡

## Manual Method: Create Indexes in Console

If you prefer to create them manually:

### 1. Go to Firestore Console
- [Firebase Console](https://console.firebase.google.com/)
- Select your project: **travelmate-caebd**
- Go to **Firestore Database** → **Indexes** tab

### 2. Create These Indexes

#### Index 1: Conversations (for user conversations list)
- **Collection ID**: `conversations`
- **Fields to index**:
  - `participants` → Array
  - `lastMessageAt` → Descending
- Click **Create**

#### Index 2: Messages (for conversation messages)
- **Collection ID**: `messages`
- **Fields to index**:
  - `conversationId` → Ascending
  - `createdAt` → Ascending
- Click **Create**

#### Index 3: Exchanges (for exchange listings)
- **Collection ID**: `exchanges`
- **Fields to index**:
  - `status` → Ascending
  - `type` → Ascending
  - `createdAt` → Descending
- Click **Create**

#### Index 4: Rooms (for room listings)
- **Collection ID**: `rooms`
- **Fields to index**:
  - `status` → Ascending
  - `createdAt` → Descending
- Click **Create**

## ⏱️ Index Building Time

After creating indexes, they typically build in **2-5 minutes**. You'll see a status:
- ⏳ **Building** - Wait for it to complete
- ✅ **Enabled** - Ready to use!

## ✅ Verify Indexes

Once indexes are built, the errors will disappear and queries will work faster!

## 💡 Note

The app has been updated to work **without indexes** (using client-side sorting), but indexes make queries much faster and more efficient. It's recommended to create them!

---

**Tip**: The easiest way is to just click the link in the error message! 🚀

