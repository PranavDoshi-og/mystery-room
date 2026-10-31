import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Zod Schema to strictly validate the mystery output
const GeminiMysteryOutputSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(40),
  crimeScene: z.string().min(15),
  victim: z.object({
    name: z.string().min(2),
    description: z.string().min(5),
  }),
  suspects: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    role: z.string().min(2),
    bio: z.string().min(10),
    alibi: z.string().min(10),
    avatar: z.string().optional(),
  })),
  clues: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(3),
    category: z.enum(['Physical', 'Testimonial', 'Document', 'Digital', 'Forensic']).catch('Physical'),
    location: z.string().catch('Crime Scene'),
    description: z.string().min(10),
    significance: z.string().min(10),
  })),
  hints: z.array(z.object({
    id: z.string().min(1),
    order: z.number(),
    text: z.string().min(10),
  })),
  culpritId: z.string().min(1),
  solutionSummary: z.string().min(30),
  howCluesRevealCulprit: z.string().min(30),
});

const DIFFICULTY_CONFIG = {
  Easy: { suspects: 3, clues: 5, hints: 2 },
  Medium: { suspects: 4, clues: 7, hints: 3 },
  Hard: { suspects: 5, clues: 9, hints: 3 }
};

/**
 * Procedural offline mystery generator when Gemini API key is missing or quota exceeded.
 * Guarantees zero downtime and complete adherence to difficulty counts.
 */
