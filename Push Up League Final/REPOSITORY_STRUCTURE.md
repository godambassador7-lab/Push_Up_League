# Push-Up League Repository Structure

## Overview

Push-Up League uses a **dual-repository architecture** to protect intellectual property while maintaining an open development model.

## Repository Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Main Repository (Public/Private - Your Choice)             │
│  https://github.com/godambassador7-lab/Push_Up_League       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ UI Components (React/Next.js)                            │
│  ✅ State Management (Zustand store)                         │
│  ✅ Firebase Integration                                     │
│  ✅ App Layout & Routing                                     │
│  ✅ Documentation                                            │
│  ✅ Build Configuration                                      │
│                                                               │
│  📂 pushup-league-core/ ──────────────┐                     │
│     (Git Submodule)                    │                     │
└────────────────────────────────────────┼─────────────────────┘
                                         │
                                         ├──> Links to:
                                         │
┌────────────────────────────────────────┼─────────────────────┐
│  Core Repository (PRIVATE - Required)  │                     │
│  https://github.com/godambassador7-lab/Push_Up_League_Core  │
├────────────────────────────────────────┴─────────────────────┤
│                                                               │
│  🔒 Adaptive Training Engine                                 │
│  🔒 Calorie Calculation Algorithms                           │
│  🔒 58 Push-Up Variation Library                             │
│  🔒 Iron Mode Training Logic                                 │
│  🔒 250 Achievement System                                   │
│  🔒 Dynamic Quest Generation                                 │
│  🔒 259 Title Catalog                                        │
│  🔒 Training Plan Templates                                  │
│                                                               │
│  📜 PROPRIETARY LICENSE                                      │
└───────────────────────────────────────────────────────────────┘
```

## File Distribution

### Main Repository Files

**Public-Safe Files** (can be shared):
- `/src/components/**/*.tsx` - All React components
- `/src/app/**/*.tsx` - Next.js app structure
- `/src/lib/store.ts` - State management (no algorithms)
- `/src/lib/enhancedStore.ts` - Extended state
- `/src/lib/firebase.ts` - Firebase configuration
- `/src/lib/syncManager.ts` - Data synchronization
- `/src/lib/powerUps.ts` - Power-up definitions
- `/src/lib/sessionChallenges.ts` - Session challenges
- `/src/lib/worldRecords.ts` - World record data
- `/src/globals.css` - Styling
- `/tailwind.config.ts` - Tailwind configuration
- `/package.json` - Dependencies
- All documentation (`*.md` files)

### Core Repository Files

**Proprietary Files** (private access only):
- `adaptiveEngine.ts` - Auto-scaling workout algorithms
- `adaptiveUtils.ts` - Adaptive training utilities
- `calorieCalculator.ts` - Calorie estimation formulas
- `pushupTypes.ts` - 58 variation library + multipliers
- `ironMode.ts` - Music-integrated training
- `achievements.ts` - 250 achievement system
- `quests.ts` - Quest generation algorithms
- `titleShop.ts` - 259 title catalog
- `trainingPlans.ts` - Training plan logic
- `planTemplates.ts` - Workout templates

## Access Models

### Option 1: Public Main + Private Core (Recommended)

**Main Repo**: Public (for portfolio/collaboration)
**Core Repo**: Private (IP protection)

**Benefits**:
- Show off your work publicly
- Protect competitive advantages
- Allow UI contributions without exposing algorithms
- Great for portfolio/resume

### Option 2: Both Private

**Main Repo**: Private
**Core Repo**: Private

**Benefits**:
- Maximum security
- Control all access
- Good for stealth mode/pre-launch

### Option 3: Monorepo (Not Recommended)

All code in one repository.

**Drawbacks**:
- ❌ Can't selectively share code
- ❌ All-or-nothing access
- ❌ IP exposed to all contributors

## Integration

### Import Pattern

Components import from core like this:

```typescript
// In any component/file
import {
  calculateCalories,
  getPushUpTypeData,
  generateAchievements,
  // ... etc
} from '@/lib/_core_imports';
```

The `_core_imports.ts` file re-exports from the core module:

```typescript
// src/lib/_core_imports.ts
export * from '../../pushup-league-core/src/lib/adaptiveEngine';
export * from '../../pushup-league-core/src/lib/calorieCalculator';
// ... etc
```

### Development Setup

**With Core Access**:
```bash
git clone --recurse-submodules https://github.com/godambassador7-lab/Push_Up_League.git
cd Push_Up_League/Push\ Up\ League\ Final
npm install
npm run dev
```

**Without Core Access** (UI contributors):
```bash
git clone https://github.com/godambassador7-lab/Push_Up_League.git
cd Push_Up_League/Push\ Up\ League\ Final
# Create stub files or use demo data
npm install
npm run dev
```

## Deployment

When deploying, ensure:
1. ✅ Core module is cloned (on server with credentials)
2. ✅ Submodule is initialized (`git submodule update --init`)
3. ✅ Environment variables are set
4. ✅ Build succeeds with core imports

## Updating Core Features

**When you modify core algorithms**:

```bash
# 1. Update core module
cd pushup-league-core
git add .
git commit -m "Improve adaptive scaling algorithm"
git push origin main

# 2. Update main repo to reference new core version
cd ..
git add pushup-league-core
git commit -m "Update core module to latest version"
git push origin main
```

## Security Best Practices

1. ✅ **Keep core repo PRIVATE at all times**
2. ✅ **Use SSH keys or tokens for authentication**
3. ✅ **Enable two-factor authentication**
4. ✅ **Review access permissions regularly**
5. ✅ **Don't commit secrets/API keys**
6. ✅ **Use environment variables for sensitive data**
7. ✅ **Require NDAs from core contributors**
8. ✅ **Enable branch protection on both repos**

## License Summary

- **Main Repo**: Your choice (MIT, Apache, etc. if public)
- **Core Repo**: PROPRIETARY - All Rights Reserved

## Questions?

See:
- [CORE_MODULE.md](CORE_MODULE.md) - Detailed core module documentation
- [SETUP_CORE_REPO.md](SETUP_CORE_REPO.md) - Setup instructions
- [PUSH_CORE_TO_GITHUB.md](PUSH_CORE_TO_GITHUB.md) - Quick push guide

---

**© 2025 Push-Up League. Core module proprietary and confidential.**
