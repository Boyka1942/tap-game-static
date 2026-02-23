# Tap Tap Crypto - Mobile App Design

## Overview
A fast-paced tap-tap minigame where users rapidly tap a button to earn crypto tokens. The app features a simple, engaging interface optimized for one-handed mobile play in portrait orientation.

## Screen List

### 1. Home Screen (Game Screen)
- **Primary Content**: Large tappable button/area in center, token counter at top, timer display
- **Functionality**: 
  - Display current token balance
  - Show active game timer (e.g., 30-60 seconds per round)
  - Large tap target for rapid tapping
  - Real-time tap counter during active game
  - Visual feedback on each tap (scale animation, haptic feedback)

### 2. Results Screen
- **Primary Content**: Final tap count, tokens earned, total balance, "Play Again" button
- **Functionality**:
  - Show game statistics (taps, tokens earned, accuracy if applicable)
  - Display updated total token balance
  - Option to play another round
  - Brief celebration animation

### 3. Stats/Profile Screen (Tab)
- **Primary Content**: Total tokens earned, lifetime stats, game history
- **Functionality**:
  - Display cumulative token balance
  - Show lifetime statistics (total taps, total games played, best score)
  - Optional: Leaderboard or achievements

### 4. Settings Screen (Tab)
- **Primary Content**: Sound toggle, haptics toggle, theme selection
- **Functionality**:
  - Enable/disable sound effects
  - Enable/disable haptic feedback
  - Dark/light mode toggle
  - App information

## Primary Content and Functionality

### Game Mechanics
- **Tap Target**: Large, responsive button or tappable area that fills most of the screen
- **Token Earning**: Each tap = 1 token (or configurable multiplier)
- **Game Duration**: Fixed timer (30-60 seconds per round, configurable)
- **Tap Counter**: Real-time display of taps during active game
- **Token Display**: Always visible at top of screen showing current balance

### User Flows

#### Main Game Flow
1. User lands on Home Screen → sees current token balance
2. User taps "Play" or large tap button → game starts with timer countdown
3. User rapidly taps button for duration of timer
4. Timer expires → Results Screen shows stats
5. User taps "Play Again" → returns to Home Screen, game ready to play

#### Stats Flow
1. User taps "Stats" tab → sees lifetime statistics and token balance
2. User can view game history or achievements
3. User taps "Home" to return to game

#### Settings Flow
1. User taps "Settings" tab → sees options
2. User toggles sound, haptics, or theme
3. Settings auto-save
4. User taps "Home" to return to game

## Color Choices

### Brand Colors
- **Primary (Accent)**: `#0a7ea4` (Crypto Blue) - Used for buttons, highlights, and active states
- **Background**: `#ffffff` (Light) / `#151718` (Dark) - Screen background
- **Surface**: `#f5f5f5` (Light) / `#1e2022` (Dark) - Card backgrounds
- **Foreground**: `#11181C` (Light) / `#ECEDEE` (Dark) - Primary text
- **Muted**: `#687076` (Light) / `#9BA1A6` (Dark) - Secondary text
- **Success**: `#22C55E` (Green) - Token earned, positive feedback
- **Warning**: `#F59E0B` (Orange) - Alerts, cautions
- **Error**: `#EF4444` (Red) - Errors, failures

### Crypto Theme Accents
- **Token Gold**: `#FFD700` - For token displays and earned amounts
- **Crypto Purple**: `#8B5CF6` - Secondary accent for crypto branding

## Key Interactions

### Tap Button Feedback
- **Visual**: Scale down to 0.95 on press, scale back up on release
- **Haptic**: Light impact feedback on each tap
- **Audio**: Optional coin/pop sound effect on tap

### Game Start
- Smooth transition from Home to active game state
- Timer countdown animation
- Tap counter increments smoothly

### Game End
- Celebration animation (confetti or scale pulse)
- Smooth transition to Results Screen
- Token balance updates with animation

## Layout Specifics

### Portrait Orientation (9:16)
- **Top Section (10%)**: Status bar, token balance display
- **Middle Section (70%)**: Large tap button/area, timer display, tap counter
- **Bottom Section (20%)**: Navigation tabs or action buttons

### One-Handed Usage
- All interactive elements within thumb reach
- Large tap target (minimum 60x60pt, ideally 100x100pt+)
- No elements requiring two-handed interaction
- Bottom navigation tabs easily reachable with thumb

## Technical Considerations
- Local token storage using AsyncStorage (no backend required unless user requests cloud sync)
- Smooth animations using react-native-reanimated for responsive feel
- Haptic feedback using expo-haptics for tactile feedback
- Optional sound effects using expo-audio
- Responsive design that works on various screen sizes and aspect ratios
