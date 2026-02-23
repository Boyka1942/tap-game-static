# UP Token Tap Game - Telegram Mini App Setup Guide

## Overview
This guide explains how to set up and launch the UP Token Tap Game as a Telegram Mini App.

## Prerequisites
1. A Telegram Bot Token (create via [@BotFather](https://t.me/botfather))
2. A deployed web server (for hosting the game)
3. The game deployed to a public URL

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Save your **Bot Token** (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

## Step 2: Deploy the Game

The game needs to be accessible via a public URL. Options:

### Option A: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option B: Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
```

### Option C: Self-hosted
Deploy to your own server and ensure it's accessible via HTTPS.

## Step 3: Configure Telegram Mini App

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/mybots` and select your bot
3. Select "Bot Settings" → "Menu Button"
4. Choose "Web App"
5. Enter the game URL (e.g., `https://your-domain.com`)

## Step 4: Set Webhook (Optional but Recommended)

Send a request to Telegram API to set up the webhook:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram",
    "allowed_updates": ["message", "callback_query"]
  }'
```

## Step 5: Launch the Mini App

1. Open your bot in Telegram
2. Click the menu button to open the Web App
3. The game should load in the Telegram Mini App interface

## Integration Features

### Telegram Web App SDK
The game can integrate with Telegram's Web App SDK for enhanced features:

```typescript
import { WebApp } from '@twa-dev/sdk';

// Initialize
WebApp.ready();

// Get user info
const user = WebApp.initDataUnsafe.user;

// Show popup
WebApp.showPopup({
  title: "UP Token Game",
  message: "Share with friends to earn bonuses!",
  buttons: [{ id: "ok", type: "ok" }]
});

// Close the app
WebApp.close();
```

## User Data & Referrals

To track referrals and user data:

1. Store user IDs from Telegram
2. Generate unique referral codes per user
3. Track referral clicks and rewards
4. Store data in a database (Firebase, Supabase, or custom backend)

## Monetization Options

1. **In-app purchases** - Sell token bundles
2. **Ads** - Display ads between games
3. **Premium features** - Unlock special games or multipliers
4. **Sponsorships** - Partner with other crypto projects

## Testing

1. Add yourself as a tester in BotFather
2. Test all game features in Telegram
3. Verify referral links work
4. Check share buttons function correctly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App doesn't load | Check URL is HTTPS and publicly accessible |
| Buttons not working | Ensure WebApp SDK is initialized |
| User data not loading | Verify Telegram Web App SDK initialization |
| Share not working | Check browser permissions for clipboard access |

## Deployment Checklist

- [ ] Bot created and token saved
- [ ] Game deployed to public URL (HTTPS)
- [ ] Telegram Mini App configured
- [ ] Webhook set up (optional)
- [ ] User referral system implemented
- [ ] Testing completed on mobile
- [ ] Share buttons verified
- [ ] Database configured for user tracking

## Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [TWA SDK Documentation](https://github.com/twa-dev/sdk)

## Next Steps

1. Create a Telegram bot via @BotFather
2. Deploy the game to a public server
3. Configure the Mini App in BotFather
4. Test and launch!

For questions or support, contact: UPUPTOKEN@GMAIL.COM
