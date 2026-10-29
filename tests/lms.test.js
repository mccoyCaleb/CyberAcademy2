const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { app, db, pruneStaleCourseData } = require('../server.js');

function createTestStudent() {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `test-student-${suffix}@cyberacademy.edu`;
  const password = 'test-password-123';
  const userId = db.prepare(`
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, 'student')
  `).run(`test-student-${suffix}`, email, bcrypt.hashSync(password, 4)).lastInsertRowid;

  return {
    email,
    password,
    cleanup() {
      db.prepare('DELETE FROM assignment_progress WHERE student_id = ?').run(userId);
      db.prepare('DELETE FROM quiz_attempts WHERE student_id = ?').run(userId);
      db.prepare('DELETE FROM lesson_progress WHERE student_id = ?').run(userId);
      db.prepare('DELETE FROM activity_events WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM learning_sessions WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM enrollments WHERE student_id = ?').run(userId);
      db.prepare('DELETE FROM audit_logs WHERE actor_id = ?').run(userId);
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    }
  };
}

test('student login redirects to student dashboard', async () => {
  const agent = request.agent(app);
  const res = await agent
    .post('/login')
    .type('form')
    .send({ email: 'student@cyberacademy.edu', password: 'password123' });

  assert.equal(res.status, 302);
  assert.equal(res.headers.location, '/student/dashboard');
});

test('teacher login redirects to teacher dashboard', async () => {
  const agent = request.agent(app);
  const res = await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  assert.equal(res.status, 302);
  assert.equal(res.headers.location, '/teacher/dashboard');
});

test('student dashboard renders the blocky layout and accessible sliding menu', async () => {
  const student = createTestStudent();
  try {
    const agent = request.agent(app);
    await agent
      .post('/login')
      .type('form')
      .send({ email: student.email, password: student.password });

    const res = await agent.get('/student/dashboard');

    assert.equal(res.status, 200);
    assert.match(res.text, /id="dashboardSidebar" aria-label="Student navigation"/);
    assert.match(res.text, /aria-controls="dashboardSidebar" aria-expanded="true"/);
    assert.match(res.text, /class="sidebar-backdrop"[^>]*hidden/);
    assert.match(res.text, /Good to see you,/);
    assert.match(res.text, /sidebar-hidden/);
    assert.match(res.text, /event\.key === 'Escape'/);
    assert.doesNotMatch(res.text, /box-shadow\s*:|border-left\s*:|border-top\s*:/i);
    assert.match(res.text, /Enter the seven-character class code from your teacher/);
    assert.match(res.text, /action="\/student\/join-class"/);
  } finally {
    student.cleanup();
  }
});

test('demo student starts with no seeded completed lessons, quizzes, or assignments', () => {
  const demoStudent = db.prepare('SELECT id FROM users WHERE email = ?').get('student@cyberacademy.edu');
  assert.ok(demoStudent);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM lesson_progress WHERE student_id = ? AND status = 'completed'").get(demoStudent.id).count, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM quiz_attempts WHERE student_id = ?').get(demoStudent.id).count, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM assignment_progress WHERE student_id = ?').get(demoStudent.id).count, 0);
});

test('teacher dashboard renders the blocky layout and accessible sliding menu', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/teacher/dashboard');

  assert.equal(res.status, 200);
  assert.match(res.text, /id="dashboardSidebar" aria-label="Teacher navigation"/);
  assert.match(res.text, /aria-controls="dashboardSidebar" aria-expanded="true"/);
  assert.match(res.text, /class="sidebar-backdrop"[^>]*hidden/);
  assert.match(res.text, /Welcome back,/);
  assert.match(res.text, /sidebar-hidden/);
  assert.match(res.text, /event\.key === 'Escape'/);
  assert.doesNotMatch(res.text, /box-shadow\s*:|border-left\s*:|border-top\s*:/i);
});

test('protected teacher route rejects non-teacher users', async () => {
  const agent = request.agent(app);
  const res = await agent.get('/teacher/dashboard');

  assert.equal(res.status, 302);
  assert.match(res.headers.location || '', /\/login/);
});

test('login page renders shared portal', async () => {
  const res = await request(app).get('/login');
  assert.equal(res.status, 200);
  assert.match(res.text, /CyberAcademy/);
  assert.match(res.text, /Student and teacher access uses one secure portal/);
});

test('homepage and portal route account access to the server login', async () => {
  const homepage = await request(app).get('/');
  assert.equal(homepage.status, 200);
  assert.match(homepage.text, /href="\/login"/);
  assert.match(homepage.text, /href="\/student\/dashboard"/);
  assert.match(homepage.text, /href="\/teacher\/dashboard"/);

  const portal = await request(app).get('/portal.html');
  assert.equal(portal.status, 200);
  assert.match(portal.text, /href="\/login"/);
});

