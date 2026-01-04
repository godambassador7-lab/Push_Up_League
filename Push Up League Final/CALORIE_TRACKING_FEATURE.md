# Calorie Tracking Feature Documentation

## Overview
Comprehensive calorie estimation system for Push-Up League that provides honest, science-based calorie burn estimates while emphasizing strength gains over calories.

## Implementation Summary

### **Core Formula**
```
Calories = reps × base × difficultyMultiplier

Base = (0.04 × bodyweight_kg) / 10
```

**Example for 77kg (170lbs) user:**
- Base ≈ 0.09 cal/rep for standard push-ups
- 50 standard push-ups ≈ 4.5 calories
- 50 explosive push-ups ≈ 5.9 calories

## Files Created

### 1. **`src/lib/calorieCalculator.ts`**
Core calorie calculation logic with comprehensive utilities.

**Key Functions:**
```typescript
calculateCalories(reps, pushupType, bodyWeightKg): CalorieEstimate
calculateMultiSetCalories(sets, bodyWeightKg): number
calculateWeeklyStats(workouts, bodyWeightKg): WeeklyCalorieStats
getCalorieBurnMessage(calories, strengthGain): string
lbsToKg(lbs): number
kgToLbs(kg): number
```

**Difficulty Multipliers:**
- Regressions (knee/incline): 0.7-0.9x
- Standard variations: 1.0-1.2x
- Advanced (deficit/decline): 1.14-1.43x
- Elite (archer/one-arm): 1.35-1.8x
- Master (planche/maltese): 1.87-2.55x

### 2. **`src/components/CalorieDashboard.tsx`**
Full-featured calorie tracking dashboard component.

**Features:**
- Today's calorie burn estimate
- Weekly total calories
- Daily average (7-day period)
- Highest burn day tracking
- Afterburn bonus indicator (300+ reps/week)
- Body weight editor (kg/lbs toggle)
- Contextual AI messages
- XP-first philosophy messaging

**UI Sections:**
- Settings panel (body weight management)
- Info tooltip about calorie estimation
- Today's total with motivational message
- Weekly stats grid (4 cards)
- XP priority reminder box

### 3. **`src/lib/store.ts` (Updated)**
Added body weight tracking to user state.

**New Fields:**
```typescript
bodyWeightKg: number; // Default: 77kg (~170lbs)
```

**New Actions:**
```typescript
setBodyWeight(weightKg: number): void; // Clamped 40-200kg
```

### 4. **`src/components/Menu.tsx` (Updated)**
Integrated calorie tracker into main menu.

**Additions:**
- New menu section: 'calories'
- Calorie Tracker button (red/error theme with flame icon)
- Dedicated calorie dashboard page
- Tutorial notice banner in settings

## Key Features

### ✅ Honest Calorie Estimates
- Based on actual research and body weight
- No inflated numbers to make users feel good
- Clear disclaimer: "Estimated calories burned"

### ✅ Smart Difficulty Scaling
- All 58 push-up variations supported
- Automatic multiplier adjustment based on variation
- Equipment-based, plyometric, and skill variations accounted for

### ✅ Weekly Analytics
- 7-day rolling window
- Aggregated daily totals
- Highest burn day tracking
- Afterburn bonus badge for high-volume weeks (300+ reps)

### ✅ Body Weight Integration
- User-configurable weight (kg or lbs)
- Weight affects per-rep calorie calculation
- Validation: 40-200kg (88-440lbs)
- Persistent across sessions

### ✅ Motivational Messaging
- Context-aware messages based on calorie burn
- Strength-first philosophy reinforced
- Weekly totals emphasized over daily burns
- Special messages when strength score increases

### ✅ Tutorial Notice
Added to Settings section:
- YouTube icon with "Coming Soon" badge
- Explains 58 variations will have tutorials
- Directs users to YouTube/trusted sources meanwhile
- Emphasizes proper form importance

## UI/UX Design Philosophy

### Primary Messaging
**"XP is Your Primary Reward"**
- Calories shown as secondary metric
- Weekly totals matter more than single sessions
- Building muscle increases daily burn messaging

### Honest Numbers
Examples for average user (77kg):
- 25 push-ups → ~2.3 cal
- 50 push-ups → ~4.5 cal
- 100 push-ups → ~9 cal

These look low but build trust through honesty.

### Gamification Elements
1. **Afterburn Bonus Badge**
   - Activates at 300+ weekly reps
   - Green "ACTIVE" indicator
   - Message: "High-volume week!"

2. **Highest Day Card**
   - Shows best single-day burn
   - Displays date
   - Encourages consistency

3. **Contextual Messages**
   - &lt;5 cal: "Every rep counts! Small sessions add up."
   - 5-15 cal: "Solid work! Consistency beats intensity."
   - 15-30 cal: "Great session! Strength gains matter more."
   - 30-50 cal: "High-volume session! Muscle-building mode activated."
   - 50+ cal: "Beast mode! You earned the afterburn effect."