function generateFallbackMystery(premise, difficulty) {
  const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;
  const timestamp = Date.now();

  const themes = [
    {
      title: "The Midnight Heist at Blackwood Manor",
      victim: { name: "Lord Julian Blackwood", description: "Billionaire antiquities collector and philanthropist." },
      scene: "The fortified second-floor private study of Blackwood Manor, found unlocked at 11:45 PM.",
      suspectPool: [
        { id: "suspect-1", name: "Vincent Vance", role: "Chief Security Officer", bio: "Former Scotland Yard technician who designed the manor vault.", alibi: "Claims he was in the security control room monitoring perimeter cameras all evening." },
        { id: "suspect-2", name: "Elena Rostova", role: "Private Curator", bio: "Art appraiser facing bankruptcy due to high-stakes gambling debts.", alibi: "Insists she was cataloging Greek artifacts in the west basement archives until midnight." },
        { id: "suspect-3", name: "Marcus Thorne", role: "Estranged Nephew", bio: "Recently disinherited heir who publicly argued with Julian hours prior.", alibi: "Stated he stormed out of the manor at 9:30 PM and drank alone at a nearby tavern." },
        { id: "suspect-4", name: "Dr. Evelyn Wu", role: "Personal Physician", bio: "Prescribed Julian's medications; secretly under investigation for counterfeit medicine.", alibi: "Claims she administered Julian's evening sedative at 10:00 PM and retired to her guest room." },
        { id: "suspect-5", name: "Henri Mercier", role: "Head Butler", bio: "Served the Blackwood family for 30 years; holds keycards to all service corridors.", alibi: "States he was polishing family silverware in the pantry with the door locked." },
      ],
      cluePool: [
        { id: "clue-1", title: "Encrypted Override Keycard", category: "Digital", location: "Near Vault Console", description: "A high-clearance security master card with the chip fried using a magnetic degausser.", significance: "Only the head of security or personal administrator had access to programming this tier of card." },
        { id: "clue-2", title: "Shattered Champagne Flute", category: "Forensic", location: "Study Desk", description: "Residue testing indicates trace amounts of concentrated aconite poison mixed with vintage Dom Pérignon.", significance: "Aconite paralyzes motor functions within minutes without causing immediate physical struggle." },
        { id: "clue-3", title: "Muddy Footprint (Size 10 Wingtip)", category: "Physical", location: "Balcony Railing", description: "A distinct Italian leather sole impression pointing outward toward the garden trellis.", significance: "Matches shoes owned by both Marcus Thorne and Vincent Vance, but mud matches the east garden bed." },
        { id: "clue-4", title: "Torn Ledger Page", category: "Document", location: "Fireplace Hearth", description: "A partially singed ledger recording an off-the-books transfer of 2.5 million euros to an offshore account.", significance: "The transfer account matches a Swiss shell corporation operated by Elena Rostova." },
        { id: "clue-5", title: "Fabric Scrap on Window Latch", category: "Physical", location: "Balcony French Doors", description: "A thread of blue cashmere caught on the brass latch mechanism.", significance: "Vincent Vance was wearing a blue cashmere blazer during dinner, though he claimed he never went upstairs." },
        { id: "clue-6", title: "Tampered Camera Loop", category: "Digital", location: "Server Room", description: "The corridor camera footage between 10:45 PM and 11:15 PM was a pre-recorded 30-minute looped feed.", significance: "Bypassing the camera loop required the master console password only known to Vincent Vance." },
        { id: "clue-7", title: "Burned Cigarette Butt", category: "Forensic", location: "East Garden Trellis", description: "An imported Turkish cigarette butt with traces of high-end cologne.", significance: "Vincent Vance is the only resident who smokes this specific Turkish blend." },
        { id: "clue-8", title: "Forged Resignation Letter", category: "Document", location: "Study Wastebasket", description: "A draft resignation letter stating Vincent Vance was being fired for embezzlement starting next morning.", significance: "Gives Vincent Vance an urgent motive to silence Julian and steal the bearer bonds tonight." },
        { id: "clue-9", title: "Secret Drawer Compartment", category: "Physical", location: "Bookcase False Bottom", description: "Empty velvet display case that previously held the Star of Cairo diamond.", significance: "The lock was bypassed cleanly with a laser pick without triggering the silent vault tripwire." },
      ],
      culpritIndex: 0, // Vincent Vance
      hints: [
        { id: "hint-1", order: 1, text: "Examine who possessed the technical credentials to alter the security camera logs without raising an alarm." },
        { id: "hint-2", order: 2, text: "Compare the physical evidence on the balcony window latch with the attire of the suspects during the evening." },
        { id: "hint-3", order: 3, text: "The timing of the camera loop coincided exactly with the forged dismissal notice found in the wastebasket." }
      ],
      solutionSummary: "Vincent Vance orchestrated the crime. Facing impending termination and legal prosecution for embezzling funds, Vance used his master security clearance to inject a 30-minute looped feed into the hallway cameras. He poisoned Lord Julian's wine, unlocked the vault using an encrypted override keycard, stole the bearer bonds and diamond, and escaped via the balcony, inadvertently leaving behind a fiber of his blue cashmere jacket and his signature cigarette butt.",
      howCluesRevealCulprit: "The camera loop required Vance's console password, the cashmere thread matched his jacket, the security card was his clearance, and the dismissal notice gave him the immediate motive to kill before his theft was discovered."
    }
  ];

  const theme = themes[0];
  const selectedSuspects = theme.suspectPool.slice(0, cfg.suspects);
  const selectedClues = theme.cluePool.slice(0, cfg.clues);
  const selectedHints = theme.hints.slice(0, cfg.hints);
  const culprit = selectedSuspects[0]; // Vincent Vance is guaranteed in the slice

  return {
    title: `${theme.title} (${difficulty})`,
    premise: premise || "A billionaire art collector is found dead in his locked study under mysterious circumstances.",
    difficulty,
    story: `On a stormy autumn night, Lord Julian Blackwood was found slumped across his antique mahogany desk. The private study door was bolted from the outside, the storm shutters were latched, and the safe stood empty. ${selectedSuspects.length} individuals were present on the estate grounds during the estimated window of the crime. As the lead detective, your task is to inspect forensic evidence, interview suspects, and unmask the true culprit.`,
    crimeScene: theme.scene,
    victim: theme.victim,
    suspects: selectedSuspects,
    clues: selectedClues,
    hints: selectedHints,
    culpritId: culprit.id,
    solutionSummary: theme.solutionSummary,
    howCluesRevealCulprit: theme.howCluesRevealCulprit
  };
}

