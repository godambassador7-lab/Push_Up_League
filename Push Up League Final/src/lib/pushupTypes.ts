export type PushUpType =
  // Beginner Regressions
  | 'wall'
  | 'high-incline'
  | 'knee'
  | 'eccentric'
  | 'hand-release'
  // Beginner/Intermediate Base
  | 'standard'
  | 'wide'
  // Mid-Tier Horizontal Variants
  | 'staggered'
  | 'close-grip'
  | 'diamond'
  | 'spiderman'
  | 'shoulder-tap'
  | 't-rotation'
  | 'sphinx'
  // Depth/ROM/Equipment Variants
  | 'deficit'
  | 'ring'
  | 'trx'
  | 'instability'
  | 'knuckle'
  | 'fingertip'
  | 'weighted'
  | 'band-resisted'
  // Decline Variants
  | 'decline'
  | 'feet-elevated-archer'
  // Unilateral/Skill Progressions
  | 'typewriter'
  | 'archer'
  | 'one-arm'
  | 'one-arm-negative'
  | 'pseudo-planche'
  | 'planche-lean'
  | 'full-planche'
  | 'maltese'
  | 'wall-handstand'
  | 'handstand'
  // Pike/Shoulder Variants
  | 'pike'
  | 'handstand-pike'
  // Plyometric/Power Variants
  | 'explosive'
  | 'clap'
  | 'wide-clap'
  | 'chest-slap'
  | 'behind-back-clap'
  | 'superman'
  | 'drop-catch'
  | 'explosive-to-box'
  // Flow/Mobility Variants
  | 'dive-bomber'
  | 'hindu'
  | 'cobra'
  | 'pike-dolphin';

export interface PushUpTypeData {
  id: PushUpType;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'master';
  xpMultiplier: number;
  coinMultiplier: number;
  icon: string;
  category: 'regression' | 'base' | 'horizontal' | 'depth' | 'decline' | 'unilateral' | 'plyometric' | 'flow' | 'shoulder';
  primaryMuscles: string[];
  requiredEquipment?: string;
}

