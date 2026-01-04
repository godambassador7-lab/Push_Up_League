# Setting Up the Core Module Private Repository

Follow these steps to create the private core repository on GitHub:

## Step 1: Create Private Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `Push_Up_League_Core`
3. Description: `Proprietary core engine for Push-Up League (PRIVATE)`
4. **Visibility: PRIVATE** ⚠️ **IMPORTANT**
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Core Module to GitHub

```bash
cd "Push Up League Final/pushup-league-core"
git remote add origin https://github.com/godambassador7-lab/Push_Up_League_Core.git
git branch -M main
git push -u origin main
```

## Step 3: Add as Submodule to Main Repo

From the main repository root:

```bash
cd "Push Up League Final"
git submodule add https://github.com/godambassador7-lab/Push_Up_League_Core.git pushup-league-core
git commit -m "Add private core module as submodule"
git push
```

## Step 4: Configure Submodule Access

Make sure collaborators have access to BOTH repositories:
1. Main repo: `Push_Up_League` (can be public)
2. Core repo: `Push_Up_League_Core` (MUST be private)

## Step 5: Clone Instructions for Team

For new team members with access to both repos:

```bash
git clone --recurse-submodules https://github.com/godambassador7-lab/Push_Up_League.git
```

Or if already cloned:

```bash
git submodule init
git submodule update
```

## Updating the Core Module

When you make changes to core files:

```bash
cd pushup-league-core
git add .
git commit -m "Update core features"
git push

# Then update the main repo to point to new commit
cd ..
git add pushup-league-core
git commit -m "Update core module reference"
git push
```

## Security Checklist

- [  ] Core repository is set to PRIVATE
- [  ] Only trusted team members have access
- [  ] NDAs signed by all contributors
- [  ] GitHub repository settings reviewed
- [  ] Branch protection rules enabled
- [  ] Two-factor authentication enabled

## What's Protected

The core module contains:

1. **Adaptive Training Engine** - Auto-scaling algorithms
2. **Calorie Tracking** - Proprietary formulas and multipliers
3. **58 Variation Library** - Curated push-up types with precise tuning
4. **Iron Mode** - Music-integrated training logic
5. **Achievement System** - 250 carefully designed achievements
6. **Quest System** - Dynamic quest generation algorithms
7. **Title Shop** - 259 curated titles with balanced economy
8. **Training Plans** - Progressive overload and periodization logic

## License

The core module is under PROPRIETARY license. See pushup-league-core/LICENSE for details.

**All Rights Reserved © 2025 Push-Up League**