test('student lesson page includes notes without the activity checklist', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'student@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/student/lessons/u1-1');

  assert.equal(res.status, 200);
  assert.match(res.text, /Original notes/i);
  assert.doesNotMatch(res.text, /Activity checklist/i);
  assert.doesNotMatch(res.text, /Track what you completed/i);
  assert.match(res.text, /Mark as complete/i);
});

test('stale units not in the course catalog are removed from the database', () => {
  const course = db.prepare('SELECT id FROM courses ORDER BY id LIMIT 1').get();
  const staleUnit = db.prepare('SELECT id FROM units WHERE code = ?').get('Unit 6');

  if (!staleUnit) {
    db.prepare('INSERT INTO units (course_id, code, title, description, sort_order, published) VALUES (?, ?, ?, ?, ?, 1)')
      .run(course.id, 'Unit 6', 'big black men', 'stale test data', 99);
  }

  pruneStaleCourseData();

  const result = db.prepare('SELECT COUNT(*) AS count FROM units WHERE code = ?').get('Unit 6');
  assert.equal(result.count, 0);
});

test('teacher curriculum page includes course/unit/module selection controls', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/teacher/curriculum');

  assert.equal(res.status, 200);
  assert.match(res.text, /Course/i);
  assert.match(res.text, /Unit/i);
  assert.match(res.text, /Module/i);
  assert.match(res.text, /Publish selected module/i);
});

test('teacher curriculum page includes assignment scheduling with release and due dates', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/teacher/curriculum');

  assert.equal(res.status, 200);
  assert.match(res.text, /Assignment title/i);
  assert.match(res.text, /Release date/i);
  assert.match(res.text, /Due date/i);
  assert.match(res.text, /Schedule assignment/i);
});

test('student lesson page renders the real source lesson notes instead of placeholder text', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'student@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/student/lessons/u1-7');

  assert.equal(res.status, 200);
  assert.match(res.text, /Communication is easier to understand when it is divided into layers\./i);
  assert.match(res.text, /Upper layers/i);
  assert.doesNotMatch(res.text, /Learning content for Social Engineering\./i);
  assert.doesNotMatch(res.text, /<textarea[^>]*aria-label=.*notes/i);
  assert.match(res.text, /accordion-toggle/i);
  assert.match(res.text, /accordion-panel/i);
});

test('student password attack lesson preserves the original quiz button reveal behavior', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'student@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/student/lessons/u1-2');

  assert.equal(res.status, 200);
  assert.match(res.text, /class="quiz-card"/i);
  assert.match(res.text, /class="option-button"/i);
  assert.match(res.text, /answer-box/i);
  assert.doesNotMatch(res.text, /<textarea[^>]*aria-label=.*notes/i);
});

test('teacher assignment page includes a class selector for class-specific scheduling', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  const className = `Assignment Test ${Date.now()}`;
  await agent
    .post('/teacher/classes')
    .type('form')
    .send({ name: className, section: 'A-1' });
  const classRow = db.prepare('SELECT id FROM classes WHERE name = ?').get(className);

  const res = await agent.get('/teacher/assignments');

  assert.equal(res.status, 200);
  assert.match(res.text, /Assign to class/i);
  assert.match(res.text, new RegExp(className));
  db.prepare('DELETE FROM classes WHERE id = ?').run(classRow.id);
});

test('teacher curriculum exposes all actual units and module numbers', async () => {
  const agent = request.agent(app);
  await agent
    .post('/login')
    .type('form')
    .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

  const res = await agent.get('/teacher/curriculum');

  assert.equal(res.status, 200);
  assert.match(res.text, /Unit 1/i);
  assert.match(res.text, /Unit 2/i);
  assert.match(res.text, /Unit 5/i);
  assert.match(res.text, /1-7/i);
  assert.match(res.text, /OSI Model and Network Layers/i);
});