export const PUSHUP_TYPES: Record<PushUpType, PushUpTypeData> = {
  // ===== BEGINNER REGRESSIONS =====
  wall: {
    id: 'wall',
    name: 'Wall Push-Up',
    description: 'Standing push-up against wall, lowest resistance',
    difficulty: 'beginner',
    xpMultiplier: 0.5,
    coinMultiplier: 0.5,
    icon: '🧱',
    category: 'regression',
    primaryMuscles: ['Chest', 'Triceps'],
  },
  'high-incline': {
    id: 'high-incline',
    name: 'High Incline Push-Up',
    description: 'Hands on counter/box/bench, reduced bodyweight load',
    difficulty: 'beginner',
    xpMultiplier: 0.7,
    coinMultiplier: 0.7,
    icon: '📦',
    category: 'regression',
    primaryMuscles: ['Chest', 'Triceps'],
    requiredEquipment: 'Box/Bench',
  },
  knee: {
    id: 'knee',
    name: 'Knee Push-Up',
    description: 'Knees on ground, easier progression to standard',
    difficulty: 'beginner',
    xpMultiplier: 0.8,
    coinMultiplier: 0.8,
    icon: '🦵',
    category: 'regression',
    primaryMuscles: ['Chest', 'Triceps'],
  },
  eccentric: {
    id: 'eccentric',
    name: 'Eccentric/Negative Push-Up',
    description: 'Lower slowly (5s), builds strength on descent',
    difficulty: 'beginner',
    xpMultiplier: 0.9,
    coinMultiplier: 0.9,
    icon: '⬇️',
    category: 'regression',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },
  'hand-release': {
    id: 'hand-release',
    name: 'Hand-Release Push-Up',
    description: 'Lift hands at bottom, eliminates momentum',
    difficulty: 'beginner',
    xpMultiplier: 1.0,
    coinMultiplier: 1.0,
    icon: '✋',
    category: 'regression',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },

  // ===== BASE VARIANTS =====
  standard: {
    id: 'standard',
    name: 'Standard Push-Up',
    description: 'Classic push-up with hands shoulder-width apart',
    difficulty: 'beginner',
    xpMultiplier: 1.0,
    coinMultiplier: 1.0,
    icon: '💪',
    category: 'base',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
  },
  wide: {
    id: 'wide',
    name: 'Wide Push-Up',
    description: 'Hands wider than shoulder-width, targets chest',
    difficulty: 'beginner',
    xpMultiplier: 1.05,
    coinMultiplier: 1.05,
    icon: '🦅',
    category: 'base',
    primaryMuscles: ['Chest', 'Shoulders'],
  },

  // ===== MID-TIER HORIZONTAL VARIANTS =====
  staggered: {
    id: 'staggered',
    name: 'Staggered/Offset Push-Up',
    description: 'Hands at different heights, uneven load distribution',
    difficulty: 'intermediate',
    xpMultiplier: 1.1,
    coinMultiplier: 1.1,
    icon: '↗️',
    category: 'horizontal',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },
  'close-grip': {
    id: 'close-grip',
    name: 'Close-Grip Military Push-Up',
    description: 'Hands close together, triceps emphasis',
    difficulty: 'intermediate',
    xpMultiplier: 1.12,
    coinMultiplier: 1.12,
    icon: '🎖️',
    category: 'horizontal',
    primaryMuscles: ['Triceps', 'Chest'],
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond Push-Up',
    description: 'Hands form diamond shape, maximum triceps activation',
    difficulty: 'intermediate',
    xpMultiplier: 1.15,
    coinMultiplier: 1.15,
    icon: '💎',
    category: 'horizontal',
    primaryMuscles: ['Triceps', 'Chest'],
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spiderman/Knee-to-Elbow Push-Up',
    description: 'Bring knee to elbow during descent, core rotation',
    difficulty: 'intermediate',
    xpMultiplier: 1.18,
    coinMultiplier: 1.18,
    icon: '🕷️',
    category: 'horizontal',
    primaryMuscles: ['Chest', 'Obliques', 'Hip Flexors'],
  },
  'shoulder-tap': {
    id: 'shoulder-tap',
    name: 'Shoulder-Tap Push-Up',
    description: 'Tap opposite shoulder at top, anti-rotation core work',
    difficulty: 'intermediate',
    xpMultiplier: 1.16,
    coinMultiplier: 1.16,
    icon: '👆',
    category: 'horizontal',
    primaryMuscles: ['Chest', 'Core', 'Shoulders'],
  },
  't-rotation': {
    id: 't-rotation',
    name: 'T-Rotation Push-Up',
    description: 'Rotate to side plank at top, full-body rotation',
    difficulty: 'intermediate',
    xpMultiplier: 1.2,
    coinMultiplier: 1.2,
    icon: '🔄',
    category: 'horizontal',
    primaryMuscles: ['Chest', 'Obliques', 'Shoulders'],
  },
  sphinx: {
    id: 'sphinx',
    name: 'Sphinx/Triceps Extension Push-Up',
    description: 'Forearm to hand press, intense triceps isolation',
    difficulty: 'intermediate',
    xpMultiplier: 1.22,
    coinMultiplier: 1.22,
    icon: '🗿',
    category: 'horizontal',
    primaryMuscles: ['Triceps', 'Core'],
  },

  // ===== DEPTH/ROM/EQUIPMENT VARIANTS =====
  deficit: {
    id: 'deficit',
    name: 'Deficit/Parallette Push-Up',
    description: 'Hands elevated on blocks, increased range of motion',
    difficulty: 'intermediate',
    xpMultiplier: 1.25,
    coinMultiplier: 1.25,
    icon: '📏',
    category: 'depth',
    primaryMuscles: ['Chest', 'Shoulders'],
    requiredEquipment: 'Parallettes/Blocks',
  },
  ring: {
    id: 'ring',
    name: 'Ring Push-Up',
    description: 'Unstable rings, requires significant stabilization',
    difficulty: 'advanced',
    xpMultiplier: 1.3,
    coinMultiplier: 1.3,
    icon: '⭕',
    category: 'depth',
    primaryMuscles: ['Chest', 'Shoulders', 'Core'],
    requiredEquipment: 'Gymnastics Rings',
  },
  trx: {
    id: 'trx',
    name: 'TRX Suspension Push-Up',
    description: 'Hands or feet in TRX straps, instability training',
    difficulty: 'advanced',
    xpMultiplier: 1.28,
    coinMultiplier: 1.28,
    icon: '🔗',
    category: 'depth',
    primaryMuscles: ['Chest', 'Core', 'Shoulders'],
    requiredEquipment: 'TRX Straps',
  },
  instability: {
    id: 'instability',
    name: 'Instability Push-Up',
    description: 'Feet on BOSU/ball, extreme balance challenge',
    difficulty: 'advanced',
    xpMultiplier: 1.32,
    coinMultiplier: 1.32,
    icon: '⚖️',
    category: 'depth',
    primaryMuscles: ['Chest', 'Core', 'Stabilizers'],
    requiredEquipment: 'BOSU/Ball',
  },
  knuckle: {
    id: 'knuckle',
    name: 'Knuckle Push-Up',
    description: 'On knuckles, wrist conditioning and forearm strength',
    difficulty: 'intermediate',
    xpMultiplier: 1.08,
    coinMultiplier: 1.08,
    icon: '👊',
    category: 'depth',
    primaryMuscles: ['Chest', 'Wrists', 'Forearms'],
  },
  fingertip: {
    id: 'fingertip',
    name: 'Fingertip Push-Up',
    description: 'On fingertips only, elite grip and forearm strength',
    difficulty: 'advanced',
    xpMultiplier: 1.35,
    coinMultiplier: 1.35,
    icon: '🖐️',
    category: 'depth',
    primaryMuscles: ['Chest', 'Fingers', 'Forearms'],
  },
  weighted: {
    id: 'weighted',
    name: 'Weighted Push-Up',
    description: 'Plate/vest added, progressive overload',
    difficulty: 'advanced',
    xpMultiplier: 1.4,
    coinMultiplier: 1.4,
    icon: '⚓',
    category: 'depth',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
    requiredEquipment: 'Weight Plate/Vest',
  },
  'band-resisted': {
    id: 'band-resisted',
    name: 'Band-Resisted Push-Up',
    description: 'Resistance band around back, increased tension at top',
    difficulty: 'advanced',
    xpMultiplier: 1.38,
    coinMultiplier: 1.38,
    icon: '🎗️',
    category: 'depth',
    primaryMuscles: ['Chest', 'Triceps'],
    requiredEquipment: 'Resistance Band',
  },

  // ===== DECLINE VARIANTS =====
  decline: {
    id: 'decline',
    name: 'Decline Push-Up',
    description: 'Feet elevated, increased shoulder activation',
    difficulty: 'intermediate',
    xpMultiplier: 1.2,
    coinMultiplier: 1.2,
    icon: '📐',
    category: 'decline',
    primaryMuscles: ['Upper Chest', 'Shoulders'],
  },
  'feet-elevated-archer': {
    id: 'feet-elevated-archer',
    name: 'Feet-Elevated Archer Push-Up',
    description: 'Archer with feet raised, extreme unilateral demand',
    difficulty: 'elite',
    xpMultiplier: 1.55,
    coinMultiplier: 1.55,
    icon: '🏹⬆️',
    category: 'decline',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },

  // ===== UNILATERAL/SKILL PROGRESSIONS =====
  typewriter: {
    id: 'typewriter',
    name: 'Typewriter/Side-to-Side Push-Up',
    description: 'Slide horizontally at bottom, lateral strength',
    difficulty: 'advanced',
    xpMultiplier: 1.42,
    coinMultiplier: 1.42,
    icon: '⌨️',
    category: 'unilateral',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },
  archer: {
    id: 'archer',
    name: 'Archer Push-Up',
    description: 'One arm emphasis, advanced unilateral strength',
    difficulty: 'advanced',
    xpMultiplier: 1.3,
    coinMultiplier: 1.3,
    icon: '🏹',
    category: 'unilateral',
    primaryMuscles: ['Chest', 'Triceps'],
  },
  'one-arm': {
    id: 'one-arm',
    name: 'One-Arm Push-Up',
    description: 'Elite single-arm push-up, pure unilateral strength',
    difficulty: 'elite',
    xpMultiplier: 1.8,
    coinMultiplier: 1.8,
    icon: '💪🔥',
    category: 'unilateral',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },
  'one-arm-negative': {
    id: 'one-arm-negative',
    name: 'One-Arm Negative Push-Up',
    description: 'Eccentric-only one-arm, builds to full one-arm',
    difficulty: 'elite',
    xpMultiplier: 1.5,
    coinMultiplier: 1.5,
    icon: '💪⬇️',
    category: 'unilateral',
    primaryMuscles: ['Chest', 'Triceps', 'Core'],
  },
  'pseudo-planche': {
    id: 'pseudo-planche',
    name: 'Pseudo-Planche Push-Up',
    description: 'Hands by hips, lean forward, planche preparation',
    difficulty: 'elite',
    xpMultiplier: 1.6,
    coinMultiplier: 1.6,
    icon: '🦸',
    category: 'unilateral',
    primaryMuscles: ['Shoulders', 'Core', 'Chest'],
  },
  'planche-lean': {
    id: 'planche-lean',
    name: 'Planche Lean Push-Up',
    description: 'Maximum forward lean, extreme shoulder stress',
    difficulty: 'elite',
    xpMultiplier: 1.7,
    coinMultiplier: 1.7,
    icon: '🦸‍♂️',
    category: 'unilateral',
    primaryMuscles: ['Shoulders', 'Core'],
  },
  'full-planche': {
    id: 'full-planche',
    name: 'Full Planche Push-Up',
    description: 'Body horizontal, feet off ground - master level',
    difficulty: 'master',
    xpMultiplier: 2.5,
    coinMultiplier: 2.5,
    icon: '🌟',
    category: 'unilateral',
    primaryMuscles: ['Shoulders', 'Core', 'Entire Body'],
  },
  maltese: {
    id: 'maltese',
    name: 'Maltese Push-Up',
    description: 'Arms straight out to sides - legendary difficulty',
    difficulty: 'master',
    xpMultiplier: 3.0,
    coinMultiplier: 3.0,
    icon: '👑',
    category: 'unilateral',
    primaryMuscles: ['Shoulders', 'Chest', 'Entire Body'],
  },
  'wall-handstand': {
    id: 'wall-handstand',
    name: '90° Wall-Assisted Handstand Push-Up',
    description: 'Handstand against wall, assisted vertical press',
    difficulty: 'advanced',
    xpMultiplier: 1.45,
    coinMultiplier: 1.45,
    icon: '🧗',
    category: 'unilateral',
    primaryMuscles: ['Shoulders', 'Triceps', 'Core'],
  },
  handstand: {
    id: 'handstand',
    name: 'Freestanding Handstand Push-Up',
    description: 'Elite vertical push, full bodyweight overhead',
    difficulty: 'elite',
    xpMultiplier: 1.5,
    coinMultiplier: 1.5,
    icon: '🤸',
    category: 'shoulder',
    primaryMuscles: ['Shoulders', 'Triceps', 'Core'],
  },

  // ===== PIKE/SHOULDER VARIANTS =====
  pike: {
    id: 'pike',
    name: 'Pike Push-Up',
    description: 'Hips high, targets shoulders heavily',
    difficulty: 'intermediate',
    xpMultiplier: 1.25,
    coinMultiplier: 1.25,
    icon: '🔺',
    category: 'shoulder',
    primaryMuscles: ['Shoulders', 'Triceps'],
  },
  'handstand-pike': {
    id: 'handstand-pike',
    name: 'Handstand Pike Push-Up',
    description: 'Pike with feet elevated high, near-vertical press',
    difficulty: 'advanced',
    xpMultiplier: 1.4,
    coinMultiplier: 1.4,
    icon: '🔺⬆️',
    category: 'shoulder',
    primaryMuscles: ['Shoulders', 'Triceps', 'Core'],
  },

  // ===== PLYOMETRIC/POWER VARIANTS =====
  explosive: {
    id: 'explosive',
    name: 'Explosive Push-Up',
    description: 'Explosive power, hands leave ground',
    difficulty: 'advanced',
    xpMultiplier: 1.35,
    coinMultiplier: 1.35,
    icon: '💥',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Triceps', 'Power'],
  },
  clap: {
    id: 'clap',
    name: 'Clap Push-Up',
    description: 'Clap hands in air, explosive power training',
    difficulty: 'advanced',
    xpMultiplier: 1.38,
    coinMultiplier: 1.38,
    icon: '👏',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Fast-Twitch'],
  },
  'wide-clap': {
    id: 'wide-clap',
    name: 'Wide-Clap Push-Up',
    description: 'Clap with arms wide, increased air time needed',
    difficulty: 'elite',
    xpMultiplier: 1.5,
    coinMultiplier: 1.5,
    icon: '👏🦅',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Coordination'],
  },
  'chest-slap': {
    id: 'chest-slap',
    name: 'Chest-Slap Push-Up',
    description: 'Slap chest mid-air, maximum explosive power',
    difficulty: 'elite',
    xpMultiplier: 1.55,
    coinMultiplier: 1.55,
    icon: '🤛',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Explosiveness'],
  },
  'behind-back-clap': {
    id: 'behind-back-clap',
    name: 'Behind-the-Back Clap Push-Up',
    description: 'Clap behind back in air - extreme difficulty',
    difficulty: 'master',
    xpMultiplier: 2.0,
    coinMultiplier: 2.0,
    icon: '👏🔥',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Coordination'],
  },
  superman: {
    id: 'superman',
    name: 'Superman Push-Up',
    description: 'Full body leaves ground, arms extended forward',
    difficulty: 'master',
    xpMultiplier: 2.2,
    coinMultiplier: 2.2,
    icon: '🦸‍♀️',
    category: 'plyometric',
    primaryMuscles: ['Entire Body', 'Power', 'Explosiveness'],
  },
  'drop-catch': {
    id: 'drop-catch',
    name: 'Drop-Catch/Depth Push-Up',
    description: 'Drop from height, absorb and explode up',
    difficulty: 'elite',
    xpMultiplier: 1.65,
    coinMultiplier: 1.65,
    icon: '⬇️💥',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Reactive Strength'],
    requiredEquipment: 'Platform',
  },
  'explosive-to-box': {
    id: 'explosive-to-box',
    name: 'Explosive to Box/Plates',
    description: 'Explode up to land hands on elevated surface',
    difficulty: 'elite',
    xpMultiplier: 1.7,
    coinMultiplier: 1.7,
    icon: '💥📦',
    category: 'plyometric',
    primaryMuscles: ['Chest', 'Power', 'Coordination'],
    requiredEquipment: 'Box/Plates',
  },

  // ===== FLOW/MOBILITY VARIANTS =====
  'dive-bomber': {
    id: 'dive-bomber',
    name: 'Dive Bomber Push-Up',
    description: 'Arc motion pike to cobra, dynamic flexibility',
    difficulty: 'intermediate',
    xpMultiplier: 1.22,
    coinMultiplier: 1.22,
    icon: '✈️',
    category: 'flow',
    primaryMuscles: ['Shoulders', 'Core', 'Flexibility'],
  },
  hindu: {
    id: 'hindu',
    name: 'Hindu Push-Up',
    description: 'Traditional flow movement, full body engagement',
    difficulty: 'intermediate',
    xpMultiplier: 1.2,
    coinMultiplier: 1.2,
    icon: '🕉️',
    category: 'flow',
    primaryMuscles: ['Shoulders', 'Core', 'Hamstrings'],
  },
  cobra: {
    id: 'cobra',
    name: 'Cobra Push-Up',
    description: 'Low sweep into upward dog, spine mobility',
    difficulty: 'intermediate',
    xpMultiplier: 1.15,
    coinMultiplier: 1.15,
    icon: '🐍',
    category: 'flow',
    primaryMuscles: ['Core', 'Back', 'Flexibility'],
  },
  'pike-dolphin': {
    id: 'pike-dolphin',
    name: 'Pike-to-Dolphin Sequence',
    description: 'Pike to forearm dolphin, shoulder mobility flow',
    difficulty: 'advanced',
    xpMultiplier: 1.35,
    coinMultiplier: 1.35,
    icon: '🐬',
    category: 'flow',
    primaryMuscles: ['Shoulders', 'Core', 'Mobility'],
  },
};

export const getPushUpTypeData = (type: PushUpType): PushUpTypeData => {
  return PUSHUP_TYPES[type];
};

export const getPushUpTypesByDifficulty = (difficulty: PushUpTypeData['difficulty']): PushUpTypeData[] => {
  return Object.values(PUSHUP_TYPES).filter((type) => type.difficulty === difficulty);
};

export const getPushUpTypesByCategory = (category: PushUpTypeData['category']): PushUpTypeData[] => {
  return Object.values(PUSHUP_TYPES).filter((type) => type.category === category);
};

export const getStreakCoinMultiplier = (streakDays: number): number => {
  if (streakDays >= 30) return 1.15;
  if (streakDays >= 14) return 1.1;
  if (streakDays >= 7) return 1.05;
  return 1.0;
};

export const GOAL_COMPLETION_BONUS = 20; // Coins awarded when daily goal is met
export const STREAK_PRESERVATION_BONUS = 5; // Coins for maintaining streak
