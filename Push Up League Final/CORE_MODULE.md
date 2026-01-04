# Push-Up League Core Module

This repository uses a **private submodule** for proprietary features.

## What's Protected

The following core features are located in the private `pushup-league-core` submodule:

1. **Adaptive Training Engine** (`adaptiveEngine.ts`, `adaptiveUtils.ts`)
   - Auto-scaling workout algorithms
   - Division-based progression
   - RIR-based load management

2. **Calorie Tracking System** (`calorieCalculator.ts`)
   - Proprietary calorie estimation formula
   - Body weight integration
   - Difficulty multipliers

3. **58 Push-Up Variation Library** (`pushupTypes.ts`)
   - Comprehensive variation catalog
   - Intelligent difficulty scaling
   - Category organization

4. **Iron Mode** (`ironMode.ts`)
   - Music-integrated training logic
   - Tempo-based rep counting

5. **Gamification Systems**
   - **Achievements** (`achievements.ts`) - 250 achievement system
   - **Quests** (`quests.ts`) - Dynamic quest generation
   - **Title Shop** (`titleShop.ts`) - 259 curated titles

6. **Training Plans** (`trainingPlans.ts`, `planTemplates.ts`)
   - Progressive overload algorithms
   - Periodization cycles

## For Contributors

### If You Have Access to the Core Module

Clone with submodules:

```bash
git clone --recurse-submodules https://github.com/godambassador7-lab/Push_Up_League.git
```

Or if you already cloned, initialize the submodule:

```bash
git submodule init
git submodule update
```

### If You DON'T Have Access

The app will use placeholder implementations for core features. You can still work on:

- UI/UX components
- Firebase integration
- User interface improvements
- Non-core features
- Bug fixes
- Documentation

To request access to the core module, contact the repository owner.

## Architecture

```
Push Up League Final/
├── src/
│   ├── components/         # UI components (public)
│   ├── lib/
│   │   ├── store.ts       # State management (public)
│   │   ├── firebase.ts    # Firebase integration (public)
│   │   └── ...            # Other utilities
│   └── app/               # Next.js app structure
└── pushup-league-core/    # PRIVATE SUBMODULE
    └── src/
        └── lib/
            ├── adaptiveEngine.ts
            ├── calorieCalculator.ts
            ├── pushupTypes.ts
            ├── achievements.ts
            ├── quests.ts
            ├── titleShop.ts
            └── ...
```

## Why a Private Submodule?

The core algorithms and data structures represent significant intellectual property:

- **Adaptive Engine**: Custom auto-scaling logic
- **Calorie Formula**: Research-backed, tuned calculations
- **58 Variations**: Curated library with precise multipliers
- **250 Achievements**: Carefully designed progression system
- **259 Titles**: Thematic catalog with balanced economy
- **Training Plans**: Progressive overload algorithms

These features differentiate Push-Up League from competitors and took significant research and development.

## Security

- The `pushup-league-core` repository is **PRIVATE**
- Access is restricted to authorized team members
- All contributors must sign NDAs
- Do not share submodule credentials

## Questions?

Contact the repository owner for:
- Core module access requests
- Architecture questions
- Collaboration inquiries
