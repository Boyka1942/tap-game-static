# Essential Files for GitHub Upload

## ✅ MUST UPLOAD (Critical Files)

These files are **absolutely required** for deployment:

### Root Files (Must be at root level):
- ✅ `package.json` ← **CRITICAL!**
- ✅ `pnpm-lock.yaml`
- ✅ `app.config.ts`
- ✅ `tailwind.config.js`
- ✅ `theme.config.js`
- ✅ `theme.config.d.ts`
- ✅ `tsconfig.json`
- ✅ `babel.config.js`
- ✅ `metro.config.js`
- ✅ `global.css`
- ✅ `vercel.json`
- ✅ `.gitignore`
- ✅ `.npmrc`
- ✅ `.watchmanconfig`
- ✅ `nativewind-env.d.ts`
- ✅ `eslint.config.js`
- ✅ `drizzle.config.ts`

### Folders (Must upload with contents):
- ✅ `app/` folder (all files inside)
- ✅ `components/` folder (all files inside)
- ✅ `assets/` folder (all files inside)
- ✅ `constants/` folder (all files inside)
- ✅ `hooks/` folder (all files inside)
- ✅ `lib/` folder (all files inside)
- ✅ `shared/` folder (all files inside)
- ✅ `scripts/` folder (all files inside)
- ✅ `server/` folder (all files inside)
- ✅ `drizzle/` folder (all files inside)

---

## ❌ DO NOT UPLOAD (Will cause problems or are unnecessary)

These folders/files should **NOT** be uploaded:

- ❌ `node_modules/` ← **NEVER upload this!** (Vercel will install packages automatically)
- ❌ `.git/` ← GitHub creates this automatically
- ❌ `dist/` ← Build output (Vercel creates this)
- ❌ `.expo/` ← Temporary Expo files
- ❌ `__tests__/` ← Test files (optional, can skip)
- ❌ `tests/` ← Test files (optional, can skip)
- ❌ `screenshots/` ← Not needed for deployment
- ❌ `.DS_Store` ← Mac system file
- ❌ Any `.log` files

---

## 📦 What GitHub Web Upload Can't Handle

GitHub's web interface has limits:
- **Cannot upload folders with 100+ files** (like `node_modules`)
- **Cannot upload very large files** (>100MB)
- **May timeout on slow connections**

**Good news**: The `.gitignore` file already excludes `node_modules` and other unnecessary folders!

---

## 🎯 Simplified Upload Strategy

### Option 1: Upload via Web (Easiest but Limited)

**What to upload:**
1. All root files listed above
2. All folders EXCEPT `node_modules`, `.git`, `dist`, `.expo`

**How:**
1. Open your extracted folder
2. **Select all files and folders** EXCEPT `node_modules`
3. Drag and drop to GitHub
4. If GitHub complains about too many files, try Option 2

### Option 2: Use GitHub Desktop (Recommended)

**Download GitHub Desktop**: https://desktop.github.com

**Steps:**
1. Install GitHub Desktop
2. Click "Add" → "Add Existing Repository"
3. Select your extracted folder
4. Click "Publish repository"
5. Done! All files uploaded correctly (respecting .gitignore)

### Option 3: Use Command Line (Advanced)

If you're comfortable with terminal:

```bash
cd /path/to/your/extracted/folder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/tap-tap-crypto-game.git
git branch -M main
git push -u origin main
```

---

## ✅ Quick Verification Checklist

After uploading to GitHub, verify these files are visible on the repository main page:

- [ ] `package.json` is visible at the root
- [ ] `app/` folder exists
- [ ] `components/` folder exists
- [ ] `assets/` folder exists
- [ ] `vercel.json` is visible
- [ ] `node_modules/` is NOT visible (good!)

---

## 🚨 Common Upload Issues

### Issue: "Too many files"
**Solution**: Use GitHub Desktop or command line instead of web upload

### Issue: "File too large"
**Solution**: Check if you're accidentally uploading `node_modules` - delete it first

### Issue: "Upload timeout"
**Solution**: Try uploading in batches:
1. First: Upload all root files
2. Second: Upload `app/` folder
3. Third: Upload `components/` folder
4. Continue with other folders

---

## 💡 Pro Tip

The **easiest and most reliable method** is GitHub Desktop:
1. Takes 2 minutes to install
2. Handles everything automatically
3. Respects `.gitignore` (won't upload `node_modules`)
4. Works every time

Download: https://desktop.github.com

---

## Next Steps After Upload

Once your files are on GitHub:
1. Go to Vercel
2. Import your repository
3. Configure build settings (I'll help with this)
4. Deploy!
