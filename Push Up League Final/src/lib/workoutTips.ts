// Post-workout tips, tricks, and healthy eating suggestions
// 50 unique tips that rotate after each workout

export interface WorkoutTip {
  id: number;
  category: 'form' | 'recovery' | 'nutrition' | 'motivation' | 'technique';
  title: string;
  content: string;
  icon: string;
}

export const WORKOUT_TIPS: WorkoutTip[] = [
  // Form & Technique (10 tips)
  {
    id: 1,
    category: 'form',
    title: 'Perfect Your Hand Placement',
    content: 'Keep your hands slightly wider than shoulder-width apart. This activates your chest muscles optimally while reducing wrist strain.',
    icon: '✋'
  },
  {
    id: 2,
    category: 'form',
    title: 'Engage Your Core',
    content: 'Maintain a straight line from head to heels by tightening your abs and glutes. This prevents lower back strain and maximizes effectiveness.',
    icon: '💪'
  },
  {
    id: 3,
    category: 'form',
    title: 'Control Your Breathing',
    content: 'Inhale as you lower down, exhale as you push up. Proper breathing rhythm increases endurance and power output.',
    icon: '🫁'
  },
  {
    id: 4,
    category: 'form',
    title: 'Full Range of Motion',
    content: 'Lower until your chest nearly touches the ground, then push back to full extension. Partial reps limit muscle development.',
    icon: '📏'
  },
  {
    id: 5,
    category: 'form',
    title: 'Elbow Angle Matters',
    content: 'Keep elbows at a 45-degree angle from your body. This protects your shoulders and distributes load across multiple muscle groups.',
    icon: '📐'
  },
  {
    id: 6,
    category: 'technique',
    title: 'Scapular Retraction',
    content: 'Squeeze your shoulder blades together at the bottom of each rep. This engages your back muscles and improves stability.',
    icon: '🔄'
  },
  {
    id: 7,
    category: 'technique',
    title: 'Progressive Overload',
    content: 'Gradually increase reps, sets, or difficulty each week. Small consistent improvements lead to major strength gains.',
    icon: '📈'
  },
  {
    id: 8,
    category: 'form',
    title: 'Head Position',
    content: 'Keep your neck neutral by looking at the ground about 1 foot in front of you. Avoid looking up or down excessively.',
    icon: '👁️'
  },
  {
    id: 9,
    category: 'technique',
    title: 'Time Under Tension',
    content: 'Try slowing down your reps (3 seconds down, 1 second up) to increase muscle activation and build strength.',
    icon: '⏱️'
  },
  {
    id: 10,
    category: 'technique',
    title: 'Mix Up Your Variations',
    content: 'Regularly rotate between push-up variations to target different muscle groups and prevent plateaus.',
    icon: '🔀'
  },

  // Recovery (10 tips)
  {
    id: 11,
    category: 'recovery',
    title: 'Stretch Your Chest',
    content: 'After your workout, do doorway chest stretches for 30 seconds each side. This prevents tightness and improves flexibility.',
    icon: '🧘'
  },
  {
    id: 12,
    category: 'recovery',
    title: 'Ice for Inflammation',
    content: 'If experiencing soreness, apply ice to shoulders or wrists for 15 minutes. This reduces inflammation and speeds recovery.',
    icon: '🧊'
  },
  {
    id: 13,
    category: 'recovery',
    title: 'Prioritize Sleep',
    content: 'Aim for 7-9 hours of quality sleep. Muscle repair and growth happen primarily during deep sleep stages.',
    icon: '😴'
  },
  {
    id: 14,
    category: 'recovery',
    title: 'Active Recovery Days',
    content: 'On rest days, try light activities like walking or yoga. This promotes blood flow without stressing muscles.',
    icon: '🚶'
  },
  {
    id: 15,
    category: 'recovery',
    title: 'Foam Rolling',
    content: 'Use a foam roller on your chest, shoulders, and triceps for 5-10 minutes. This releases muscle tension and improves mobility.',
    icon: '📍'
  },
  {
    id: 16,
    category: 'recovery',
    title: 'Stay Hydrated',
    content: 'Drink water throughout the day, not just during workouts. Aim for at least 8 glasses daily for optimal muscle recovery.',
    icon: '💧'
  },
  {
    id: 17,
    category: 'recovery',
    title: 'Listen to Your Body',
    content: 'Sharp pain is different from muscle soreness. If something hurts, rest that area and consult a professional if it persists.',
    icon: '👂'
  },
  {
    id: 18,
    category: 'recovery',
    title: 'Contrast Showers',
    content: 'Alternate between hot and cold water for 30 seconds each, 3-4 times. This improves circulation and reduces soreness.',
    icon: '🚿'
  },
  {
    id: 19,
    category: 'recovery',
    title: 'Rest Between Sets',
    content: 'Take 60-90 seconds rest between sets for strength, 30-45 seconds for endurance. Adequate rest maximizes performance.',
    icon: '⏸️'
  },
  {
    id: 20,
    category: 'recovery',
    title: 'Epsom Salt Baths',
    content: 'Soak in an Epsom salt bath for 15-20 minutes after intense sessions. The magnesium helps relax muscles and reduce soreness.',
    icon: '🛁'
  },

  // Nutrition (15 tips)
  {
    id: 21,
    category: 'nutrition',
    title: 'Post-Workout Protein',
    content: 'Consume 20-30g of protein within 2 hours after training. Greek yogurt, eggs, or a protein shake are excellent choices.',
    icon: '🥚'
  },
  {
    id: 22,
    category: 'nutrition',
    title: 'Carbs for Recovery',
    content: 'Pair protein with complex carbs like sweet potatoes or brown rice. This replenishes glycogen stores and aids muscle repair.',
    icon: '🍠'
  },
  {
    id: 23,
    category: 'nutrition',
    title: 'Omega-3 Fatty Acids',
    content: 'Eat fatty fish, walnuts, or flaxseeds regularly. Omega-3s reduce inflammation and support muscle recovery.',
    icon: '🐟'
  },
  {
    id: 24,
    category: 'nutrition',
    title: 'Banana Power',
    content: 'Have a banana post-workout for quick carbs and potassium. This prevents cramping and restores electrolyte balance.',
    icon: '🍌'
  },
  {
    id: 25,
    category: 'nutrition',
    title: 'Green Leafy Vegetables',
    content: 'Include spinach, kale, or broccoli daily. They\'re packed with vitamins and minerals essential for muscle function.',
    icon: '🥬'
  },
  {
    id: 26,
    category: 'nutrition',
    title: 'Timing Matters',
    content: 'Eat a balanced meal 2-3 hours before training. This provides sustained energy without feeling too full.',
    icon: '⏰'
  },
  {
    id: 27,
    category: 'nutrition',
    title: 'Antioxidant-Rich Berries',
    content: 'Snack on blueberries, strawberries, or raspberries. Antioxidants combat exercise-induced oxidative stress.',
    icon: '🫐'
  },
  {
    id: 28,
    category: 'nutrition',
    title: 'Lean Protein Sources',
    content: 'Choose chicken breast, turkey, tofu, or legumes. Lean proteins build muscle without excess saturated fat.',
    icon: '🍗'
  },
  {
    id: 29,
    category: 'nutrition',
    title: 'Hydration with Electrolytes',
    content: 'For intense sessions, add electrolytes to your water. Coconut water is a natural alternative to sports drinks.',
    icon: '🥥'
  },
  {
    id: 30,
    category: 'nutrition',
    title: 'Whole Grain Energy',
    content: 'Opt for oatmeal, quinoa, or whole wheat. Complex carbs provide steady energy for consistent performance.',
    icon: '🌾'
  },
  {
    id: 31,
    category: 'nutrition',
    title: 'Avoid Processed Foods',
    content: 'Minimize sugary snacks and fast food. They cause energy crashes and hinder recovery.',
    icon: '🚫'
  },
  {
    id: 32,
    category: 'nutrition',
    title: 'Healthy Fats',
    content: 'Include avocados, nuts, and olive oil. These support hormone production and reduce inflammation.',
    icon: '🥑'
  },
  {
    id: 33,
    category: 'nutrition',
    title: 'Portion Control',
    content: 'Eat balanced portions throughout the day. Consistent fueling is better than large infrequent meals.',
    icon: '🍽️'
  },
  {
    id: 34,
    category: 'nutrition',
    title: 'Cherry Juice Benefits',
    content: 'Tart cherry juice may reduce muscle soreness and improve sleep quality. Try it post-workout.',
    icon: '🍒'
  },
  {
    id: 35,
    category: 'nutrition',
    title: 'Meal Prep Success',
    content: 'Prepare healthy meals in advance. Having nutritious options ready prevents poor food choices when tired.',
    icon: '📦'
  },

  // Motivation (10 tips)
  {
    id: 36,
    category: 'motivation',
    title: 'Track Your Progress',
    content: 'Keep a workout journal or use this app daily. Seeing your improvements over time is incredibly motivating.',
    icon: '📊'
  },
  {
    id: 37,
    category: 'motivation',
    title: 'Set Micro Goals',
    content: 'Break big goals into small weekly targets. Achieving mini-milestones builds momentum and confidence.',
    icon: '🎯'
  },
  {
    id: 38,
    category: 'motivation',
    title: 'Celebrate Small Wins',
    content: 'Did one more rep than last time? That\'s progress! Acknowledge every improvement, no matter how small.',
    icon: '🎉'
  },
  {
    id: 39,
    category: 'motivation',
    title: 'Consistency Over Intensity',
    content: 'Doing 10 push-ups daily beats doing 100 once a month. Show up consistently, even on tough days.',
    icon: '📅'
  },
  {
    id: 40,
    category: 'motivation',
    title: 'Find Your Why',
    content: 'Connect with your deeper reason for training. Whether health, strength, or confidence—remember your purpose.',
    icon: '❤️'
  },
  {
    id: 41,
    category: 'motivation',
    title: 'Visualization Technique',
    content: 'Before workouts, visualize yourself succeeding. Mental rehearsal improves actual physical performance.',
    icon: '🧠'
  },
  {
    id: 42,
    category: 'motivation',
    title: 'Workout Playlist',
    content: 'Create an energizing music playlist. The right songs can boost performance by up to 15%.',
    icon: '🎵'
  },
  {
    id: 43,
    category: 'motivation',
    title: 'Share Your Journey',
    content: 'Tell friends about your goals or post progress updates. Social accountability increases commitment.',
    icon: '🤝'
  },
  {
    id: 44,
    category: 'motivation',
    title: 'Embrace the Process',
    content: 'Fitness is a marathon, not a sprint. Trust the process and enjoy becoming stronger each day.',
    icon: '🏃'
  },
  {
    id: 45,
    category: 'motivation',
    title: 'Morning Momentum',
    content: 'Try working out first thing in the morning. It energizes your day and ensures you don\'t skip it later.',
    icon: '🌅'
  },

  // Additional Mixed Tips (5 tips)
  {
    id: 46,
    category: 'technique',
    title: 'Negative Reps',
    content: 'Focus on slow, controlled lowering (5 seconds). Eccentric training builds serious strength.',
    icon: '⬇️'
  },
  {
    id: 47,
    category: 'nutrition',
    title: 'Caffeine Timing',
    content: 'A cup of coffee 30-60 minutes pre-workout can enhance performance. But avoid it close to bedtime.',
    icon: '☕'
  },
  {
    id: 48,
    category: 'recovery',
    title: 'Meditation for Recovery',
    content: 'Try 10 minutes of meditation daily. It reduces stress hormones that can impede muscle recovery.',
    icon: '🧘‍♂️'
  },
  {
    id: 49,
    category: 'motivation',
    title: 'Before/After Photos',
    content: 'Take monthly progress photos. Visual changes often appear before strength gains, keeping you motivated.',
    icon: '📸'
  },
  {
    id: 50,
    category: 'form',
    title: 'Mind-Muscle Connection',
    content: 'Focus on feeling your muscles work during each rep. This conscious engagement maximizes muscle activation.',
    icon: '🎯'
  }
];

