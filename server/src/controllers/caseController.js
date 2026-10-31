import { MysteryCase } from '../models/MysteryCase.js';
import { generateMysteryCase } from '../services/geminiService.js';

const BASE_POINTS_BY_DIFFICULTY = {
  Easy: 100,
  Medium: 150,
  Hard: 200
};

/**
 * POST /api/cases
 * Generate a new mystery case using Gemini and store in DB
 */
export async function createCase(req, res) {
  try {
    const { premise, difficulty = 'Medium' } = req.body;

    // Generate mystery data via Gemini with strict structured schema
    const caseData = await generateMysteryCase({ premise, difficulty });

    // Create MongoDB document
    const mystery = new MysteryCase(caseData);
    await mystery.save();

    // Return sanitized case to client (no culprit / solution)
    return res.status(201).json({
      success: true,
      case: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:createCase] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate mystery case'
    });
  }
}

/**
 * GET /api/cases/:id
 * Retrieve active sanitized mystery case
 */
export async function getCase(req, res) {
  try {
    const { id } = req.params;
    const mystery = await MysteryCase.findById(id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case file not found'
      });
    }

    return res.json({
      success: true,
      case: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:getCase] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case file'
    });
  }
}

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Mark a clue as discovered and award +5 points
 */
export async function discoverClue(req, res) {
  try {
    const { id, clueId } = req.params;
    const mystery = await MysteryCase.findById(id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case file not found'
      });
    }

    if (mystery.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Case investigation is already closed'
      });
    }

    const clue = mystery.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({
        success: false,
        message: 'Clue not found in this case file'
      });
    }

    if (!clue.isDiscovered) {
      clue.isDiscovered = true;
      clue.discoveredAt = new Date();
      await mystery.save();
    }

    const discoveredCount = mystery.clues.filter(c => c.isDiscovered).length;

    return res.json({
      success: true,
      message: 'Clue forensic details revealed (+5 pts)',
      clue,
      cluesFound: discoveredCount,
      totalClues: mystery.clues.length,
      case: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:discoverClue] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect clue'
    });
  }
}

/**
 * POST /api/cases/:id/hints
 * Unlock the next sequential hint (-10 points penalty)
 */
export async function requestHint(req, res) {
  try {
    const { id } = req.params;
    const mystery = await MysteryCase.findById(id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case file not found'
      });
    }

    if (mystery.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Case investigation is already closed'
      });
    }

    // Find the next unused hint in order
    const nextHint = mystery.hints
      .sort((a, b) => a.order - b.order)
      .find(h => !h.isUsed);

    if (!nextHint) {
      return res.status(400).json({
        success: false,
        message: 'All available hints have already been unlocked'
      });
    }

    nextHint.isUsed = true;
    nextHint.usedAt = new Date();
    await mystery.save();

    const hintsRemaining = mystery.hints.filter(h => !h.isUsed).length;

    return res.json({
      success: true,
      message: 'Deductive hint unlocked (-10 pts penalty)',
      hint: nextHint,
      hintsRemaining,
      totalHints: mystery.hints.length,
      case: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:requestHint] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to request hint'
    });
  }
}

/**
 * POST /api/cases/:id/accuse
 * Formally submit accusation, evaluate correctness, calculate final score,
 * seal case, and reveal true culprit & narrative explanation.
 */
export async function submitAccusation(req, res) {
  try {
    const { id } = req.params;
    const { accusedSuspectId, motiveNotes = '' } = req.body;

    if (!accusedSuspectId) {
      return res.status(400).json({
        success: false,
        message: 'An accused suspect ID must be selected'
      });
    }

    const mystery = await MysteryCase.findById(id);
    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case file not found'
      });
    }

    // If case is already completed, return existing verdict
    if (mystery.status === 'completed') {
      return res.json({
        success: true,
        message: 'Case was previously closed',
        result: mystery.toSanitizedJSON()
      });
    }

    // Verify suspect exists in this case
    const suspect = mystery.suspects.find(s => s.id === accusedSuspectId);
    if (!suspect) {
      return res.status(400).json({
        success: false,
        message: 'Selected suspect is not listed in this case file'
      });
    }

    // Evaluate verdict against secret culpritId
    const isCorrect = accusedSuspectId === mystery.culpritId;

    // Calculate score strictly on the backend
    const baseDifficultyScore = BASE_POINTS_BY_DIFFICULTY[mystery.difficulty] || 150;
    const basePoints = isCorrect ? baseDifficultyScore : 0;

    const cluesDiscoveredCount = mystery.clues.filter(c => c.isDiscovered).length;
    const cluesBonus = cluesDiscoveredCount * 5;

    const hintsUsedCount = mystery.hints.filter(h => h.isUsed).length;
    const hintsPenalty = hintsUsedCount * 10;

    const rawScore = basePoints + cluesBonus - hintsPenalty;
    const finalScore = Math.max(0, rawScore);

    // Save accusation details & scoring
    mystery.status = 'completed';
    mystery.accusation = {
      accusedSuspectId,
      accusedSuspectName: suspect.name,
      motiveNotes,
      isCorrect,
      accusedAt: new Date(),
    };
    mystery.scoring = {
      basePoints,
      cluesDiscoveredCount,
      cluesBonus,
      hintsUsedCount,
      hintsPenalty,
      finalScore
    };

    await mystery.save();

    return res.json({
      success: true,
      message: isCorrect ? 'Case Solved! Culprit successfully identified.' : 'Wrong suspect! Case remains unsolved.',
      result: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:submitAccusation] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record accusation'
    });
  }
}

/**
 * GET /api/cases/:id/result
 * Retrieve completed case results (Blocked if case is still under investigation)
 */
export async function getCaseResult(req, res) {
  try {
    const { id } = req.params;
    const mystery = await MysteryCase.findById(id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case file not found'
      });
    }

    if (mystery.status !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Case is still under active investigation. Submit an accusation to review final results.'
      });
    }

    return res.json({
      success: true,
      result: mystery.toSanitizedJSON()
    });
  } catch (error) {
    console.error('[CaseController:getCaseResult] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case results'
    });
  }
}
