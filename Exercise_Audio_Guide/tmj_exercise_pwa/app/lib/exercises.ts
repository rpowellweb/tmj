
export interface Exercise {
  id: number;
  name: string;
  shortName: string;
  description: string;
  instructions: string[];
  timing: {
    repetitions: number;
    holdDuration?: number; // in seconds
    isBreathing?: boolean;
    hasSides?: boolean; // for bilateral exercises
  };
  safetyNotes: string[];
  audioInstructions: {
    introduction: string;
    preparation: string;
    execution: string;
    hold?: string;
    completion: string;
  };
}

export const TMJ_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: "Deep Breathing with Tongue Position",
    shortName: "Tongue-to-Roof Breathing",
    description: "Hold tongue to roof of mouth with proper positioning while performing deep breathing",
    instructions: [
      "Place tongue tip just behind the teeth",
      "Hold tongue firmly against the roof of the mouth",
      "Take six deep breaths while maintaining tongue position"
    ],
    timing: {
      repetitions: 6,
      isBreathing: true
    },
    safetyNotes: [
      "Maintain tongue position throughout each breath cycle",
      "Breathe at natural rhythm between breaths"
    ],
    audioInstructions: {
      introduction: "Exercise 1: Deep Breathing with Tongue Position. This exercise helps establish proper tongue posture.",
      preparation: "Place your tongue tip just behind your teeth, then hold your tongue firmly against the roof of your mouth.",
      execution: "Take 6 deep breaths while maintaining tongue position. Breath number",
      completion: "Exercise 1 complete. Well done!"
    }
  },
  {
    id: 2,
    name: "Wide Mouth Opening with Tongue Support", 
    shortName: "Tongue-Stabilized Jaw Opening",
    description: "Open mouth widely while maintaining tongue position to prevent jaw clicking",
    instructions: [
      "Hold tongue to the roof of your mouth",
      "Open mouth widely",
      "Ensure jaw does not click during movement",
      "Close mouth slowly"
    ],
    timing: {
      repetitions: 6
    },
    safetyNotes: [
      "Jaw should not click - this indicates proper alignment",
      "Move slowly and with control",
      "Brief pause between repetitions"
    ],
    audioInstructions: {
      introduction: "Exercise 2: Wide Mouth Opening with Tongue Support. This prevents jaw clicking during movement.",
      preparation: "Hold your tongue to the roof of your mouth throughout this exercise.",
      execution: "Open your mouth widely, ensuring no clicking, then close slowly. Repetition",
      completion: "Exercise 2 complete. Remember - no clicking means proper alignment!"
    }
  },
  {
    id: 3,
    name: "Finger-Guided Jaw Alignment",
    shortName: "Bilateral Jaw Pressure Control", 
    description: "Use finger pressure on both sides to guide proper jaw alignment during opening",
    instructions: [
      "Place one finger on each side of jaw",
      "Apply equal pressure to both sides", 
      "Open jaw very slowly while maintaining pressure",
      "Do not allow jaw to click",
      "If jaw clicks, release and restart more slowly",
      "Close jaw with continued pressure guidance"
    ],
    timing: {
      repetitions: 6
    },
    safetyNotes: [
      "Equal pressure ensures correct alignment",
      "Clicking indicates need to slow down",
      "Very slow and controlled movement"
    ],
    audioInstructions: {
      introduction: "Exercise 3: Finger-Guided Jaw Alignment. Equal pressure on both sides ensures proper alignment.",
      preparation: "Place one finger on each side of your jaw. Apply equal pressure to both sides.",
      execution: "Open your jaw very slowly while maintaining equal pressure. No clicking allowed. Repetition",
      completion: "Exercise 3 complete. Equal pressure is key to proper alignment!"
    }
  },
  {
    id: 4,
    name: "Fist-Resistance Jaw Opening",
    shortName: "Chin Resistance Exercise",
    description: "Create resistance with fist under chin while opening jaw",
    instructions: [
      "Make a fist",
      "Place fist directly under chin",
      "Balance the weight of fist against chin", 
      "Gently try to open jaw against resistance",
      "Avoid allowing jaw to click",
      "Hold position",
      "Release and return to starting position"
    ],
    timing: {
      repetitions: 6,
      holdDuration: 6
    },
    safetyNotes: [
      "Try not to allow jaw to click during exercise",
      "Brief pause between repetitions"
    ],
    audioInstructions: {
      introduction: "Exercise 4: Fist-Resistance Jaw Opening. This strengthens your jaw muscles with controlled resistance.",
      preparation: "Make a fist and place it directly under your chin. Balance the weight against your chin.",
      execution: "Gently try to open your jaw against the resistance. Hold for 6 seconds. Repetition",
      hold: "Hold this position. Avoid clicking.",
      completion: "Exercise 4 complete. Great work building jaw strength!"
    }
  },
  {
    id: 5,
    name: "Side Jaw Pressure Exercise", 
    shortName: "Lateral Jaw Resistance",
    description: "Apply steady pressure to side of jaw below the hinge",
    instructions: [
      "Press fist against left side of jaw below the hinge",
      "Maintain steady, consistent pressure",
      "Hold position", 
      "Release",
      "Repeat on opposite (right) side of jaw"
    ],
    timing: {
      repetitions: 6,
      holdDuration: 6,
      hasSides: true
    },
    safetyNotes: [
      "Complete all repetitions on left side, then switch to right side",
      "Brief pause between repetitions and sides"
    ],
    audioInstructions: {
      introduction: "Exercise 5: Side Jaw Pressure Exercise. This works both left and right sides of your jaw.",
      preparation: "We'll start with the left side. Press your fist against the left side of your jaw below the hinge.",
      execution: "Maintain steady pressure and hold for 6 seconds. Left side, repetition",
      hold: "Hold steady pressure on the left side.",
      completion: "Exercise 5 complete. Both sides strengthened!"
    }
  },
  {
    id: 6,
    name: "Chin Retraction Exercise",
    shortName: "Double Chin Neck Stretch",
    description: "Create double chin position to stretch neck muscles", 
    instructions: [
      "Place one finger on chin",
      "Move chin backward as if making a double chin",
      "Feel tightness at the back of neck (this is normal and desired)",
      "Hold position",
      "Release and return to neutral position"
    ],
    timing: {
      repetitions: 6,
      holdDuration: 6
    },
    safetyNotes: [
      "Tightness at back of neck indicates proper execution",
      "Brief pause between repetitions"
    ],
    audioInstructions: {
      introduction: "Exercise 6: Chin Retraction Exercise. This final exercise stretches your neck muscles.",
      preparation: "Place one finger on your chin.",
      execution: "Move your chin backward creating a double chin. Feel the tightness at the back of your neck. Repetition",
      hold: "Hold this double chin position. The tightness you feel is normal and desired.",
      completion: "Exercise 6 complete. Excellent work! You've completed your full TMJ exercise session."
    }
  }
];

export const SESSION_SUMMARY = {
  totalExercises: 6,
  estimatedDuration: "1 minute",
  dailyFrequency: 6,
  minimumWeeks: 3,
  generalSafetyNote: "Remember: No jaw clicking during any exercise. If clicking occurs, slow down and restart."
};