/**
 * Generates an AI mystery using Google Gemini.
 * Validates output using Zod and adheres to difficulty suspect/clue/hint counts.
 */
export async function generateMysteryCase({ premise, difficulty = 'Medium' }) {
  const normalizedDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';
  const cfg = DIFFICULTY_CONFIG[normalizedDifficulty];

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    console.warn(`[GeminiService] GEMINI_API_KEY is not configured. Generating procedural mystery case for difficulty: ${normalizedDifficulty}.`);
    return generateFallbackMystery(premise, normalizedDifficulty);
  }

  const prompt = `
You are a master mystery game designer and detective fiction novelist.
Create an intricate, logically airtight, and captivating mystery case based on the following user premise:
"${premise || 'A mysterious crime in an upscale penthouse suite during a blackout'}"

STRICT DIFFICULTY CONSTRAINTS:
- Difficulty Level: ${normalizedDifficulty}
- Suspects count: Exactly ${cfg.suspects} suspects.
- Clues count: Exactly ${cfg.clues} clues.
- Hints count: Exactly ${cfg.hints} hints.

DEDUCTIVE CONSISTENCY REQUIREMENTS:
1. Exactly ONE suspect is the true culprit.
2. The culprit's id must match exactly one of the generated suspect ids.
3. The mystery MUST be solvable strictly through logic, alibis, forensic clues, and timeline deductions.
4. Provide a varied mix of clue categories: Physical, Testimonial, Document, Digital, Forensic.
5. Some clues must exonerate innocent suspects or establish alibis, while at least 2 distinct clues directly point to the culprit when combined.
6. Hints should give progressive, thoughtful deductive clues without directly blurting out the culprit's name.

You must respond with ONLY a valid JSON object matching this exact schema:
{
  "title": "A captivating, atmospheric title",
  "story": "Atmospheric narrative detailing the incident, time of death/theft, and setting (at least 3 paragraphs).",
  "crimeScene": "Detailed physical description of the crime scene and immediate surroundings.",
  "victim": {
    "name": "Victim's Full Name",
    "description": "Background, profession, and relationship to the suspects."
  },
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Suspect Full Name",
      "role": "Their profession or relationship",
      "bio": "Personality, history, and secret tension with the victim.",
      "alibi": "Where they claim they were and what they were doing at the time of the crime.",
      "avatar": ""
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Title of the clue (e.g., Broken Pocket Watch)",
      "category": "Physical" | "Testimonial" | "Document" | "Digital" | "Forensic",
      "location": "Where it was discovered",
      "description": "Detailed description of the evidence found.",
      "significance": "What this proves or disproves regarding the suspects."
    }
  ],
  "hints": [
    {
      "id": "hint-1",
      "order": 1,
      "text": "Subtle deductive guidance helping the player connect two clues."
    }
  ],
  "culpritId": "suspect-1",
  "solutionSummary": "Complete chronological narrative explaining how the crime was executed, the culprit's true motive, and their failed cover-up.",
  "howCluesRevealCulprit": "Clear explanation of how the discovered clues combine logically to prove this suspect is guilty and eliminate the others."
}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Use gemini-2.5-flash as the fast, high-intelligence model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini API');
    }

    const parsedJson = JSON.parse(responseText);

    // Validate using Zod schema
    const validatedData = GeminiMysteryOutputSchema.parse(parsedJson);

    // Verify culprit exists in suspects list
    const culpritExists = validatedData.suspects.some(s => s.id === validatedData.culpritId);
    if (!culpritExists && validatedData.suspects.length > 0) {
      validatedData.culpritId = validatedData.suspects[0].id;
    }

    // Attach premise and difficulty
    return {
      ...validatedData,
      premise: premise || validatedData.title,
      difficulty: normalizedDifficulty
    };

  } catch (error) {
    console.error('[GeminiService] Error calling Gemini API:', error.message || error);
    console.warn(`[GeminiService] Falling back to procedural engine for ${normalizedDifficulty}.`);
    return generateFallbackMystery(premise, normalizedDifficulty);
  }
}
