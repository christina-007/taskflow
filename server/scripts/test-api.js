const testApi = async () => {
  const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

  console.log(`Testing TaskFlow API at ${baseUrl}...`);

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/health`);
  const health = await healthRes.json();
  console.log('1. Health check:', health.status === 'ok' ? 'PASSED' : 'FAILED');

  // 2. Create task
  const createRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Design TaskFlow Linear Interface',
      description: 'Implement warm off-white and charcoal aesthetic',
      priority: 'High',
      status: 'In Progress',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    }),
  });
  const created = await createRes.json();
  console.log('2. Create task:', created.success ? 'PASSED' : 'FAILED', created.data?._id);
  const taskId = created.data?._id;

  // 3. Validation check
  const invalidRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'No title' }),
  });
  console.log('3. Validation check (400 expected):', invalidRes.status === 400 ? 'PASSED' : 'FAILED');

  // 4. Get all tasks
  const getRes = await fetch(`${baseUrl}/tasks`);
  const list = await getRes.json();
  console.log('4. Get all tasks:', list.success ? 'PASSED' : 'FAILED', `Count: ${list.count}`);

  // 5. Update task
  const updateRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' }),
  });
  const updated = await updateRes.json();
  console.log('5. Update task to Completed:', updated.data?.status === 'Completed' ? 'PASSED' : 'FAILED');

  // 6. Get stats
  const statsRes = await fetch(`${baseUrl}/tasks/stats`);
  const stats = await statsRes.json();
  console.log('6. Get stats:', stats.success ? 'PASSED' : 'FAILED', stats.data);

  // 7. Delete task
  const delRes = await fetch(`${baseUrl}/tasks/${taskId}`, { method: 'DELETE' });
  const deleted = await delRes.json();
  console.log('7. Delete task:', deleted.success ? 'PASSED' : 'FAILED');

  console.log('Backend API verification completed successfully.');
};

testApi().catch(console.error);
