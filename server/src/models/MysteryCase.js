import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  alibi: { type: String, required: true },
  avatar: { type: String, default: '' },
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Physical', 'Testimonial', 'Document', 'Digital', 'Forensic'],
    default: 'Physical'
  },
  location: { type: String, default: 'Crime Scene' },
  description: { type: String, required: true },
  significance: { type: String, required: true },
  isDiscovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null },
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: true },
  text: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date, default: null },
}, { _id: false });

const MysteryCaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
  },
  story: { type: String, required: true },
  crimeScene: { type: String, required: true },
  victim: {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],

  // SECURITY SENSITIVE FIELDS: Hidden from frontend until accusation
  culpritId: { type: String, required: true },
  solutionSummary: { type: String, required: true },
  howCluesRevealCulprit: { type: String, required: true },

  // GAMEPLAY STATE
  status: { 
    type: String, 
    enum: ['investigating', 'completed'], 
    default: 'investigating' 
  },
  accusation: {
    accusedSuspectId: { type: String, default: null },
    accusedSuspectName: { type: String, default: null },
    motiveNotes: { type: String, default: '' },
    isCorrect: { type: Boolean, default: null },
    accusedAt: { type: Date, default: null },
  },
  scoring: {
    basePoints: { type: Number, default: 0 },
    cluesDiscoveredCount: { type: Number, default: 0 },
    cluesBonus: { type: Number, default: 0 },
    hintsUsedCount: { type: Number, default: 0 },
    hintsPenalty: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
  }
}, { 
  timestamps: true 
});

/**
 * Returns a sanitized projection of the case for client consumption.
 * Strictly guarantees culpritId and solution narrative are NEVER exposed
 * while the case status is 'investigating'.
 */
MysteryCaseSchema.methods.toSanitizedJSON = function() {
  const caseObj = this.toObject();

  if (caseObj.status === 'completed') {
    // Once solved, provide full reveal including culprit, explanation, and solution
    return caseObj;
  }

  // Active investigation: Remove all spoiler fields
  delete caseObj.culpritId;
  delete caseObj.solutionSummary;
  delete caseObj.howCluesRevealCulprit;

  // Mask undiscovered clue details to reward active inspection
  caseObj.clues = caseObj.clues.map(clue => {
    if (clue.isDiscovered) {
      return clue;
    }
    return {
      id: clue.id,
      title: clue.title,
      category: clue.category,
      location: clue.location,
      isDiscovered: false,
      discoveredAt: null,
      description: "Classified forensic evidence. Inspect this clue to uncover detailed findings.",
      significance: "Hidden until inspected."
    };
  });

  // Mask unused hints
  caseObj.hints = caseObj.hints.map(hint => {
    if (hint.isUsed) {
      return hint;
    }
    return {
      id: hint.id,
      order: hint.order,
      isUsed: false,
      usedAt: null,
      text: "Locked hint. Request this hint if you need deductive assistance (-10 pts penalty)."
    };
  });

  return caseObj;
};

export const MysteryCase = mongoose.model('MysteryCase', MysteryCaseSchema);

