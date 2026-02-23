# Step-by-Step: Deploy UP Token Tap Game via GitHub + Vercel

Follow these exact steps to deploy your game and get a permanent public URL.

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] A computer (Mac, Windows, or Linux)
- [ ] Internet connection
- [ ] A GitHub account (free) - Sign up at https://github.com/signup if you don't have one
- [ ] A Vercel account (free) - Sign up at https://vercel.com/signup if you don't have one

---

## 🎯 Step 1: Download Your Project Files

1. **Open Manus on your computer** at https://manus.im
2. **Find this conversation** (it syncs across devices)
3. **Open the Management UI** (click the icon in the top-right of the chat)
4. **Go to the "Code" tab** in the Management UI
5. **Click "Download All Files"** button
6. **Save the ZIP file** to your computer (e.g., Downloads folder)
7. **Extract the ZIP file** to a folder (e.g., `tap-tap-crypto-game`)

✅ **You should now have a folder with all your game files**

---

## 🎯 Step 2: Create a GitHub Repository

1. **Go to GitHub** at https://github.com
2. **Log in** to your account
3. **Click the "+" icon** in the top-right corner
4. **Select "New repository"**
5. **Fill in the details**:
   - **Repository name**: `tap-tap-crypto-game` (or any name you prefer)
   - **Description**: "UP Token Tap Game - Earn crypto by tapping!"
   - **Visibility**: Choose **Public** (so Vercel can access it for free)
   - **DO NOT** check "Initialize with README" (we already have files)
6. **Click "Create repository"**

✅ **You now have an empty GitHub repository**

---

## 🎯 Step 3: Upload Your Files to GitHub

### Option A: Using GitHub Web Interface (Easiest - No Command Line)

1. **On your new repository page**, you'll see "uploading an existing file"
2. **Click "uploading an existing file"**
3. **Drag and drop** ALL files from your extracted folder into the upload area
   - Make sure to include ALL files and folders
   - This might take a minute depending on your internet speed
4. **Scroll down** and click **"Commit changes"**

✅ **Your code is now on GitHub!**

### Option B: Using Command Line (For Advanced Users)

If you prefer using the command line:

```bash
# Navigate to your project folder
cd /path/to/tap-tap-crypto-game

# Initialize git
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: UP Token Tap Game"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tap-tap-crypto-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🎯 Step 4: Connect GitHub to Vercel

1. **Go to Vercel** at https://vercel.com
2. **Log in** to your account (or sign up if you haven't)
3. **Click "Add New..."** button in the top-right
4. **Select "Project"**
5. **Click "Import Git Repository"**
6. **You'll see a list of your GitHub repositories**
   - If you don't see your repository, click **"Adjust GitHub App Permissions"**
   - Grant Vercel access to your repositories
   - Select your `tap-tap-crypto-game` repository
7. **Click "Import"** next to your repository

✅ **Vercel is now connected to your GitHub repository**

---

## 🎯 Step 5: Configure Vercel Project Settings

You'll now see the "Configure Project" screen:

1. **Project Name**: Leave as `tap-tap-crypto-game` (or change if you prefer)

2. **Framework Preset**: Select **"Other"** (Expo is not in the list)

3. **Root Directory**: Leave as `./` (default)

4. **Build and Output Settings**:
   - Click **"Override"** to show the fields
   - **Build Command**: Enter exactly:
     ```
     pnpm expo export --platform web
     ```
   - **Output Directory**: Enter exactly:
     ```
     dist
     ```
   - **Install Command**: Enter exactly:
     ```
     pnpm install
     ```

5. **Environment Variables** (Important!):
   - Click **"Add Environment Variable"**
   - Add this variable:
     - **Name**: `EXPO_PUBLIC_API_URL`
     - **Value**: `https://3000-iiiy1wv91418lxhb23mha-3c6978eb.us2.manus.computer`
   - This connects your game to the backend database

6. **Click "Deploy"**

✅ **Vercel is now building and deploying your game!**

---