// Get a tip based on workout count (ensures different tips each time)
export const getTipForWorkout = (workoutCount: number): WorkoutTip => {
  const index = workoutCount % WORKOUT_TIPS.length;
  return WORKOUT_TIPS[index];
};

// Get a random tip
export const getRandomTip = (): WorkoutTip => {
  const index = Math.floor(Math.random() * WORKOUT_TIPS.length);
  return WORKOUT_TIPS[index];
};

// Get category color for UI
export const getCategoryColor = (category: WorkoutTip['category']): string => {
  switch (category) {
    case 'form':
      return 'text-electric-blue';
    case 'recovery':
      return 'text-success';
    case 'nutrition':
      return 'text-warning';
    case 'motivation':
      return 'text-rank-mythic';
    case 'technique':
      return 'text-accent';
    default:
      return 'text-accent';
  }
};

// Get category background for UI
export const getCategoryBg = (category: WorkoutTip['category']): string => {
  switch (category) {
    case 'form':
      return 'bg-electric-blue/10 border-electric-blue/30';
    case 'recovery':
      return 'bg-success/10 border-success/30';
    case 'nutrition':
      return 'bg-warning/10 border-warning/30';
    case 'motivation':
      return 'bg-rank-mythic/10 border-rank-mythic/30';
    case 'technique':
      return 'bg-accent/10 border-accent/30';
    default:
      return 'bg-accent/10 border-accent/30';
  }
};
