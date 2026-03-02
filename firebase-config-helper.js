/**
 * Firebase Config Helper Script
 * 
 * INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project
 * 3. Click the gear icon (⚙️) → Project settings
 * 4. Scroll to "Your apps" section
 * 5. If you don't have a web app, click the </> icon to add one
 * 6. Open browser console (F12)
 * 7. Copy and paste this entire script into the console
 * 8. It will extract your Firebase config automatically
 */

(function() {
  console.log('🔍 Looking for Firebase config...');
  
  // Try to find config in the page
  const scripts = document.querySelectorAll('script');
  let config = null;
  
  scripts.forEach(script => {
    const content = script.textContent || script.innerHTML;
    // Look for firebaseConfig pattern
    const match = content.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
    if (match) {
      try {
        config = JSON.parse(match[1]);
      } catch (e) {
        // Try to extract manually
        const apiKey = content.match(/apiKey:\s*['"]([^'"]+)['"]/)?.[1];
        const authDomain = content.match(/authDomain:\s*['"]([^'"]+)['"]/)?.[1];
        const projectId = content.match(/projectId:\s*['"]([^'"]+)['"]/)?.[1];
        const storageBucket = content.match(/storageBucket:\s*['"]([^'"]+)['"]/)?.[1];
        const messagingSenderId = content.match(/messagingSenderId:\s*['"]([^'"]+)['"]/)?.[1];
        const appId = content.match(/appId:\s*['"]([^'"]+)['"]/)?.[1];
        
        if (apiKey && projectId) {
          config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
        }
      }
    }
  });
  
  if (config) {
    console.log('✅ Found Firebase config!');
    console.log('\n📋 Copy this to your .env file:\n');
    console.log(`VITE_FIREBASE_API_KEY=${config.apiKey}`);
    console.log(`VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}`);
    console.log(`VITE_FIREBASE_PROJECT_ID=${config.projectId}`);
    console.log(`VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}`);
    console.log(`VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`);
    console.log(`VITE_FIREBASE_APP_ID=${config.appId}`);
    
    // Create formatted output
    const envContent = `VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.appId}`;
    
    // Copy to clipboard if possible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(envContent).then(() => {
        console.log('\n✅ Copied to clipboard! Paste into your .env file.');
      }).catch(() => {
        console.log('\n⚠️ Could not copy to clipboard. Please copy manually above.');
      });
    }
    
    return config;
  } else {
    console.log('❌ Could not find Firebase config automatically.');
    console.log('\n📝 Manual steps:');
    console.log('1. Look for the config object in the page');
    console.log('2. Or check the "SDK setup and configuration" section');
    console.log('3. Copy the values from there');
    return null;
  }
})();

