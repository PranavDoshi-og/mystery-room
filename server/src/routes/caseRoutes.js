import express from 'express';
import {
  createCase,
  getCase,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult
} from '../controllers/caseController.js';
import { MysteryCase } from '../models/MysteryCase.js';

const router = express.Router();

// Retrieve recent public case archives (sanitized)
router.get('/', async (req, res) => {
  try {
    const recentCases = await MysteryCase.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title premise difficulty status scoring createdAt');

    return res.json({
      success: true,
      cases: recentCases
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Generate a new mystery case
router.post('/', createCase);

// Get single case details (sanitized while investigating)
router.get('/:id', getCase);

// Inspect and discover clue (+5 points)
router.post('/:id/clues/:clueId/discover', discoverClue);

// Unlock hint (-10 points penalty)
router.post('/:id/hints', requestHint);

// Submit accusation & calculate final score
router.post('/:id/accuse', submitAccusation);

// Get final case result (only if completed)
router.get('/:id/result', getCaseResult);

export default router;