## Color Scheme

**Calorie Tracker Theme:**
- Primary: `error` (red/orange - fire theme)
- Icon: `Flame` component
- Border: `border-error/50`
- Background: `bg-error/5`
- Accent text: `text-error`

**Matches the "calorie burn" fire concept while distinguishing from:**
- XP/Coins: accent (cyan)
- Power-Ups: electric-blue
- Titles: warning (yellow)

## Integration Points

### Menu Access
1. Main Menu → Calorie Tracker (4th button)
2. Prominent fire icon
3. Full-screen dedicated page

### Settings Notice
- Tutorial banner at top of settings
- YouTube icon + AlertCircle
- Electric-blue theme (info/notice)
- 2-paragraph explanation

### Future Integration (Recommended)
1. **Workout Summary Screen**
   - Show calories burned after each session
   - Compare to last workout
   - Weekly progress indicator

2. **Statistics Page**
   - Monthly calorie graph
   - Comparison to XP earned
   - "Calories vs Strength" chart

3. **Achievements**
   - "Calorie Crusher" - 500+ weekly calories
   - "Afterburn Master" - 4 consecutive high-volume weeks
   - "Efficiency Expert" - High XP with moderate calories

4. **Push-Up Variation Selector**
   - Show estimated cal/rep for each variation
   - Help users choose based on goals

## Technical Notes

### Performance
- All calculations memoized with `useMemo`
- Efficient weekly aggregation
- No API calls or heavy computations

### Data Storage
- Body weight stored in Zustand store
- Persisted to localStorage
- Syncs with Firebase (if authenticated)

### Edge Cases Handled
- Empty workout history
- Missing body weight (defaults to 77kg)
- Division by zero protection
- Weight bounds validation (40-200kg)

## Example Calculations

### User A: 77kg (170lbs)
**50 Standard Push-Ups:**
- Base: 0.09 cal/rep
- Multiplier: 1.0
- Total: ~4.5 calories

**50 Diamond Push-Ups:**
- Base: 0.09 cal/rep
- Multiplier: 1.15
- Total: ~5.2 calories

**50 One-Arm Push-Ups:**
- Base: 0.09 cal/rep
- Multiplier: 1.62 (elite adjustment)
- Total: ~7.3 calories

### User B: 90kg (198lbs)
**100 Standard Push-Ups:**
- Base: 0.11 cal/rep
- Multiplier: 1.0
- Total: ~11 calories

**100 Explosive Push-Ups:**
- Base: 0.11 cal/rep
- Multiplier: 1.24
- Total: ~13.6 calories

## User Education

### In-App Tooltips
**Body Weight Setting:**
> "Used to estimate calories burned. Heavier users burn slightly more calories per rep."

**Estimated Calories:**
> "Based on body weight, reps, and push-up difficulty. Strength exercises burn fewer calories than cardio—but build muscle that increases daily burn."

**Afterburn Bonus:**
> "Activated when you complete 300+ reps in a week. High-volume training elevates metabolism for hours after your workout."

## Future Enhancements

### Phase 2 Ideas
1. **Variation-Specific Tracking**
   - Track calories by push-up type
   - "Most efficient variation" badge
   - Type-specific leaderboards

2. **TDEE Integration**
   - Track total daily energy expenditure
   - Show push-ups as % of daily burn
   - Macro calculator integration

3. **Historical Graphs**
   - 30/60/90-day calorie trends
   - Calories vs XP correlation chart
   - Weekly averages over time

4. **Smart Goals**
   - "Burn 100 calories this week"
   - Weekly calorie targets
   - Streak for hitting calorie goals

5. **Export/Share**
   - Weekly calorie summary export
   - Share weekly stats to social
   - PDF monthly reports

## Maintenance

### Updating Multipliers
If push-up type multipliers change in `pushupTypes.ts`, the calorie calculator will automatically adjust through `getDifficultyMultiplier()` which maps XP multipliers to calorie multipliers.

### Updating Base Formula
To adjust the base calculation, modify `calculateBaseCaloriesPerRep()` in `calorieCalculator.ts`.

Current formula: `(0.04 × bodyweight_kg) / 10`

### Testing New Variations
When adding new push-up types:
1. Add to `pushupTypes.ts` with XP multiplier
2. Calorie system automatically supports it
3. No changes needed in calculator

## Credits

**Based on Research:**
- Average adult push-up: ~0.08-0.10 cal/rep
- Body weight scaling: 0.04 × weight (kg) / 10
- Difficulty adjustments based on biomechanics

**Philosophy:**
- Honesty builds trust
- Strength > calories
- Weekly consistency > daily burns
- Muscle-building creates long-term fat loss