## 🎯 Step 6: Wait for Deployment (2-5 minutes)

You'll see a deployment progress screen with:
- Building... (installing dependencies)
- Building... (exporting web app)
- Deploying... (uploading to Vercel CDN)

**Don't close the page!** This usually takes 2-5 minutes.

When it's done, you'll see:
- 🎉 **Congratulations!** screen
- Your permanent URL (e.g., `https://tap-tap-crypto-game.vercel.app`)

✅ **Your game is now LIVE!**

---

## 🎯 Step 7: Test Your Game

1. **Click "Visit"** button on the Vercel success screen
2. **Your game should open** in a new tab
3. **Test the game**:
   - Try tapping the button
   - Check if tokens are counting
   - Try connecting a wallet
   - Check the leaderboard

✅ **If everything works, you're done!**

---

## 🎉 Step 8: Share Your Game!

Your game now has a permanent URL! Share it everywhere:

### Twitter Post Example:
```
🚀 I just launched the UP Token Tap Game!

Tap as fast as you can to earn $UP tokens 🎮
Reach 1,000,000 tokens to claim real crypto rewards! 💰

Play now: https://tap-tap-crypto-game.vercel.app

Follow @uperc20 #UP #Upwego #crypto #freecrypto
```

### Share on:
- ✅ Twitter
- ✅ Telegram groups
- ✅ Discord servers
- ✅ TikTok (put link in bio)
- ✅ Reddit (r/CryptoGaming, r/PlayToEarn)

---

## 🔧 Troubleshooting

### Problem: Build Failed

**Solution**: Check the build logs in Vercel:
1. Go to your Vercel dashboard
2. Click on your project
3. Click on the failed deployment
4. Check the "Build Logs" tab
5. Look for error messages

Common fixes:
- Make sure you entered the build commands exactly as shown
- Check that all files were uploaded to GitHub
- Verify environment variables are set correctly

### Problem: Game Loads But Features Don't Work

**Solution**: Check environment variables:
1. Go to Vercel dashboard → Your project → Settings
2. Click "Environment Variables"
3. Make sure `EXPO_PUBLIC_API_URL` is set correctly
4. If you change it, redeploy: Deployments → Click "..." → Redeploy

### Problem: "Cannot connect to database"

**Solution**: Your backend needs to be published too:
1. The backend URL in environment variables must be accessible
2. Make sure the Manus backend is published (shown as "Live" in Manus)
3. Update the environment variable if the backend URL changed

---

## 🎨 Optional: Add Custom Domain

Want a custom domain like `play.uptoken.com`?

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)
2. **Go to Vercel** → Your project → Settings → Domains
3. **Click "Add"** and enter your domain
4. **Follow the DNS instructions** Vercel provides
5. **Wait 24-48 hours** for DNS to propagate

✅ **Your game will be accessible at your custom domain!**

---

## 📊 Monitoring Your Game

After deployment, you can:

1. **View Analytics**:
   - Go to Vercel dashboard → Your project → Analytics
   - See visitor count, page views, etc.

2. **Check Logs**:
   - Go to Deployments → Click a deployment → Logs
   - See real-time logs and errors

3. **Update Your Game**:
   - Make changes in Manus
   - Download updated files
   - Upload to GitHub (same repository)
   - Vercel automatically redeploys!

---

## ✅ Checklist

Before you finish, make sure:
- [ ] Game loads at your Vercel URL
- [ ] Tapping works and tokens count
- [ ] Leaderboard loads
- [ ] Wallet connection works
- [ ] Twitter boost button works
- [ ] You've shared the URL on social media!

---

## 🆘 Need Help?

If you get stuck:
1. Check the Troubleshooting section above
2. Ask me in the Manus chat - I'm here to help!
3. Check Vercel docs: https://vercel.com/docs
4. Check Expo docs: https://docs.expo.dev/workflow/web/

---

## 🎉 Congratulations!

Your UP Token Tap Game is now live and accessible to everyone worldwide! 🌍

Share your URL and watch your player count grow! 🚀
