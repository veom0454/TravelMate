# 🚀 Deploy TravelMate to Vercel - Manual Guide

This guide will walk you through deploying your TravelMate app to Vercel manually.

## Prerequisites

- GitHub account with your TravelMate repository
- Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- Firebase project configured

## Step 1: Prepare Your Repository

Make sure all your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub** to connect your GitHub account
4. Authorize Vercel to access your repositories

## Step 3: Import Your Project

1. In Vercel dashboard, click **Add New...** → **Project**
2. Find and select your repository: **Aditya060806/TravelMate**
3. Click **Import**

## Step 4: Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

### Framework Preset
- **Framework Preset**: Vite (should be auto-detected)

### Build Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)
- **Install Command**: `npm install` (default)
- **Root Directory**: `./` (default)

### Environment Variables

**⚠️ IMPORTANT**: Add all your Firebase environment variables:

Click **Environment Variables** and add:

```
VITE_FIREBASE_API_KEY=AIzaSyDzm-0h5RVUyIZSail9z75dUmeTC7amjBQ
VITE_FIREBASE_AUTH_DOMAIN=travelmate-caebd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=travelmate-caebd
VITE_FIREBASE_STORAGE_BUCKET=travelmate-caebd.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=101492517698
VITE_FIREBASE_APP_ID=1:101492517698:web:36a6fb2a7e4bac775036db
```

**For each variable:**
1. Click **Add**
2. Enter the **Name** (e.g., `VITE_FIREBASE_API_KEY`)
3. Enter the **Value** (your actual Firebase config value)
4. Select environments: **Production**, **Preview**, and **Development**
5. Click **Save**

Repeat for all 6 Firebase variables.

## Step 5: Update Firebase Authorized Domains

Before deploying, add your Vercel domain to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **travelmate-caebd**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain (you'll get this after deployment, e.g., `your-app.vercel.app`)
5. Also add your custom domain if you have one

## Step 6: Deploy

1. Review all settings
2. Click **Deploy**
3. Wait for the build to complete (usually 1-2 minutes)
4. You'll see a success message with your deployment URL

## Step 7: Verify Deployment

1. Click on your deployment to view details
2. Click **Visit** to open your live app
3. Test the following:
   - ✅ Homepage loads
   - ✅ Sign up/Sign in works
   - ✅ Firebase connection works
   - ✅ All pages load correctly

## Step 8: Update Firebase Authorized Domains (Again)

After deployment, you'll get your Vercel URL. Add it to Firebase:

1. Copy your Vercel URL (e.g., `travelmate-xyz.vercel.app`)
2. Go to Firebase Console → Authentication → Settings → Authorized domains
3. Click **Add domain**
4. Enter your Vercel domain
5. Click **Add**

## Custom Domain (Optional)

To add a custom domain:

1. In Vercel dashboard, go to your project → **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's DNS configuration instructions
4. Update Firebase authorized domains with your custom domain

## Environment Variables for Different Environments

You can set different values for:
- **Production**: Your live site
- **Preview**: Preview deployments (PR previews)
- **Development**: Local development (not used in Vercel)

For now, use the same values for all environments.

## Troubleshooting

### Build Fails

**Error: Module not found**
- Make sure all dependencies are in `package.json`
- Check that `npm install` completes successfully

**Error: Environment variables missing**
- Verify all `VITE_*` variables are added in Vercel
- Make sure they're enabled for the correct environments

### Firebase Not Working

**Error: Firebase not configured**
- Check environment variables are set correctly
- Verify variable names start with `VITE_`
- Redeploy after adding variables

**Error: Unauthorized domain**
- Add your Vercel domain to Firebase authorized domains
- Wait a few minutes for changes to propagate

### Routing Issues (404 on refresh)

The `vercel.json` file includes rewrites to handle React Router. If you see 404s:
- Verify `vercel.json` is in your repository
- Check that rewrites are configured correctly

## Automatic Deployments

After the first deployment:
- **Every push to `main`** → Deploys to production
- **Pull requests** → Creates preview deployments
- **Other branches** → Creates preview deployments

## Monitoring

- View deployment logs in Vercel dashboard
- Check build status and errors
- Monitor performance in Vercel Analytics (if enabled)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all features
3. ✅ Set up custom domain (optional)
4. ✅ Configure Firebase for production
5. ✅ Update Firestore security rules for production
6. ✅ Enable Firebase App Check (optional, for security)

---

**Your app will be live at**: `https://your-project-name.vercel.app`

🎉 Congratulations! Your TravelMate app is now deployed!