test('students can join a coded class, see assignments, update settings, and exit', async () => {
  const teacherAgent = request.agent(app);
  const studentAgent = request.agent(app);
  const testStudent = createTestStudent();
  const className = `Feature Test ${Date.now()}`;
  const secondClassName = `${className} Second`;
  let classId;
  let secondClassId;

  try {
    await teacherAgent
      .post('/login')
      .type('form')
      .send({ email: 'teacher@cyberacademy.edu', password: 'password123' });

    const createResponse = await teacherAgent
      .post('/teacher/classes')
      .type('form')
      .send({ name: className, section: 'F-1' });
    assert.equal(createResponse.status, 302);

    const classRow = db.prepare('SELECT id, class_code FROM classes WHERE name = ?').get(className);
    assert.ok(classRow);
    classId = classRow.id;
    assert.match(classRow.class_code, /^[A-Z0-9]{7}$/);

    await teacherAgent
      .post('/teacher/classes')
      .type('form')
      .send({ name: secondClassName, section: 'F-2' });
    const secondClass = db.prepare('SELECT id, class_code FROM classes WHERE name = ?').get(secondClassName);
    assert.ok(secondClass);
    secondClassId = secondClass.id;

    const teacherDashboard = await teacherAgent.get('/teacher/dashboard');
    assert.match(teacherDashboard.text, new RegExp(classRow.class_code));

    await studentAgent
      .post('/login')
      .type('form')
      .send({ email: testStudent.email, password: testStudent.password });

    const invalidCode = await studentAgent
      .post('/student/join-class')
      .type('form')
      .send({ classCode: 'bad' });
    assert.equal(invalidCode.headers.location, '/student/dashboard?joinError=invalid');

    const joinResponse = await studentAgent
      .post('/student/join-class')
      .type('form')
      .send({ classCode: classRow.class_code.toLowerCase() });
    assert.equal(joinResponse.headers.location, '/student/dashboard');

    const secondJoinAttempt = await studentAgent
      .post('/student/join-class')
      .type('form')
      .send({ classCode: secondClass.class_code });
    assert.equal(secondJoinAttempt.headers.location, '/student/dashboard?joinError=alreadyJoined');

    const lesson = db.prepare('SELECT id FROM lessons WHERE slug = ?').get('u1-1');
    const assignmentResponse = await teacherAgent
      .post('/teacher/assignments/schedule')
      .type('form')
      .send({ lessonId: lesson.id, classId, assignmentTitle: 'Feature Test Assignment' });
    assert.equal(assignmentResponse.status, 302);

    const dashboard = await studentAgent.get('/student/dashboard');
    assert.equal(dashboard.status, 200);
    assert.match(dashboard.text, /Feature Test Assignment/);
    assert.match(dashboard.text, /Social Engineering/);
    assert.match(dashboard.text, /Due: No due date/);
    assert.match(dashboard.text, /No completed assignments yet/);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM assignment_progress WHERE student_id = (SELECT id FROM users WHERE email = ?)').get(testStudent.email).count, 0);
    assert.doesNotMatch(dashboard.text, /action="\/student\/join-class"/);

    const markCompleteResponse = await studentAgent
      .post(`/student/assignments/${db.prepare('SELECT id FROM assignments WHERE class_id = ? AND title = ?').get(classId, 'Feature Test Assignment').id}/complete`);
    assert.equal(markCompleteResponse.headers.location, '/student/dashboard#completed-assignments');

    const completedDashboard = await studentAgent.get('/student/dashboard');
    assert.match(completedDashboard.text, /Completed assignments/);
    assert.match(completedDashboard.text, /Feature Test Assignment/);
    assert.match(completedDashboard.text, /Completed \d{4}-\d\d-\d\d/);
    assert.doesNotMatch(completedDashboard.text, /No completed assignments yet/);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM assignment_progress WHERE student_id = (SELECT id FROM users WHERE email = ?)').get(testStudent.email).count, 1);

    const settingsResponse = await studentAgent
      .post('/student/settings')
      .type('form')
      .send({ backgroundColor: '#fff8e7' });
    assert.equal(settingsResponse.headers.location, '/student/settings?saved=1');

    const updatedDashboard = await studentAgent.get('/student/dashboard');
    assert.match(updatedDashboard.text, /<body style="--bg:#fff8e7">/);

    const settings = await studentAgent.get('/student/settings');
    assert.match(settings.text, /name="backgroundColor"/);
    assert.match(settings.text, /class="exit-button" type="submit">Exit class/);

    const exitResponse = await studentAgent.post('/student/exit-class');
    assert.equal(exitResponse.headers.location, '/student/settings?leftClass=1');
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM enrollments WHERE student_id = (SELECT id FROM users WHERE email = ?)').get(testStudent.email).count, 0);

    const blankDashboard = await studentAgent.get('/student/dashboard');
    assert.match(blankDashboard.text, /Enter the seven-character class code from your teacher/);
    assert.doesNotMatch(blankDashboard.text, /Feature Test Assignment/);

    const rejoinResponse = await studentAgent
      .post('/student/join-class')
      .type('form')
      .send({ classCode: secondClass.class_code });
    assert.equal(rejoinResponse.headers.location, '/student/dashboard');
    const rejoinedDashboard = await studentAgent.get('/student/dashboard');
    assert.match(rejoinedDashboard.text, new RegExp(secondClassName));
  } finally {
    const cleanupClassIds = [classId, secondClassId].filter(Boolean);
    cleanupClassIds.forEach((cleanupClassId) => {
      db.prepare('DELETE FROM assignment_progress WHERE assignment_id IN (SELECT id FROM assignments WHERE class_id = ?)').run(cleanupClassId);
      db.prepare('DELETE FROM assignments WHERE class_id = ?').run(cleanupClassId);
      db.prepare('DELETE FROM enrollments WHERE class_id = ?').run(cleanupClassId);
      db.prepare('DELETE FROM classes WHERE id = ?').run(cleanupClassId);
    });
    testStudent.cleanup();
  }
});
