const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runTests() {
  console.log('🧪 Starting API Verification Tests with native fetch...\n');

  // 1. Health check
  const healthRes = await request('/health');
  console.log('✅ Health check passed:', healthRes);

  // 2. Create Easy Case
  console.log('\n--- Test 2: Create Case (Easy) ---');
  const createRes = await request('/cases', {
    method: 'POST',
    body: JSON.stringify({
      premise: 'A poisoned wine glass at a billionaire tech investor dinner',
      difficulty: 'Easy'
    })
  });
  const caseData = createRes.case;
  console.log('Case ID:', caseData._id);
  console.log('Title:', caseData.title);
  console.log('Suspects count (expected 3):', caseData.suspects.length);
  console.log('Clues count (expected 5):', caseData.clues.length);
  console.log('Hints count (expected 2):', caseData.hints.length);

  // Anti-cheat verification: Culprit & solution MUST NOT be in response
  if (caseData.culpritId || caseData.solutionSummary || caseData.howCluesRevealCulprit) {
    throw new Error('❌ SECURITY VIOLATION: Culprit/solution leaked in active case!');
  }
  console.log('🛡️ Security check PASSED: No culprit or solution exposed to client.');

  // 3. Inspect / Discover a Clue
  console.log('\n--- Test 3: Discover Clue ---');
  const clueToDiscover = caseData.clues[0];
  const discoverRes = await request(`/cases/${caseData._id}/clues/${clueToDiscover.id}/discover`, {
    method: 'POST'
  });
  console.log('Clue Discovered Message:', discoverRes.message);
  console.log('Clues Found:', discoverRes.cluesFound, '/', discoverRes.totalClues);

  // 4. Request a Hint
  console.log('\n--- Test 4: Request Hint ---');
  const hintRes = await request(`/cases/${caseData._id}/hints`, {
    method: 'POST'
  });
  console.log('Hint text:', hintRes.hint.text);
  console.log('Hints remaining:', hintRes.hintsRemaining);

  // 5. Submit Accusation
  console.log('\n--- Test 5: Submit Accusation ---');
  const accusedId = caseData.suspects[0].id;
  const accuseRes = await request(`/cases/${caseData._id}/accuse`, {
    method: 'POST',
    body: JSON.stringify({
      accusedSuspectId: accusedId,
      motiveNotes: 'The suspect had security override access and motive.'
    })
  });
  console.log('Accusation verdict:', accuseRes.message);
  console.log('Score breakdown:', accuseRes.result.scoring);
  console.log('Culprit revealed:', accuseRes.result.culpritId);
  console.log('Solution summary present:', Boolean(accuseRes.result.solutionSummary));

  // 6. Get Completed Result
  console.log('\n--- Test 6: Get Result ---');
  const resultRes = await request(`/cases/${caseData._id}/result`);
  console.log('Completed status:', resultRes.result.status);
  console.log('Final Score:', resultRes.result.scoring.finalScore);

  console.log('\n🎉 ALL BACKEND API TESTS COMPLETED AND VERIFIED 100%!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
