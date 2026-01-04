# Push Core Module to GitHub - Quick Guide

⚠️ **IMPORTANT**: The core repository MUST be set to **PRIVATE**

## Step 1: Create the Repository on GitHub

### Option A: Via GitHub Website (Recommended)
1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `Push_Up_League_Core`
   - **Description**: `Proprietary core engine for Push-Up League (PRIVATE)`
   - **Visibility**: ⚠️ **PRIVATE** (DO NOT make this public!)
   - **Initialize**: ❌ Do NOT check any boxes (we have files already)
3. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create godambassador7-lab/Push_Up_League_Core --private --description "Proprietary core engine for Push-Up League"
```

## Step 2: Push the Core Module

The remote is already configured! Just run:

```bash
cd "Push Up League Final/pushup-league-core"
git push -u origin main
```

## Step 3: Verify Privacy Settings

After pushing, verify on GitHub:
1. Go to: https://github.com/godambassador7-lab/Push_Up_League_Core
2. You should see a 🔒 lock icon (indicating private)
3. Go to Settings → Danger Zone → Change visibility
4. Confirm it says "Private"

## Step 4: Add as Submodule to Main Repo (Optional)

This links the repositories together:

```bash
cd "Push Up League Final"
git submodule add https://github.com/godambassador7-lab/Push_Up_League_Core.git pushup-league-core
git add .gitmodules pushup-league-core
git commit -m "Link private core module as submodule"
git push origin main
```

## What Gets Protected

The core repository now contains:
- ✅ Adaptive training engine (auto-scaling algorithms)
- ✅ Calorie calculator (proprietary formulas)
- ✅ 58 push-up variations with difficulty multipliers
- ✅ Iron Mode logic
- ✅ 250 achievement system
- ✅ 259 title catalog
- ✅ Quest generation algorithms
- ✅ Training plan templates

## Security Checklist

- [ ] Core repository is PRIVATE
- [ ] Repository URL: https://github.com/godambassador7-lab/Push_Up_League_Core
- [ ] Only authorized users have access
- [ ] Main repo still works without core module access

## Troubleshooting

**Error: "Repository not found"**
- Make sure you created the repository on GitHub first
- Verify the repository name matches exactly: `Push_Up_League_Core`
- Check you're logged in to the correct GitHub account

**Error: "Permission denied"**
- Make sure you have push access to the repository
- Check your GitHub credentials/authentication

## After Pushing

The core module is now protected in a private repository. The main `Push_Up_League` repository can be:
- ✅ Made public for your portfolio
- ✅ Shared with UI/UX contributors
- ✅ Used in demonstrations

While keeping your proprietary algorithms private! 🔒
