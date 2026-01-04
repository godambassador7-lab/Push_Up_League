# Push-Up Types Library Expansion

## Overview
Expanded push-up variation library from 8 to **58 comprehensive variations** covering all skill levels from absolute beginner to master-level gymnastics movements.

## Type Count by Category

### Beginner Regressions (5 types)
- Wall Push-Up
- High Incline Push-Up
- Knee Push-Up
- Eccentric/Negative Push-Up
- Hand-Release Push-Up

### Base Variants (2 types)
- Standard Push-Up
- Wide Push-Up

### Mid-Tier Horizontal Variants (7 types)
- Staggered/Offset Push-Up
- Close-Grip Military Push-Up
- Diamond Push-Up
- Spiderman/Knee-to-Elbow Push-Up
- Shoulder-Tap Push-Up
- T-Rotation Push-Up
- Sphinx/Triceps Extension Push-Up

### Depth/ROM/Equipment Variants (8 types)
- Deficit/Parallette Push-Up
- Ring Push-Up
- TRX Suspension Push-Up
- Instability Push-Up (BOSU/Ball)
- Knuckle Push-Up
- Fingertip Push-Up
- Weighted Push-Up
- Band-Resisted Push-Up

### Decline Variants (2 types)
- Decline Push-Up
- Feet-Elevated Archer Push-Up

### Unilateral/Skill Progressions (10 types)
- Typewriter/Side-to-Side Push-Up
- Archer Push-Up
- One-Arm Push-Up
- One-Arm Negative Push-Up
- Pseudo-Planche Push-Up
- Planche Lean Push-Up
- Full Planche Push-Up
- Maltese Push-Up
- 90° Wall-Assisted Handstand Push-Up
- Freestanding Handstand Push-Up

### Pike/Shoulder Variants (2 types)
- Pike Push-Up
- Handstand Pike Push-Up

### Plyometric/Power Variants (8 types)
- Explosive Push-Up
- Clap Push-Up
- Wide-Clap Push-Up
- Chest-Slap Push-Up
- Behind-the-Back Clap Push-Up
- Superman Push-Up
- Drop-Catch/Depth Push-Up
- Explosive to Box/Plates

### Flow/Mobility Variants (4 types)
- Dive Bomber Push-Up
- Hindu Push-Up
- Cobra Push-Up
- Pike-to-Dolphin Sequence

## Difficulty Distribution

- **Beginner**: 7 types (regressions + base)
- **Intermediate**: 12 types
- **Advanced**: 16 types
- **Elite**: 17 types
- **Master**: 6 types (legendary difficulty)

## XP Multiplier Range

- Minimum: 0.5x (Wall Push-Up)
- Maximum: 3.0x (Maltese Push-Up)
- Average: ~1.35x

## New Features

### Enhanced Metadata
Each push-up type now includes:
- **Primary Muscles**: Targeted muscle groups
- **Category**: Regression, base, horizontal, depth, decline, unilateral, plyometric, flow, shoulder
- **Required Equipment**: Optional field for equipment-dependent variations
- **Difficulty Level**: 5 tiers (beginner → intermediate → advanced → elite → master)

### New Helper Functions
```typescript
getPushUpTypesByDifficulty(difficulty): Filter types by difficulty level
getPushUpTypesByCategory(category): Filter types by category
```

## Integration Notes

### Files That Need Updates

1. **Achievements System** - Add variety achievements for new categories
2. **Quest System** - Create quests for mastering each category
3. **State/Store** - Initialize `variationStats` and `variationPBs` for all 58 types
4. **UI Components** - Update variation selectors to support 58 types with category filtering

### Recommended Next Steps

1. **Update Initial State**: Ensure user store initializes empty stats for all 58 variations
2. **Category Filtering UI**: Add category tabs/filters to variation selector
3. **Progressive Unlocking**: Consider unlocking harder variations based on achievements
4. **Equipment Filter**: Add filter to show/hide equipment-required variations
5. **Variation Achievements**:
   - "Regression Graduate" - Complete all beginner regressions
   - "Plyometric Master" - Master all plyometric variations
   - "Flow Artist" - Complete all flow/mobility variants
   - "Variation Collector" - Attempt all 58 variations
   - "Full Spectrum" - Hit PRs in all categories

## Example Usage

```typescript
// Get all beginner-friendly types
const beginnerTypes = getPushUpTypesByDifficulty('beginner');

// Get all plyometric variations
const plyoTypes = getPushUpTypesByCategory('plyometric');

// Get type data
const typeData = getPushUpTypeData('one-arm');
console.log(typeData.xpMultiplier); // 1.8
console.log(typeData.primaryMuscles); // ['Chest', 'Triceps', 'Core']
```

## Balancing Philosophy

### Regression Tier (0.5x - 1.0x)
For onboarding absolute beginners who cannot perform a standard push-up yet.

### Base & Horizontal Tier (1.0x - 1.25x)
Standard and basic variations accessible to most users.

### Specialized Tier (1.25x - 1.5x)
Equipment-based, decline, and skill progressions requiring dedicated practice.

### Elite Tier (1.5x - 2.0x)
Advanced unilateral movements and explosive plyometrics.

### Master Tier (2.0x - 3.0x)
Legendary difficulty - planche variations, maltese, superman, etc.

## Equipment Requirements

**No Equipment Required**: 43 types
**Optional Equipment**: 15 types
  - Box/Bench (2)
  - Parallettes/Blocks (1)
  - Gymnastics Rings (1)
  - TRX Straps (1)
  - BOSU/Ball (1)
  - Weight Plate/Vest (1)
  - Resistance Band (1)
  - Platform (1)
  - Box/Plates (1)
