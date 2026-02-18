# Deploy UP Token Tap Game to Vercel

This guide will help you deploy your game to Vercel and get a permanent public URL.

## Prerequisites

1. A Vercel account (free) - Sign up at https://vercel.com
2. GitHub account (optional but recommended)

## Deployment Methods

### Method 1: Deploy via Vercel CLI (Recommended - Fastest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd /home/ubuntu/tap-tap-crypto-game
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **tap-tap-crypto-game** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

5. **Done!** You'll get a URL like: `https://tap-tap-crypto-game.vercel.app`

---

### Method 2: Deploy via GitHub + Vercel (More Professional)

1. **Push code to GitHub**:
   ```bash
   cd /home/ubuntu/tap-tap-crypto-game
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/tap-tap-crypto-game.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Configure project:
     - **Framework Preset**: Other
     - **Build Command**: `pnpm expo export --platform web`
     - **Output Directory**: `dist`
     - **Install Command**: `pnpm install`
   - Click "Deploy"

3. **Done!** Your game will be live at: `https://tap-tap-crypto-game.vercel.app`

---

### Method 3: Deploy via Vercel Web Interface (No CLI)

1. **Download the project files**:
   - In Manus, go to Management UI → Code tab
   - Click "Download All Files"
   - Extract the ZIP file on your computer

2. **Go to Vercel**:
   - Visit https://vercel.com/new
   - Click "Browse" and select the extracted folder
   - Or drag and drop the folder

3. **Configure deployment**:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm expo export --platform web`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Add Environment Variables** (if using backend):
   - In Vercel project settings → Environment Variables
   - Add your backend API URL and any other secrets

5. **Deploy!**

---

## Environment Variables

If your game uses the backend (database, auth, etc.), you need to set these environment variables in Vercel:

```
EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

To add environment variables in Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable
4. Redeploy the project

---

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `play.uptoken.com`)
4. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Make sure `pnpm` is available (Vercel supports it by default)
- Check that `dist` folder is being created
- Verify `vercel.json` configuration is correct

### Blank Page After Deployment
- Check browser console for errors
- Verify API URL environment variables are set correctly
- Make sure backend is published and accessible

### Assets Not Loading
- Check that all image paths use `require()` or are in the `assets` folder
- Verify `dist` folder contains all necessary assets

---

## Your Game is Now Live! 🎉

Share your permanent URL on:
- Twitter
- Telegram
- Discord
- TikTok
- Reddit

Users can play instantly in any browser without downloading anything!

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Expo Web Documentation: https://docs.expo.dev/workflow/web/
