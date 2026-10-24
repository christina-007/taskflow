const baseUrl = 'http://localhost:5000/api';

async function runAuthTests() {
  console.log('--- Starting Authentication & User Isolation Verification Suite ---');

  // 1. Unauthenticated access check (Must fail with 401)
  const unauthRes = await fetch(`${baseUrl}/tasks`);
  const unauthData = await unauthRes.json();
  console.log(
    '1. Access /api/tasks without token (401 Expected):',
    unauthRes.status === 401 ? 'PASSED' : 'FAILED',
    `Status: ${unauthRes.status}, Message: "${unauthData.message}"`
  );

  // 2. Register User 1 (Alice)
  const user1Email = `alice_${Date.now()}@example.com`;
  const reg1Res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alice Smith',
      email: user1Email,
      password: 'password123',
    }),
  });
  const reg1Data = await reg1Res.json();
  console.log(
    '2. Register User 1 (Alice) (201 Expected):',
    reg1Res.status === 201 ? 'PASSED' : 'FAILED',
    `Status: ${reg1Res.status}, User ID: ${reg1Data.user?._id}, Token: ${reg1Data.token ? 'Received' : 'None'}`
  );
  if (reg1Res.status !== 201) console.error('Register 1 error:', reg1Data);
  const tokenAlice = reg1Data.token;

  // 3. Test duplicate registration (Must fail with 400)
  const dupRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alice Duplicate',
      email: user1Email,
      password: 'password123',
    }),
  });
  const dupData = await dupRes.json();
  console.log(
    '3. Duplicate Registration Check (400 Expected):',
    dupRes.status === 400 ? 'PASSED' : 'FAILED',
    `Status: ${dupRes.status}, Message: "${dupData.message}"`
  );

  // 4. Test Login with wrong password (Must fail with 401)
  const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user1Email,
      password: 'wrong_password',
    }),
  });
  const wrongPassData = await wrongPassRes.json();
  console.log(
    '4. Invalid Password Check (401 Expected):',
    wrongPassRes.status === 401 ? 'PASSED' : 'FAILED',
    `Status: ${wrongPassRes.status}, Message: "${wrongPassData.message}"`
  );

  // 5. Test Login with correct password (200 Expected)
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user1Email,
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  console.log(
    '5. Login User 1 Check (200 Expected):',
    loginRes.status === 200 ? 'PASSED' : 'FAILED',
    `Status: ${loginRes.status}, User: ${loginData.user?.name}`
  );

  // 6. Register User 2 (Bob)
  const user2Email = `bob_${Date.now()}@example.com`;
  const reg2Res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bob Jones',
      email: user2Email,
      password: 'password456',
    }),
  });
  const reg2Data = await reg2Res.json();
  console.log(
    '6. Register User 2 (Bob) (201 Expected):',
    reg2Res.status === 201 ? 'PASSED' : 'FAILED',
    `Status: ${reg2Res.status}, User ID: ${reg2Data.user?._id}`
  );
  const tokenBob = reg2Data.token;

  // 7. Alice creates Task A
  const aliceTaskRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAlice}`,
    },
    body: JSON.stringify({
      title: "Alice's Secret Strategy Document",
      description: 'Confidential strategy for Q4',
      priority: 'High',
      status: 'In Progress',
    }),
  });
  const aliceTask = await aliceTaskRes.json();
  console.log(
    "7. Alice Creates Task A (201 Expected):",
    aliceTaskRes.status === 201 ? 'PASSED' : 'FAILED',
    `Status: ${aliceTaskRes.status}, Task ID: ${aliceTask.data?._id}`
  );
  const aliceTaskId = aliceTask.data?._id;

  // 8. Bob creates Task B
  const bobTaskRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenBob}`,
    },
    body: JSON.stringify({
      title: "Bob's Financial Budget Plan",
      description: 'Private financial forecast',
      priority: 'Medium',
      status: 'Pending',
    }),
  });
  const bobTask = await bobTaskRes.json();
  console.log(
    "8. Bob Creates Task B (201 Expected):",
    bobTaskRes.status === 201 ? 'PASSED' : 'FAILED',
    `Status: ${bobTaskRes.status}, Task ID: ${bobTask.data?._id}`
  );
  const bobTaskId = bobTask.data?._id;

  // 9. Cross-User Read Isolation: Bob tries to fetch Alice's task directly (Must return 404)
  const crossReadRes = await fetch(`${baseUrl}/tasks/${aliceTaskId}`, {
    headers: { Authorization: `Bearer ${tokenBob}` },
  });
  console.log(
    "9. Cross-User Direct Read Isolation (404 Expected):",
    crossReadRes.status === 404 ? 'PASSED' : 'FAILED',
    `Status: ${crossReadRes.status}`
  );

  // 10. Cross-User Update Isolation: Bob tries to update Alice's task (Must return 404)
  const crossUpdateRes = await fetch(`${baseUrl}/tasks/${aliceTaskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenBob}`,
    },
    body: JSON.stringify({ title: 'Hacked by Bob' }),
  });
  console.log(
    "10. Cross-User Update Isolation (404 Expected):",
    crossUpdateRes.status === 404 ? 'PASSED' : 'FAILED',
    `Status: ${crossUpdateRes.status}`
  );

  // 11. Cross-User Delete Isolation: Bob tries to delete Alice's task (Must return 404)
  const crossDeleteRes = await fetch(`${baseUrl}/tasks/${aliceTaskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenBob}` },
  });
  console.log(
    "11. Cross-User Delete Isolation (404 Expected):",
    crossDeleteRes.status === 404 ? 'PASSED' : 'FAILED',
    `Status: ${crossDeleteRes.status}`
  );

  // 12. List Isolation: Bob lists his tasks (should NOT contain Alice's task)
  const bobListRes = await fetch(`${baseUrl}/tasks`, {
    headers: { Authorization: `Bearer ${tokenBob}` },
  });
  const bobList = await bobListRes.json();
  const bobHasAliceTask = bobList.data?.some((t) => t._id === aliceTaskId);
  console.log(
    "12. Bob's Task List Isolation (Must NOT contain Alice's tasks):",
    !bobHasAliceTask ? 'PASSED' : 'FAILED',
    `Bob has ${bobList.count} task(s)`
  );

  // 13. Invalid Token Check (Must fail with 401)
  const invalidTokenRes = await fetch(`${baseUrl}/tasks`, {
    headers: { Authorization: 'Bearer invalid.tampered.token' },
  });
  console.log(
    '13. Tampered Token Verification (401 Expected):',
    invalidTokenRes.status === 401 ? 'PASSED' : 'FAILED',
    `Status: ${invalidTokenRes.status}`
  );

  console.log('--- All Authentication & Isolation Tests Finished ---');
}

runAuthTests().catch(console.error);
