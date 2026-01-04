# Core Module Note

## Important: Core Module Repository Structure

The Push-Up League core algorithms are maintained in a **separate private repository** for IP protection:

**Core Repository**: https://github.com/godambassador7-lab/push-up-league-core (PRIVATE)

## Why Not a Submodule?

Initially, the core module was configured as a Git submodule. However, this caused issues with:
- GitHub Actions builds (cannot access private submodules)
- Vercel/Netlify deployments
- Public repository collaboration

## Current Structure

### For Development (Local)

The core module files exist in:
```
Push Up League Final/
└── pushup-league-core/
    └── src/
        └── lib/
            ├── programs.ts
            ├── techniqueAndSafety.ts
            ├── integritySystem.ts
            ├── progressionInsights.ts
            ├── socialCompetition.ts
            └── ... (other core files)
```

These files are **NOT tracked** in the main repository's Git history to keep them private.

### For Production (Deployment)

When deploying, you have two options:

#### Option 1: Include Core Files (Recommended for Private Deploys)
If your main repository is private or you're deploying to a private environment:
1. Keep the core files in `pushup-league-core/`
2. They'll be included in the deployment
3. All features will work

#### Option 2: Stub Implementation (For Public Repos)
If you want to make the main repo public:
1. Remove core files from deployment
2. Use stub/demo implementations for core features
3. Only show UI components without actual algorithms

## Keeping Core Module Updated

The core module is maintained separately. To update:

### Option 1: Manual Copy (Simple)
```bash
# In the private core repo
cd /path/to/push-up-league-core
git pull

# Copy to main project
cp -r src/* /path/to/Push_Up_League/Push\ Up\ League\ Final/pushup-league-core/src/
```

### Option 2: Git Clone (When Needed)
```bash
cd "Push Up League Final"

# Remove old core files
rm -rf pushup-league-core

# Clone fresh from private repo
git clone https://github.com/godambassador7-lab/push-up-league-core.git pushup-league-core

# Remove git tracking
rm -rf pushup-league-core/.git
```

## Security Considerations

✅ **Core repository remains PRIVATE**
✅ **Algorithms protected from public view**
✅ **Main repository can be public** (if desired)
✅ **No build failures from submodule access**
✅ **Easy deployment** without submodule complexity

## For Team Members

### If You Have Core Access:
1. Clone main repository
2. Clone core repository separately
3. Copy core files to `pushup-league-core/` folder
4. Develop normally

### If You DON'T Have Core Access:
1. Clone main repository
2. You'll see imports from `@/lib/_core_imports`
3. These will fail - that's expected
4. Focus on UI components and non-core features
5. Use mock data for testing

## Deployment Checklist

Before deploying to production:

- [ ] Core files are present in `pushup-league-core/`
- [ ] All imports resolve correctly
- [ ] TypeScript compiles without errors
- [ ] Environment variables are set
- [ ] Build succeeds locally

## Questions?

See these documents:
- [CORE_MODULE.md](CORE_MODULE.md) - Architecture details
- [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) - Full structure guide
- [FEATURE_UPGRADES.md](FEATURE_UPGRADES.md) - New features documentation

---

**© 2025 Push-Up League. Core module proprietary and confidential.**
