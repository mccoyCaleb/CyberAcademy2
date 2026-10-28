const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'learning.db');

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const unitCatalog = [
  { id: 'u1', title: 'Cybersecurity Foundations', code: 'Unit 1', lessons: [
    'Social Engineering', 'Password Attacks', 'Security Practices', 'Cyber Attacker Types',
    'Cybersecurity Defense Terms', 'Security Foundations Review', 'OSI Model and Network Layers'
  ]},
  { id: 'u2', title: 'Securing Spaces', code: 'Unit 2', lessons: [
    'Cyber Foundations', 'Physical Vulnerabilities & Attacks', 'Protecting Physical Spaces',
    'Network and Routing', 'HTTP Requests, Status Codes, and Server Logs'
  ]},
  { id: 'u3', title: 'Network Defense', code: 'Unit 3', lessons: [
    'Network Vulnerabilities', 'MAC Addresses and ARP', 'Protecting Networks', 'Network Segmentation',
    'Firewalls', 'ACL Tables', 'Detecting Network Attacks', 'Logs Part 2'
  ]},
  { id: 'u4', title: 'Security Operations', code: 'Unit 4', lessons: [
    'Password Attacks and Hashing', 'Authentication', 'Protecting Devices', 'Detecting Attacks and Logs'
  ]},
  { id: 'u5', title: 'Securing Applications and Data', code: 'Unit 5', lessons: [
    'Application and Data Vulnerabilities and Attacks', 'Protecting Applications and Data',
    'Protecting Stored Data with Cryptography', 'Asymmetric Cryptography', 'Protecting Applications',
    'Detecting Attacks on Data and Applications'
  ]}
];

const studentBackgroundColors = [
  { value: '#f4f6f8', label: 'Light gray' },
  { value: '#fff8e7', label: 'Warm cream' },
  { value: '#eaf4ff', label: 'Soft blue' },
  { value: '#eff8f1', label: 'Soft green' },
  { value: '#f3edff', label: 'Soft lavender' }
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student','teacher','admin')),
      account_status TEXT NOT NULL DEFAULT 'active',
      background_color TEXT NOT NULL DEFAULT '#f4f6f8',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      source_file TEXT,
      summary TEXT,
      order_index INTEGER NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      content TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(unit_id) REFERENCES units(id)
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      class_id INTEGER,
      title TEXT NOT NULL,
      release_at TEXT,
      due_at TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lesson_id) REFERENCES lessons(id),
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS assignment_progress (
      assignment_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (assignment_id, student_id),
      FOREIGN KEY(assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
      FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lesson_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      version_note TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT,
      class_code TEXT UNIQUE,
      teacher_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(teacher_id) REFERENCES users(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(class_id, student_id),
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      class_id INTEGER,
      student_id INTEGER,
      is_published INTEGER NOT NULL DEFAULT 1,
      release_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(lesson_id, class_id, student_id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id),
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'opened',
      opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      UNIQUE(student_id, lesson_id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS activity_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER,
      event_type TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS learning_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      active_seconds INTEGER NOT NULL DEFAULT 0,
      ended_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER,
      title TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      question_type TEXT NOT NULL,
      options_json TEXT,
      correct_answer TEXT,
      explanation TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      score INTEGER,
      total_questions INTEGER,
      submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id),
      FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id INTEGER,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id INTEGER,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(actor_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id);
    CREATE INDEX IF NOT EXISTS idx_progress_student ON lesson_progress(student_id);
    CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_events(user_id);
  `);
}

function createDemoAccounts() {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const teacherHash = bcrypt.hashSync('password123', 10);
  const studentHash = bcrypt.hashSync('password123', 10);

  const existing = db.prepare('SELECT COUNT(*) AS count FROM users').get();
  if (existing.count > 0) {
    return;
  }

  db.prepare(`
    INSERT INTO users (username, email, password_hash, role, account_status, created_at)
    VALUES (?, ?, ?, 'admin', 'active', CURRENT_TIMESTAMP)
  `).run('admin', 'admin@cyberacademy.edu', adminHash);

  db.prepare(`
    INSERT INTO users (username, email, password_hash, role, account_status, created_at)
    VALUES (?, ?, ?, 'teacher', 'active', CURRENT_TIMESTAMP)
  `).run('teacher', 'teacher@cyberacademy.edu', teacherHash);

  db.prepare(`
    INSERT INTO users (username, email, password_hash, role, account_status, created_at)
    VALUES (?, ?, ?, 'student', 'active', CURRENT_TIMESTAMP)
  `).run('student', 'student@cyberacademy.edu', studentHash);
}

function generateClassCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let attempt = 0; attempt < 100; attempt += 1) {
    let code = '';
    for (let index = 0; index < 7; index += 1) {
      code += characters[crypto.randomInt(characters.length)];
    }

    if (!db.prepare('SELECT id FROM classes WHERE class_code = ?').get(code)) {
      return code;
    }
  }

  throw new Error('Unable to generate a unique class code.');
}

function migrateDashboardFeatures() {
  const userColumns = db.prepare('PRAGMA table_info(users)').all();
  if (!userColumns.some((column) => column.name === 'background_color')) {
    db.exec("ALTER TABLE users ADD COLUMN background_color TEXT NOT NULL DEFAULT '#f4f6f8'");
  }

  const classColumns = db.prepare('PRAGMA table_info(classes)').all();
  if (!classColumns.some((column) => column.name === 'class_code')) {
    db.exec('ALTER TABLE classes ADD COLUMN class_code TEXT');
  }

  db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_classes_class_code ON classes(class_code)');
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const removeDemoEnrollment = db.prepare('SELECT name FROM app_migrations WHERE name = ?').get('remove-demo-student-enrollment');
  if (!removeDemoEnrollment) {
    const demoStudent = db.prepare('SELECT id FROM users WHERE email = ? AND role = ?').get('student@cyberacademy.edu', 'student');
    if (demoStudent) {
      db.prepare('DELETE FROM enrollments WHERE student_id = ?').run(demoStudent.id);
    }
    db.prepare('INSERT INTO app_migrations (name) VALUES (?)').run('remove-demo-student-enrollment');
  }

  const classesWithoutCodes = db.prepare('SELECT id FROM classes WHERE class_code IS NULL OR class_code = ?').all('');
  const updateClassCode = db.prepare('UPDATE classes SET class_code = ? WHERE id = ?');
  const assignMissingCodes = db.transaction(() => {
    for (const classRow of classesWithoutCodes) {
      updateClassCode.run(generateClassCode(), classRow.id);
    }
  });
  assignMissingCodes();

  const resetDemoProgress = db.prepare('SELECT name FROM app_migrations WHERE name = ?').get('reset-demo-student-seeded-progress');
  if (!resetDemoProgress) {
    const demoStudent = db.prepare('SELECT id FROM users WHERE email = ? AND role = ?').get('student@cyberacademy.edu', 'student');
    if (demoStudent) {
      db.prepare('DELETE FROM assignment_progress WHERE student_id = ?').run(demoStudent.id);
      db.prepare('DELETE FROM quiz_attempts WHERE student_id = ?').run(demoStudent.id);
      db.prepare('DELETE FROM lesson_progress WHERE student_id = ?').run(demoStudent.id);
    }
    db.prepare('INSERT INTO app_migrations (name) VALUES (?)').run('reset-demo-student-seeded-progress');
  }
}

function syncDemoLessonVisibility() {
  const lessonSlugs = unitCatalog.flatMap((unit) => unit.lessons.map((_, index) => `${unit.id}-${index + 1}`));
  if (!lessonSlugs.length) {
    return;
  }

  const placeholders = lessonSlugs.map(() => '?').join(', ');
  db.prepare(`UPDATE lessons SET published = 1 WHERE slug IN (${placeholders})`).run(...lessonSlugs);
}

function getLessonFileName(unitId, lessonTitle, lessonNumber) {
  const exactMap = {
    u1: {
      'Social Engineering': '1-1-social-engineering.html',
      'Password Attacks': '1-2-password-attacks.html',
      'Security Practices': '1-3-security-practices.html',
      'Cyber Attacker Types': '1-4-CyberAttackers.html',
      'Cybersecurity Defense Terms': '1-5-cybersecurity-defense-terms.html',
      'Security Foundations Review': '1-6-security-foundations-review.html',
      'OSI Model and Network Layers': '1-7-osi-network-layers.html'
    },
    u2: {
      'Cyber Foundations': '2-1-cyber-foundations.html',
      'Physical Vulnerabilities & Attacks': '2-2-physical-vulnerabilities.html',
      'Protecting Physical Spaces': '2-3-protecting-physical-spaces.html',
      'Network and Routing': '2-4-network-and-routing.html',
      'HTTP Requests, Status Codes, and Server Logs': '2-5-logs-basics.html'
    },
    u3: {
      'Network Vulnerabilities': '3-1-network-vulnerabilities.html',
      'MAC Addresses and ARP': '3-2-mac-addresses-and-arp.html',
      'Protecting Networks': '3-3-protecting-networks.html',
      'Network Segmentation': '3-4-network-segmentation.html',
      'Firewalls': '3-5-firewalls.html',
      'ACL Tables': '3-6-acl-tables.html',
      'Detecting Network Attacks': '3-7-detecting-network-attacks.html',
      'Logs Part 2': '3-8-logs-part-2.html'
    },
    u4: {
      'Password Attacks and Hashing': '4-1-password-attacks-and-hashing.html',
      'Authentication': '4-2-authentication.html',
      'Protecting Devices': '4-3-protecting-devices.html',
      'Detecting Attacks and Logs': '4-4-detecting-attacks-and-logs.html'
    },
    u5: {
      'Application and Data Vulnerabilities and Attacks': '5-1-application-and-data-vulnerabilities.html',
      'Protecting Applications and Data': '5-2-protecting-applications-and-data.html',
      'Protecting Stored Data with Cryptography': '5-3-protecting-stored-data-with-cryptography.html',
      'Asymmetric Cryptography': '5-4-asymmetric-cryptography.html',
      'Protecting Applications': '5-5-protecting-applications.html',
      'Detecting Attacks on Data and Applications': '5-6-detecting-attacks-on-data-and-applications.html'
    }
  };

  const exact = exactMap[unitId]?.[lessonTitle];
  if (exact) {
    return `${unitId === 'u1' ? 'unit-1' : unitId === 'u2' ? 'unit-2' : unitId === 'u3' ? 'unit-3' : unitId === 'u4' ? 'unit-4' : 'unit-5'}/${exact}`;
  }

  const prefix = {
    u1: 'unit-1',
    u2: 'unit-2',
    u3: 'unit-3',
    u4: 'unit-4',
    u5: 'unit-5'
  }[unitId];

  const fallback = lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${prefix}/${lessonNumber}-${fallback}.html`;
}

function seedCourseContent() {
  const courseRow = db.prepare('SELECT * FROM courses ORDER BY id LIMIT 1').get();
  const teacher = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('teacher');
  const student = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('student');

  let courseId = courseRow ? courseRow.id : null;

  if (!courseId) {
    const course = db.prepare('INSERT INTO courses (name, description) VALUES (?, ?)').run(
      'Cybersecurity Course',
      'A five-unit learning pathway covering cybersecurity foundations, networks, authentication, and data protection.'
    );
    courseId = course.lastInsertRowid;
  }

  unitCatalog.forEach((unit, unitIndex) => {
    const existingUnit = db.prepare('SELECT id FROM units WHERE code = ? LIMIT 1').get(unit.code);
    const unitId = existingUnit ? existingUnit.id : db.prepare(`
      INSERT INTO units (course_id, code, title, description, sort_order, published)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(courseId, unit.code, unit.title, `Core cybersecurity content for ${unit.title}.`, unitIndex + 1).lastInsertRowid;

    unit.lessons.forEach((lessonTitle, lessonIndex) => {
      const slug = `${unit.id}-${lessonIndex + 1}`;
      const sourceFile = getLessonFileName(unit.id, lessonTitle, lessonIndex + 1);
      const existingLesson = db.prepare('SELECT id FROM lessons WHERE slug = ? LIMIT 1').get(slug);

      if (!existingLesson) {
        const lessonId = db.prepare(`
          INSERT INTO lessons (unit_id, slug, title, source_file, summary, order_index, published, content)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?)
        `).run(
          unitId,
          slug,
          lessonTitle,
          sourceFile,
          `Learning content for ${lessonTitle}.`,
          lessonIndex + 1,
          `# ${lessonTitle}\n\nThis lesson is part of the ${unit.title} curriculum.`
        ).lastInsertRowid;

        const quizId = db.prepare('INSERT INTO quizzes (lesson_id, title, published) VALUES (?, ?, 1)').run(lessonId, `${lessonTitle} Knowledge Check`).lastInsertRowid;
        db.prepare('INSERT INTO quiz_questions (quiz_id, prompt, question_type, options_json, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)')
          .run(quizId, `Which of the following best matches the main idea of ${lessonTitle}?`, 'multiple_choice', JSON.stringify(['A principle of secure systems', 'A random browser event', 'A password reset flow', 'A hardware failure']), 'A principle of secure systems', 'This question reinforces the concept covered in the lesson.');

        db.prepare('INSERT OR IGNORE INTO permissions (lesson_id, class_id, student_id, is_published) VALUES (?, ?, ?, 1)').run(lessonId, null, null);
      }
    });
  });

  if (teacher && student) {
    const firstLessonId = db.prepare('SELECT id FROM lessons WHERE slug = ?').get('u1-1');
    if (firstLessonId && !db.prepare('SELECT id FROM assignments WHERE lesson_id = ? LIMIT 1').get(firstLessonId.id)) {
      const now = new Date();
      const releaseDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      db.prepare('INSERT INTO assignments (lesson_id, title, release_at, due_at, published, created_by) VALUES (?, ?, ?, ?, 1, ?)')
        .run(firstLessonId.id, 'Social Engineering Reflection', releaseDate, dueDate, teacher.id);
    }
  }

  syncDemoLessonVisibility();
}

function pruneStaleCourseData() {
  const validCodes = unitCatalog.map((unit) => unit.code);
  const validPlaceholders = validCodes.map(() => '?').join(', ');
  const staleUnits = db.prepare(`SELECT id, code FROM units WHERE code NOT IN (${validPlaceholders})`).all(...validCodes);

  if (!staleUnits.length) {
    return;
  }

  const staleUnitIds = staleUnits.map((unit) => unit.id);
  const staleUnitsPlaceholders = staleUnitIds.map(() => '?').join(', ');
  const staleLessons = db.prepare(`SELECT id FROM lessons WHERE unit_id IN (${staleUnitsPlaceholders})`).all(...staleUnitIds);
  const staleLessonIds = staleLessons.map((lesson) => lesson.id);

  if (staleLessonIds.length) {
    const staleLessonsPlaceholders = staleLessonIds.map(() => '?').join(', ');

    db.prepare(`DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id IN (${staleLessonsPlaceholders}))`).run(...staleLessonIds);
    db.prepare(`DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id IN (${staleLessonsPlaceholders}))`).run(...staleLessonIds);
    db.prepare(`DELETE FROM quizzes WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM lesson_progress WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM activity_events WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM learning_sessions WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM permissions WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM assignments WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM lesson_versions WHERE lesson_id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
    db.prepare(`DELETE FROM lessons WHERE id IN (${staleLessonsPlaceholders})`).run(...staleLessonIds);
  }

  db.prepare(`DELETE FROM units WHERE id IN (${staleUnitsPlaceholders})`).run(...staleUnitIds);
}

function ensureSeedData() {
  createSchema();
  migrateDashboardFeatures();
  createDemoAccounts();
  seedCourseContent();
  pruneStaleCourseData();

  const assignmentColumns = db.prepare('PRAGMA table_info(assignments)').all();
  if (!assignmentColumns.some((column) => column.name === 'class_id')) {
    db.exec('ALTER TABLE assignments ADD COLUMN class_id INTEGER REFERENCES classes(id)');
  }
}

function getLessonSourceHtml(lesson) {
  if (!lesson) return '';

  const sourceFile = lesson.source_file || '';
  const preferredFile = sourceFile && fs.existsSync(path.join(rootDir, sourceFile))
    ? path.join(rootDir, sourceFile)
    : null;

  if (!preferredFile) {
    return lesson.content || '';
  }

  const html = fs.readFileSync(preferredFile, 'utf8');

  const sectionMatch = html.match(/<section class="content-panel">([\s\S]*?)<\/section>/i);
  if (sectionMatch && sectionMatch[1]) {
    return sectionMatch[1];
  }

  const mainMatch = html.match(/<main[^>]*class="unit-page section-wrap"[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch && mainMatch[1]) {
    return mainMatch[1];
  }

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<div class="progress-block"[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="topic-header">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="lesson-layout">[\s\S]*?<\/div>/gi, '')
    .replace(/<aside class="sidebar-panel">[\s\S]*?<\/aside>/gi, '');
}

ensureSeedData();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
  secret: 'cyberacademy-session-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use((req, res, next) => {
  res.locals.currentUser = getCurrentUser(req);
  next();
});

function getCurrentUser(req) {
  if (!req.session || !req.session.userId) {
    return null;
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  return user || null;
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
}

function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }

    const user = getCurrentUser(req);
    if (!user || user.role !== requiredRole) {
      return res.status(403).send('<h1>Access denied</h1><p>You do not have permission to view this portal.</p><p><a href="/login">Return to login</a></p>');
    }

    req.user = user;
    next();
  };
}

function getStudentStats(studentId) {
  const totalLessons = db.prepare('SELECT COUNT(*) AS count FROM lessons WHERE published = 1').get().count;
  const completedLessons = db.prepare(`
    SELECT COUNT(*) AS count FROM lesson_progress WHERE student_id = ? AND status = 'completed'
  `).get(studentId).count;
  const units = db.prepare('SELECT COUNT(*) AS count FROM units WHERE published = 1').get().count;

  const recent = db.prepare(`
    SELECT l.title, lp.completed_at
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.student_id = ? AND lp.status = 'completed'
    ORDER BY lp.completed_at DESC
    LIMIT 5
  `).all(studentId);

  return { totalLessons, completedLessons, units, completionRate: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0, recent };
}

function getTeacherOverview(teacherId) {
  const classCount = db.prepare('SELECT COUNT(*) AS count FROM classes WHERE teacher_id = ?').get(teacherId).count;
  const studentCount = db.prepare(`
    SELECT COUNT(*) AS count FROM enrollments e
    JOIN classes c ON c.id = e.class_id
    WHERE c.teacher_id = ?
  `).get(teacherId).count;
  const lessonCount = db.prepare(`
    SELECT COUNT(*) AS count FROM lessons l
    JOIN units u ON u.id = l.unit_id
    JOIN courses c ON c.id = u.course_id
    WHERE u.published = 1 AND l.published = 1
  `).get().count;

  return { classCount, studentCount, lessonCount };
}

function getStudentUnits(studentId) {
  return db.prepare(`
    SELECT u.id, u.code, u.title, u.description,
      (SELECT COUNT(*) FROM lessons l WHERE l.unit_id = u.id AND l.published = 1) AS lesson_count,
      (SELECT COUNT(*) FROM lesson_progress lp JOIN lessons l2 ON l2.id = lp.lesson_id WHERE lp.student_id = ? AND l2.unit_id = u.id AND lp.status = 'completed') AS completed_count
    FROM units u
    WHERE u.published = 1
    ORDER BY u.sort_order ASC
  `).all(studentId);
}

function getUnitLessons(unitId, studentId) {
  return db.prepare(`
    SELECT l.id, l.slug, l.title, l.source_file, l.published,
      (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.student_id = ? AND lp.lesson_id = l.id AND lp.status = 'completed') AS completed
    FROM lessons l
    WHERE l.unit_id = ? AND l.published = 1
    ORDER BY l.order_index ASC
  `).all(studentId, unitId);
}

function loginPage(errorMessage = '', nextUrl = '') {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CyberAcademy Login</title>
        <style>
          :root { --bg:#f4f7fb; --panel:#fff; --primary:#1f4e79; --primary-soft:#dfeaf6; --text:#1d2b36; --muted:#5e6d7a; --border:#dfe5ec; --danger:#b42318; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:Arial, sans-serif; background:linear-gradient(135deg,#eef5ff,#f7f8fa); color:var(--text); }
          .page { min-height:100vh; display:grid; place-items:center; padding:24px; }
          .card { width:min(100%,440px); background:var(--panel); border:1px solid var(--border); border-radius:16px; box-shadow:0 10px 30px rgba(31,78,121,0.08); padding:32px 28px; }
          .brand { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
          .brand-mark { display:grid; place-items:center; width:42px; height:42px; border-radius:12px; background:var(--primary); color:white; font-weight:700; }
          h1 { margin:0 0 8px 0; font-size:2rem; }
          p { color:var(--muted); }
          form { display:flex; flex-direction:column; gap:16px; }
          label { display:flex; flex-direction:column; gap:8px; font-weight:600; }
          input { width:100%; padding:12px 14px; border-radius:10px; border:1px solid var(--border); font-size:1rem; }
          .row { display:flex; justify-content:space-between; align-items:center; }
          .show-toggle { border:0; background:transparent; color:var(--primary); font-weight:600; cursor:pointer; }
          button[type="submit"] { background:var(--primary); color:#fff; border:0; padding:14px 16px; border-radius:10px; font-weight:700; cursor:pointer; }
          .error { background:#fef3f2; color:var(--danger); border:1px solid #efc7c3; border-radius:10px; padding:10px 12px; font-weight:600; }
          .meta { margin-top:18px; text-align:center; color:var(--muted); font-size:0.9rem; }
          .demo { font-size:0.82rem; color:var(--muted); margin-top:22px; border-top:1px solid var(--border); padding-top:14px; }
          .demo strong { color:var(--text); }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="card">
            <div class="brand">
              <span class="brand-mark">CA</span>
              <div>
                <strong>CyberAcademy</strong>
              </div>
            </div>
            <h1>Sign in</h1>
            <p>Student and teacher access uses one secure portal.</p>
            ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
            <form method="POST" action="/login">
              <input type="hidden" name="next" value="${nextUrl}" />
              <label>
                Email
                <input type="email" name="email" placeholder="name@school.edu" required />
              </label>
              <label>
                Password
                <input type="password" name="password" id="passwordInput" placeholder="Password" required />
              </label>
              <div class="row">
                <button type="button" class="show-toggle" id="togglePassword">Show password</button>
              </div>
              <button type="submit">Log in</button>
            </form>
            <div class="meta"><a href="/">Back to home</a></div>
            <div class="demo">
              <strong>Demo accounts</strong><br>
              Teacher: teacher@cyberacademy.edu / password123<br>
              Student: student@cyberacademy.edu / password123
            </div>
          </div>
        </div>
        <script>
          const toggle = document.getElementById('togglePassword');
          const input = document.getElementById('passwordInput');
          toggle.addEventListener('click', () => {
            const visible = input.type === 'text';
            input.type = visible ? 'password' : 'text';
            toggle.textContent = visible ? 'Show password' : 'Hide password';
          });
        </script>
      </body>
    </html>
  `;
}

app.get('/login', (req, res) => {
  if (req.session.userId) {
    const user = getCurrentUser(req);
    if (user && user.role === 'teacher') return res.redirect('/teacher/dashboard');
    if (user && user.role === 'student') return res.redirect('/student/dashboard');
  }
  res.send(loginPage('', req.query.next || ''));
});

app.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const nextUrl = String(req.body.next || '');

  if (!email || !password) {
    return res.status(400).send(loginPage('Please enter both email and password.', nextUrl));
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).send(loginPage('Invalid email or password.', nextUrl));
  }

  if (user.account_status !== 'active') {
    return res.status(403).send(loginPage('This account is not active. Contact an administrator.', nextUrl));
  }

  req.session.userId = user.id;
  db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, details) VALUES (?, ?, ?, ?)')
    .run(user.id, 'login', 'users', JSON.stringify({ role: user.role }));

  const destination = user.role === 'teacher' ? '/teacher/dashboard' : user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
  return res.redirect(nextUrl || destination);
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/student/dashboard', requireRole('student'), (req, res) => {
  const user = req.user;
  const membership = db.prepare(`
    SELECT c.id, c.name, c.section
    FROM enrollments e
    JOIN classes c ON c.id = e.class_id
    WHERE e.student_id = ?
    ORDER BY e.enrolled_at ASC
    LIMIT 1
  `).get(user.id);
  const joinMessages = {
    invalid: 'Enter a valid seven-character class code.',
    notFound: 'That class code was not found. Check the code and try again.',
    alreadyJoined: 'You are already in a class. Exit your current class in Settings before joining another.'
  };
  const joinError = typeof req.query.joinError === 'string' ? req.query.joinError : '';
  const joinMessage = Object.hasOwn(joinMessages, joinError) ? joinMessages[joinError] : '';
  const backgroundColor = studentBackgroundColors.some((option) => option.value === user.background_color)
    ? user.background_color
    : studentBackgroundColors[0].value;
  let dashboardContent = `
    <section class="unit-panel join-panel">
      <h2>Your dashboard is ready when you are.</h2>
      <p>Enter the seven-character class code from your teacher to join your class and see your lessons and assignments.</p>
      ${joinMessage ? `<p class="form-error" role="alert">${joinMessage}</p>` : ''}
      <form method="POST" action="/student/join-class" class="join-form">
        <label for="classCode">Class code</label>
        <input id="classCode" type="text" name="classCode" minlength="7" maxlength="7" pattern="[A-Za-z0-9]{7}" autocomplete="off" autocapitalize="characters" required>
        <button class="mini-button" type="submit">Join class</button>
      </form>
    </section>
  `;

  if (membership) {
    const stats = getStudentStats(user.id);
    const units = getStudentUnits(user.id);
    const assignments = db.prepare(`
      SELECT a.id, a.title, a.release_at, a.due_at, l.title AS lesson_title, l.slug, l.published AS lesson_published,
        u.code AS unit_code, u.title AS unit_title, ap.completed_at
      FROM assignments a
      JOIN lessons l ON l.id = a.lesson_id
      JOIN units u ON u.id = l.unit_id
      JOIN classes c ON c.id = a.class_id
      JOIN enrollments e ON e.class_id = c.id AND e.student_id = ?
      LEFT JOIN assignment_progress ap ON ap.assignment_id = a.id AND ap.student_id = e.student_id
      WHERE c.id = ? AND a.published = 1
        AND (a.release_at IS NULL OR datetime(a.release_at) <= datetime('now'))
      ORDER BY CASE WHEN a.due_at IS NULL THEN 1 ELSE 0 END, a.due_at ASC, a.created_at DESC
    `).all(user.id, membership.id);
    const incompleteAssignments = assignments.filter((assignment) => !assignment.completed_at);
    const assignmentRows = incompleteAssignments.length ? incompleteAssignments.map((assignment) => `
      <article class="assignment-row">
        <div>
          <strong>${escapeHtml(assignment.title)}</strong>
          <p>${escapeHtml(assignment.unit_code)} · ${escapeHtml(assignment.unit_title)} · ${escapeHtml(assignment.lesson_title)}</p>
        </div>
        <div class="assignment-meta">
          <span>Available: ${escapeHtml(assignment.release_at || 'Now')}</span>
          <span>Due: ${escapeHtml(assignment.due_at || 'No due date')}</span>
          ${assignment.lesson_published
            ? `<a class="mini-button" href="/student/lessons/${encodeURIComponent(assignment.slug)}">Open module</a>`
            : '<span>Module not published yet</span>'}
          <form method="POST" action="/student/assignments/${assignment.id}/complete">
            <button class="complete-button" type="submit">Mark complete</button>
          </form>
        </div>
      </article>
    `).join('') : assignments.length
      ? '<p>All released assignments are complete. Nice work!</p>'
      : '<p>No released assignments for your class yet.</p>';
    const completedAssignments = assignments.filter((assignment) => assignment.completed_at);
    const completedAssignmentRows = completedAssignments.length ? completedAssignments.map((assignment) => `
      <article class="assignment-row completed-assignment">
        <div>
          <strong>${escapeHtml(assignment.title)}</strong>
          <p>${escapeHtml(assignment.unit_code)} · ${escapeHtml(assignment.unit_title)} · ${escapeHtml(assignment.lesson_title)}</p>
        </div>
        <span class="complete-status">Completed ${escapeHtml(assignment.completed_at)}</span>
      </article>
    `).join('') : '<p class="empty-completed">No completed assignments yet.</p>';

    const rows = units.map((unit) => {
      const lessons = getUnitLessons(unit.id, user.id);
      return `
        <div class="unit-panel">
          <div class="unit-header">
            <div>
              <span class="unit-code">${escapeHtml(unit.code)}</span>
              <h3>${escapeHtml(unit.title)}</h3>
            </div>
            <span class="badge">${unit.completed_count}/${unit.lesson_count} complete</span>
          </div>
          <p>${escapeHtml(unit.description)}</p>
          <div class="lesson-list">
            ${lessons.map((lesson) => `
              <div class="lesson-row">
                <div>
                  <strong>${escapeHtml(lesson.title)}</strong>
                  <small>${lesson.completed ? 'Completed' : 'Ready to start'}</small>
                </div>
                <a class="mini-button" href="/student/lessons/${encodeURIComponent(lesson.slug)}">Open</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    dashboardContent = `
      <div class="notice"><strong>${escapeHtml(membership.name)}${membership.section ? ` · ${escapeHtml(membership.section)}` : ''}</strong> — Your class lessons and assignments are below.</div>
      <section class="unit-panel" id="assignments">
        <h2>Assignments</h2>
        <div class="assignment-list">${assignmentRows}</div>
      </section>
      <section class="unit-panel" id="completed-assignments">
        <h2>Completed assignments</h2>
        <div class="assignment-list">${completedAssignmentRows}</div>
      </section>
      <div class="stats">
        <div class="stat"><span>Lessons completed</span><strong>${stats.completedLessons}</strong></div>
        <div class="stat"><span>Course progress</span><strong>${stats.completionRate}%</strong></div>
        <div class="stat"><span>Units available</span><strong>${stats.units}</strong></div>
        <div class="stat"><span>Total lessons</span><strong>${stats.totalLessons}</strong></div>
      </div>
      ${rows}
    `;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Student Dashboard | CyberAcademy</title>
        <style>
          :root {
            --bg:#f4f6f8; --panel:#fff; --line:#d3dce3; --ink:#172b3a; --muted:#586b78;
            --navy:#142d3c; --primary:#176b87; --primary-soft:#e2f2f6; --gold:#ffbf47;
            --success:#176b52; --success-soft:#e7f6ef;
          }
          * { box-sizing:border-box; }
          body { margin:0; font-family:"Trebuchet MS","Segoe UI",sans-serif; background-color:var(--bg); color:var(--ink); }
          .shell { display:flex; min-height:100vh; overflow-x:hidden; }
          aside { flex:0 0 250px; width:250px; background:var(--navy); color:white; padding:24px 18px; transition:transform .24s ease,flex-basis .24s ease,width .24s ease,padding .24s ease,visibility .24s ease; }
          .shell.sidebar-hidden aside { flex-basis:0; width:0; min-width:0; padding-left:0; padding-right:0; overflow:hidden; transform:translateX(-100%); visibility:hidden; }
          .brand { font-size:1.35rem; font-weight:900; letter-spacing:-.04em; margin-bottom:32px; display:block; }
          nav a { display:block; color:#e4edf1; text-decoration:none; padding:11px 12px; margin:7px 0; font-weight:700; }
          nav a:hover, nav a:focus-visible { background:rgba(255,255,255,.1); }
          main { flex:1; min-width:0; padding:28px clamp(18px,4vw,48px); }
          .topbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:22px; }
          .topbar-intro { display:flex; align-items:center; gap:18px; min-width:0; }
          .topbar h2 { margin:5px 0 0; font-size:clamp(1.6rem,3vw,2.2rem); letter-spacing:-.04em; }
          .topbar p { margin:0; color:var(--muted); font-weight:700; }
          .menu-button { display:inline-flex; align-items:center; gap:9px; background:var(--primary); border:2px solid var(--navy); color:#fff; padding:9px 13px; font:inherit; font-weight:800; }
          .menu-button:hover { background:#10566f; }
          .menu-button:focus-visible, .logout:focus-visible, nav a:focus-visible, .mini-button:focus-visible { outline:3px solid var(--gold); outline-offset:3px; }
          .menu-icon { font-size:1.2rem; line-height:1; }
          .sidebar-backdrop { display:none; }
          .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:14px; margin-bottom:22px; }
          .stat { background:var(--panel); border:1px solid var(--line); padding:17px; }
          .stat span { color:var(--muted); font-size:.76rem; text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
          .stat strong { display:block; font-size:2rem; margin-top:7px; color:var(--primary); }
          .unit-panel { background:var(--panel); border:1px solid var(--line); padding:20px; margin-bottom:18px; }
          .unit-header { display:flex; justify-content:space-between; align-items:center; gap:12px; }
          .unit-header h3 { margin:5px 0 0; font-size:1.3rem; }
          .unit-code { color:var(--primary); font-size:.72rem; font-weight:900; text-transform:uppercase; letter-spacing:.12em; }
          .badge { background:var(--primary-soft); color:var(--primary); padding:7px 10px; font-size:.8rem; font-weight:800; }
          .lesson-list { padding-top:10px; display:flex; flex-direction:column; gap:10px; }
          .lesson-row { display:flex; justify-content:space-between; align-items:center; gap:12px; padding-top:12px; }
          .lesson-row strong { display:block; margin-bottom:4px; }
          .lesson-row small { color:var(--muted); }
          .mini-button { display:inline-block; background:var(--primary); color:#fff; text-decoration:none; padding:8px 12px; font-weight:800; border:2px solid var(--navy); }
          .logout { background:transparent; border:1px solid rgba(255,255,255,.5); color:white; padding:10px 12px; font:inherit; font-weight:700; }
          .notice { background:var(--success-soft); border:1px solid #a9d8c3; padding:15px 18px; margin-bottom:20px; color:#184a38; }
          .join-panel { max-width:760px; }
          .join-panel h2, #assignments h2 { margin:0 0 8px; }
          .join-form { display:flex; flex-wrap:wrap; align-items:end; gap:12px; margin-top:20px; }
          .join-form label { width:100%; font-weight:800; }
          .join-form input { flex:1 1 220px; min-width:0; padding:11px 12px; border:1px solid var(--line); font:inherit; text-transform:uppercase; }
          .join-form .mini-button { border:0; font:inherit; cursor:pointer; }
          .form-error { color:#a51d24; font-weight:700; }
          .assignment-list { display:grid; gap:12px; }
          .assignment-row { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:14px 0; }
          .assignment-row p { margin:5px 0 0; color:var(--muted); }
          .assignment-meta { display:flex; align-items:center; gap:14px; color:var(--muted); }
          .assignment-meta form { margin:0; }
          .complete-button { padding:8px 12px; border:0; background:var(--success); color:#fff; font:inherit; font-weight:800; cursor:pointer; }
          .complete-status { color:var(--success); font-weight:800; }
          .completed-assignment { opacity:.8; }
          .empty-completed { color:var(--muted); }
          @media (max-width:620px) { .assignment-row { align-items:flex-start; flex-direction:column; } .assignment-meta { flex-wrap:wrap; } }
          @media (max-width:760px) {
            .shell { display:block; }
            .shell aside { position:fixed; z-index:12; inset:0 auto 0 0; width:min(290px,86vw); overflow-y:auto; transform:translateX(-100%); visibility:hidden; }
            .shell:not(.sidebar-hidden) aside { transform:translateX(0); visibility:visible; }
            .shell.sidebar-hidden aside { flex-basis:auto; width:min(290px,86vw); padding:24px 18px; }
            .sidebar-backdrop:not([hidden]) { display:block; position:fixed; z-index:11; inset:0; width:100%; height:100%; border:0; background:rgba(9,24,34,.48); }
            main { padding:20px 16px; }
          }
          @media (max-width:520px) {
            .topbar { align-items:flex-start; }
            .topbar-intro { align-items:flex-start; gap:12px; }
            .topbar h2 { font-size:1.35rem; }
            .menu-button { padding:8px 10px; }
            .menu-label { display:none; }
          }
          @media (prefers-reduced-motion:reduce) { aside { transition:none; } }
        </style>
      </head>
      <body style="--bg:${backgroundColor}">
        <div class="shell" id="dashboardShell">
          <aside id="dashboardSidebar" aria-label="Student navigation">
            <div class="brand">CyberAcademy</div>
            <nav aria-label="Student dashboard">
              <a href="/student/dashboard">Dashboard</a>
              ${membership ? '<a href="#assignments">Assignments</a>' : ''}
              <a href="/student/progress">Progress</a>
              <a href="/">Course catalog</a>
              <a href="/student/settings">Settings</a>
            </nav>
            <form method="POST" action="/logout" style="margin-top:24px;">
              <button class="logout" type="submit">Log out</button>
            </form>
          </aside>
          <button class="sidebar-backdrop" id="sidebarBackdrop" type="button" aria-label="Close navigation" hidden></button>
          <main>
            <div class="topbar">
              <div class="topbar-intro">
                <button class="menu-button" id="menuToggle" type="button" aria-controls="dashboardSidebar" aria-expanded="true"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-label">Hide menu</span></button>
                <div>
                <p style="margin:0; color:#64748b;">Student portal</p>
                <h2>Good to see you, ${escapeHtml(user.username)}!</h2>
                </div>
              </div>
              <span class="badge">${user.role}</span>
            </div>

            ${dashboardContent}
          </main>
        </div>
        <script>
          const dashboardShell = document.getElementById('dashboardShell');
          const menuToggle = document.getElementById('menuToggle');
          const sidebarBackdrop = document.getElementById('sidebarBackdrop');
          const dashboardSidebar = document.getElementById('dashboardSidebar');

          function setSidebarOpen(isOpen) {
            dashboardShell.classList.toggle('sidebar-hidden', !isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.querySelector('.menu-label').textContent = isOpen ? 'Hide menu' : 'Menu';
            sidebarBackdrop.hidden = !isOpen || !window.matchMedia('(max-width: 760px)').matches;
          }

          setSidebarOpen(!window.matchMedia('(max-width: 760px)').matches);
          menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            setSidebarOpen(!isOpen);
            if (!isOpen && window.matchMedia('(max-width: 760px)').matches) {
              dashboardSidebar.querySelector('nav a').focus();
            }
          });
          sidebarBackdrop.addEventListener('click', () => {
            setSidebarOpen(false);
            menuToggle.focus();
          });
          document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
              setSidebarOpen(false);
              menuToggle.focus();
            }
          });
          window.addEventListener('resize', () => {
            sidebarBackdrop.hidden = menuToggle.getAttribute('aria-expanded') !== 'true' || !window.matchMedia('(max-width: 760px)').matches;
          });
        </script>
      </body>
    </html>
  `);
});

app.post('/student/join-class', requireRole('student'), (req, res) => {
  const classCode = String(req.body.classCode || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{7}$/.test(classCode)) {
    return res.redirect('/student/dashboard?joinError=invalid');
  }

  const joinClass = db.transaction(() => {
    const existingEnrollment = db.prepare('SELECT id FROM enrollments WHERE student_id = ? LIMIT 1').get(req.user.id);
    if (existingEnrollment) {
      return 'alreadyJoined';
    }

    const classRow = db.prepare('SELECT id FROM classes WHERE class_code = ?').get(classCode);
    if (!classRow) {
      return 'notFound';
    }

    db.prepare('INSERT INTO enrollments (class_id, student_id) VALUES (?, ?)').run(classRow.id, req.user.id);
    db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, 'class_joined', 'classes', classRow.id, JSON.stringify({ classCode }));
    return 'joined';
  });
  const result = joinClass();

  if (result !== 'joined') {
    return res.redirect(`/student/dashboard?joinError=${result}`);
  }
  res.redirect('/student/dashboard');
});

app.post('/student/assignments/:assignmentId/complete', requireRole('student'), (req, res) => {
  const assignmentId = Number(req.params.assignmentId);
  if (!Number.isSafeInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).send('Invalid assignment.');
  }

  const assignment = db.prepare(`
    SELECT a.id, c.id AS class_id
    FROM assignments a
    JOIN classes c ON c.id = a.class_id
    JOIN enrollments e ON e.class_id = c.id
    WHERE a.id = ? AND e.student_id = ? AND a.published = 1
      AND (a.release_at IS NULL OR datetime(a.release_at) <= datetime('now'))
  `).get(assignmentId, req.user.id);
  if (!assignment) {
    return res.status(404).send('Assignment not found or not available to this student.');
  }

  const markComplete = db.transaction(() => {
    db.prepare(`
      INSERT OR IGNORE INTO assignment_progress (assignment_id, student_id)
      VALUES (?, ?)
    `).run(assignment.id, req.user.id);
    db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, 'assignment_completed', 'assignments', assignment.id, JSON.stringify({ classId: assignment.class_id }));
  });
  markComplete();
  res.redirect('/student/dashboard#completed-assignments');
});

app.get('/student/settings', requireRole('student'), (req, res) => {
  const membership = db.prepare(`
    SELECT c.name, c.section
    FROM enrollments e
    JOIN classes c ON c.id = e.class_id
    WHERE e.student_id = ?
    ORDER BY e.enrolled_at ASC
    LIMIT 1
  `).get(req.user.id);
  const backgroundColor = studentBackgroundColors.some((option) => option.value === req.user.background_color)
    ? req.user.background_color
    : studentBackgroundColors[0].value;
  const saved = req.query.saved === '1' ? '<p class="success" role="status">Settings saved.</p>' : '';
  const leftClass = req.query.leftClass === '1' ? '<p class="success" role="status">You have left your class. Enter a new code from the dashboard whenever you are ready.</p>' : '';
  const colorOptions = studentBackgroundColors.map((option) => `
    <option value="${option.value}" ${option.value === backgroundColor ? 'selected' : ''}>${option.label}</option>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Student Settings | CyberAcademy</title>
        <style>
          * { box-sizing:border-box; }
          body { margin:0; padding:24px; background:${backgroundColor}; color:#172b3a; font-family:"Trebuchet MS","Segoe UI",sans-serif; }
          main { width:min(100%,760px); margin:0 auto; }
          .panel { background:#fff; border:1px solid #d3dce3; padding:24px; margin-top:18px; }
          .settings-form { display:grid; gap:12px; }
          label { font-weight:800; }
          select, button { width:100%; padding:11px 12px; font:inherit; }
          .primary { width:auto; padding:10px 14px; border:0; background:#176b87; color:#fff; font-weight:800; cursor:pointer; }
          .success { color:#176b52; font-weight:700; }
          .exit-section { margin-top:34px; padding-top:20px; border-top:1px solid #d3dce3; }
          .exit-button { width:auto; padding:10px 14px; border:0; background:#b42318; color:#fff; font:inherit; font-weight:800; cursor:pointer; }
          a { color:#176b87; font-weight:700; }
        </style>
      </head>
      <body>
        <main>
          <a href="/student/dashboard">← Back to dashboard</a>
          <h1>Settings</h1>
          ${saved}
          ${leftClass}
          <section class="panel">
            <h2>Appearance</h2>
            <form class="settings-form" method="POST" action="/student/settings">
              <label for="backgroundColor">Dashboard background color</label>
              <select id="backgroundColor" name="backgroundColor">${colorOptions}</select>
              <button class="primary" type="submit">Save settings</button>
            </form>
          </section>
          <section class="panel">
            <h2>Class</h2>
            ${membership
              ? `<p>Currently joined: <strong>${escapeHtml(membership.name)}${membership.section ? ` · ${escapeHtml(membership.section)}` : ''}</strong></p>`
              : '<p>You are not currently in a class.</p>'}
            <div class="exit-section">
              <h3>Leave class</h3>
              <p>Leaving removes your class access. Your completed lesson progress will be kept.</p>
              ${membership
                ? '<form method="POST" action="/student/exit-class"><button class="exit-button" type="submit">Exit class</button></form>'
                : '<button class="exit-button" type="button" disabled style="opacity:.55;cursor:not-allowed;">Exit class</button>'}
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
});

app.post('/student/settings', requireRole('student'), (req, res) => {
  const backgroundColor = String(req.body.backgroundColor || '');
  if (!studentBackgroundColors.some((option) => option.value === backgroundColor)) {
    return res.status(400).send('Please select a supported background color.');
  }

  db.prepare('UPDATE users SET background_color = ? WHERE id = ?').run(backgroundColor, req.user.id);
  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, 'student_settings_updated', 'users', req.user.id, JSON.stringify({ backgroundColor }));
  res.redirect('/student/settings?saved=1');
});

app.post('/student/exit-class', requireRole('student'), (req, res) => {
  const exitClass = db.transaction(() => {
    const enrollment = db.prepare('SELECT class_id FROM enrollments WHERE student_id = ? LIMIT 1').get(req.user.id);
    if (!enrollment) {
      return false;
    }

    db.prepare('DELETE FROM enrollments WHERE student_id = ?').run(req.user.id);
    db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, 'class_exited', 'classes', enrollment.class_id, null);
    return true;
  });
  exitClass();
  res.redirect('/student/settings?leftClass=1');
});

app.get('/student/progress', requireRole('student'), (req, res) => {
  const user = req.user;
  const records = db.prepare(`
    SELECT l.title, lp.status, lp.completed_at
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.student_id = ?
    ORDER BY lp.completed_at DESC
    LIMIT 10
  `).all(user.id);

  res.send(`
    <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Progress</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;background:#f4f7fb} .card{background:#fff;border:1px solid #dfe5ec;border-radius:14px;padding:24px;max-width:900px;margin:auto}</style></head>
    <body><div class="card"><h1>My progress</h1><a href="/student/dashboard">Back to dashboard</a><ul>${records.map((r) => `<li>${r.title} — ${r.status === 'completed' ? 'Completed ' + r.completed_at : r.status}</li>`).join('')}</ul></div></body></html>
  `);
});

app.get('/student/lessons/:slug', requireRole('student'), (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!lesson) {
    return res.status(404).send('Lesson not found or not available.');
  }

  const existing = db.prepare('SELECT * FROM lesson_progress WHERE student_id = ? AND lesson_id = ?').get(req.user.id, lesson.id);
  if (!existing) {
    db.prepare('INSERT INTO lesson_progress (student_id, lesson_id, status, opened_at, completed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)').run(req.user.id, lesson.id, 'opened');
  }

  db.prepare('INSERT INTO activity_events (user_id, lesson_id, event_type, details) VALUES (?, ?, ?, ?)')
    .run(req.user.id, lesson.id, 'lesson_opened', JSON.stringify({ title: lesson.title }));

  const notes = (getLessonSourceHtml(lesson) || lesson.content || 'The lesson content is ready to be migrated into the LMS editor.').replace(/<div class="notes-box">[\s\S]*?<\/div>/gi, '');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${lesson.title} | CyberAcademy</title>
        <style>
          :root { --bg:#edf3f8; --panel:#fff; --ink:#132638; --muted:#52677d; --line:#dfeaf4; --primary:#1f4e79; --primary-soft:#edf4fc; --success:#1d7a5f; --success-soft:#eafaf3; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:Arial,sans-serif; background:linear-gradient(180deg,#edf3f8,#f7fafc); color:var(--ink); }
          .shell { max-width:1200px; margin:0 auto; padding:28px 20px 40px; }
          .topbar { display:flex; justify-content:space-between; gap:18px; align-items:center; margin-bottom:20px; }
          .meta { color:var(--muted); font-size:0.9rem; }
          .layout { display:grid; grid-template-columns: 1fr; gap:24px; }
          .panel { background:var(--panel); border:1px solid var(--line); border-radius:18px; box-shadow:0 16px 30px rgba(19,41,64,0.06); }
          .content-panel { padding:24px; }
          h1 { margin:0 0 10px; font-size:clamp(2rem, 3vw, 2.8rem); letter-spacing:-0.05em; }
          .summary { color:var(--muted); margin-bottom:16px; }
          .section-label { display:inline-block; margin-bottom:10px; color:var(--primary); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; font-size:0.72rem; }
          .notes-box { background:linear-gradient(180deg,#f6f9ff,#edf4ff); border:1px solid var(--line); border-radius:16px; color:var(--ink); padding:18px 20px; line-height:1.7; overflow:auto; }
          .notes-box > *:first-child { margin-top:0; }
          .notes-box .tag { display:inline-block; margin-bottom:8px; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; font-weight:700; color:var(--primary); background:var(--primary-soft); padding:6px 10px; border-radius:999px; }
          .notes-box h2, .notes-box h3 { margin:8px 0 10px; }
          .notes-box p, .notes-box li, .notes-box td, .notes-box th { font-size:0.98rem; }
          .notes-box .layer-diagram { display:flex; flex-wrap:wrap; gap:8px; margin:18px 0; }
          .notes-box .layer-diagram span { background:#ecf4ff; color:var(--primary); border:1px solid #dfeafc; border-radius:999px; padding:8px 12px; font-weight:600; }
          .notes-box .accordion { margin-top:16px; }
          .notes-box .accordion-item { border:1px solid var(--line); border-radius:12px; margin-top:10px; overflow:hidden; }
          .notes-box .accordion-toggle { width:100%; text-align:left; font-weight:700; border:none; background:#f7faff; padding:12px 16px; cursor:pointer; }
          .notes-box .accordion-panel { padding:0 16px 16px; }
          .notes-box .accordion-panel[hidden] { display:none; }
          .notes-box .accordion-item.open .accordion-panel { display:block; }
          .quiz-card { margin-top:18px; padding:18px; border:1px solid var(--line); border-radius:14px; background:#f9fbff; }
          .choice-row { display:grid; grid-template-columns:1fr; gap:10px; margin-top:12px; }
          .option-button { width:100%; text-align:left; border:1px solid var(--line); background:#fff; border-radius:10px; padding:12px 14px; font:inherit; cursor:pointer; transition:all 0.15s ease; }
          .option-button:hover { border-color:var(--primary); }
          .option-button.selected { border-color:var(--primary); background:#edf4fc; }
          .option-button.correct { border-color:#1d7a5f; background:#eafaf3; }
          .option-button.incorrect { border-color:#b42318; background:#fdf3f3; }
          .answer-box { margin-top:14px; padding:12px 14px; border-radius:10px; background:#eefcf5; border:1px solid rgba(29,122,95,0.2); color:#184a38; }
          .actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:22px; }
          .btn, .secondary { display:inline-flex; justify-content:center; align-items:center; padding:12px 16px; border-radius:10px; text-decoration:none; font-weight:700; }
          .btn { background:linear-gradient(135deg,#1f4e79,#153d61); color:white; }
          .secondary { background:var(--primary-soft); color:var(--primary); }
          @media (max-width: 820px) { .layout { grid-template-columns:1fr; } }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="topbar">
            <div class="meta"><a href="/student/dashboard">Student dashboard</a> / ${lesson.slug}</div>
            <span class="secondary" style="background:#edf3fb;">Module: ${lesson.title}</span>
          </div>

          <div class="layout">
            <main class="panel content-panel">
              <div class="section-label">Original notes</div>
              <h1>${lesson.title}</h1>
              <p class="summary">${lesson.summary}</p>
              <div class="notes-box">${notes}</div>
              <div class="actions">
                <a class="btn" href="/student/lessons/${lesson.slug}?complete=1">Mark as complete</a>
                <a class="secondary" href="/student/dashboard">Return to dashboard</a>
              </div>
            </main>
          </div>
        </div>

        <script>
          const complete = new URLSearchParams(window.location.search).get('complete');
          if (complete === '1') {
            fetch('/api/progress/${lesson.id}', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
              .then(() => { window.location.href = '/student/dashboard'; })
              .catch(() => { window.location.href = '/student/dashboard'; });
          }

          document.querySelectorAll('.accordion-toggle').forEach((button) => {
            const item = button.closest('.accordion-item');
            const panel = item ? item.querySelector('.accordion-panel') : null;
            if (!panel) return;
            panel.hidden = !item.classList.contains('open');
            button.addEventListener('click', () => {
              const shouldOpen = !item.classList.contains('open');
              item.classList.toggle('open', shouldOpen);
              button.setAttribute('aria-expanded', String(shouldOpen));
              panel.hidden = !shouldOpen;
            });
          });

          document.querySelectorAll('.quiz-card').forEach((card) => {
            const correctValue = card.dataset.correct;
            const buttons = card.querySelectorAll('.option-button');
            const answerBox = card.querySelector('.answer-box');

            buttons.forEach((button) => {
              button.addEventListener('click', () => {
                const selected = button.dataset.answer;

                buttons.forEach((btn) => {
                  btn.disabled = true;
                  btn.classList.remove('selected', 'correct', 'incorrect');
                  if (btn.dataset.answer === correctValue) {
                    btn.classList.add('correct');
                  }
                });

                button.classList.add('selected');
                if (selected === correctValue) {
                  button.classList.add('correct');
                } else {
                  button.classList.add('incorrect');
                }

                if (answerBox) {
                  answerBox.hidden = false;
                }
              });
            });
          });
        </script>
      </body>
    </html>
  `);
});

app.post('/api/progress/:lessonId', requireRole('student'), (req, res) => {
  const lessonId = Number(req.params.lessonId);
  const lesson = db.prepare('SELECT id FROM lessons WHERE id = ?').get(lessonId);
  if (!lesson) {
    return res.status(404).json({ ok: false, message: 'Lesson not found.' });
  }

  db.prepare(`
    INSERT INTO lesson_progress (student_id, lesson_id, status, opened_at, completed_at)
    VALUES (?, ?, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(student_id, lesson_id)
    DO UPDATE SET status = 'completed', completed_at = CURRENT_TIMESTAMP
  `).run(req.user.id, lessonId);

  db.prepare('INSERT INTO activity_events (user_id, lesson_id, event_type, details) VALUES (?, ?, ?, ?)')
    .run(req.user.id, lessonId, 'lesson_completed', JSON.stringify({ source: 'student_portal' }));

  res.json({ ok: true, message: 'Lesson marked complete.' });
});

app.get('/teacher/dashboard', requireRole('teacher'), (req, res) => {
  const user = req.user;
  const overview = getTeacherOverview(user.id);
  const classes = db.prepare(`
    SELECT c.id, c.name, c.section, c.class_code, COUNT(e.student_id) AS student_count
    FROM classes c
    LEFT JOIN enrollments e ON e.class_id = c.id
    WHERE c.teacher_id = ?
    GROUP BY c.id
  `).all(user.id);

  const rowHtml = classes.length ? classes.map((cls) => `
    <div class="class-card">
      <h3>${escapeHtml(cls.name)}</h3>
      <p>${cls.section ? escapeHtml(cls.section) : ''}</p>
      <p>Class code: <strong><code>${escapeHtml(cls.class_code)}</code></strong></p>
      <small>${cls.student_count} students</small>
    </div>
  `).join('') : '<p>No classes yet.</p>';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Teacher Dashboard | CyberAcademy</title>
        <style>
          :root { --bg:#f4f6f8; --panel:#fff; --ink:#172b3a; --muted:#586b78; --line:#d3dce3; --primary:#176b87; --primary-soft:#e2f2f6; --gold:#ffbf47; --navy:#142d3c; --success:#176b52; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:"Trebuchet MS","Segoe UI",sans-serif; background-color:var(--bg); color:var(--ink); }
          .shell { display:flex; min-height:100vh; overflow-x:hidden; }
          aside { flex:0 0 250px; width:250px; background:var(--navy); color:white; padding:24px 18px; transition:transform .24s ease,flex-basis .24s ease,width .24s ease,padding .24s ease,visibility .24s ease; }
          .shell.sidebar-hidden aside { flex-basis:0; width:0; min-width:0; padding-left:0; padding-right:0; overflow:hidden; transform:translateX(-100%); visibility:hidden; }
          .brand { font-size:1.35rem; font-weight:900; letter-spacing:-.04em; margin-bottom:32px; }
          nav a { display:block; text-decoration:none; color:#e4edf1; padding:11px 12px; margin:7px 0; font-weight:700; }
          nav a:hover, nav a:focus-visible { background:rgba(255,255,255,.1); }
          main { flex:1; min-width:0; padding:28px clamp(18px,4vw,48px); }
          .topbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:22px; }
          .topbar h2 { margin:5px 0 0; font-size:clamp(1.6rem,3vw,2.2rem); letter-spacing:-.04em; }
          .topbar p { margin:0; color:var(--muted); font-weight:700; }
          .menu-button { display:inline-flex; align-items:center; gap:9px; background:var(--primary); border:2px solid var(--navy); color:#fff; padding:9px 13px; font:inherit; font-weight:800; }
          .menu-button:hover { background:#10566f; }
          .menu-button:focus-visible, .logout:focus-visible, nav a:focus-visible { outline:3px solid var(--gold); outline-offset:3px; }
          .menu-icon { font-size:1.2rem; line-height:1; }
          .sidebar-backdrop { display:none; }
          .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; }
          .card { background:var(--panel); border:1px solid var(--line); padding:18px; }
          .card small { color:var(--muted); text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
          .card h3 { color:var(--primary); margin:8px 0 0; font-size:2rem; }
          .class-card { background:var(--panel); border:1px solid var(--line); padding:20px; margin-top:22px; }
          .class-card h3 { margin-bottom:14px; }
          .class-card .class-card { margin-top:12px; }
          .class-card p { color:var(--muted); }
          .class-form { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; align-items:end; margin-top:16px; }
          .class-form label { display:grid; gap:7px; color:var(--muted); font-weight:800; }
          .class-form input, .class-form button { min-width:0; padding:11px 12px; font:inherit; }
          .class-form input { border:1px solid var(--line); }
          .class-form button { background:var(--primary); border:0; color:white; font-weight:800; cursor:pointer; }
          .class-created { padding:12px; background:var(--primary-soft); color:var(--ink); }
          .logout { background:transparent; border:1px solid rgba(255,255,255,.5); color:white; padding:10px 12px; font:inherit; font-weight:700; }
          @media (max-width:760px) {
            .shell { display:block; }
            .shell aside { position:fixed; z-index:12; inset:0 auto 0 0; width:min(290px,86vw); overflow-y:auto; transform:translateX(-100%); visibility:hidden; }
            .shell:not(.sidebar-hidden) aside { transform:translateX(0); visibility:visible; }
            .shell.sidebar-hidden aside { flex-basis:auto; width:min(290px,86vw); padding:24px 18px; }
            .sidebar-backdrop:not([hidden]) { display:block; position:fixed; z-index:11; inset:0; width:100%; height:100%; border:0; background:rgba(9,24,34,.48); }
            main { padding:20px 16px; }
          }
          @media (max-width:520px) {
            .topbar { align-items:flex-start; }
            .topbar-intro { align-items:flex-start; gap:12px; }
            .topbar h2 { font-size:1.35rem; }
            .menu-button { padding:8px 10px; }
            .menu-label { display:none; }
          }
          @media (prefers-reduced-motion:reduce) { aside { transition:none; } }
        </style>
      </head>
      <body>
        <div class="shell" id="dashboardShell">
          <aside id="dashboardSidebar" aria-label="Teacher navigation">
            <div class="brand">CyberAcademy</div>
            <nav aria-label="Teacher dashboard">
              <a href="/teacher/dashboard">Overview</a>
              <a href="/teacher/curriculum">Curriculum</a>
              <a href="/teacher/assignments">Assignments</a>
              <a href="/teacher/permissions">Permissions</a>
            </nav>
            <form method="POST" action="/logout" style="margin-top:24px;">
              <button class="logout" type="submit">Log out</button>
            </form>
          </aside>
          <button class="sidebar-backdrop" id="sidebarBackdrop" type="button" aria-label="Close navigation" hidden></button>
          <main>
            <div class="topbar">
              <div class="topbar-intro">
                <button class="menu-button" id="menuToggle" type="button" aria-controls="dashboardSidebar" aria-expanded="true"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-label">Hide menu</span></button>
                <div>
                <p>Teacher portal</p>
                <h2>Welcome back, ${escapeHtml(user.username)}!</h2>
                </div>
              </div>
            </div>
            <div class="cards">
              <div class="card"><small>Classes</small><h3>${overview.classCount}</h3></div>
              <div class="card"><small>Students</small><h3>${overview.studentCount}</h3></div>
              <div class="card"><small>Published lessons</small><h3>${overview.lessonCount}</h3></div>
            </div>
            <div class="class-card">
              <h3>Your classes</h3>
              ${req.query.classCreated === '1' ? '<p class="class-created" role="status">Class created. Share its seven-character code with your students.</p>' : ''}
              <form class="class-form" method="POST" action="/teacher/classes">
                <label>Class name<input type="text" name="name" maxlength="80" required></label>
                <label>Section (optional)<input type="text" name="section" maxlength="40"></label>
                <button type="submit">Create class</button>
              </form>
              ${rowHtml}
            </div>
          </main>
        </div>
        <script>
          const dashboardShell = document.getElementById('dashboardShell');
          const menuToggle = document.getElementById('menuToggle');
          const sidebarBackdrop = document.getElementById('sidebarBackdrop');
          const dashboardSidebar = document.getElementById('dashboardSidebar');

          function setSidebarOpen(isOpen) {
            dashboardShell.classList.toggle('sidebar-hidden', !isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.querySelector('.menu-label').textContent = isOpen ? 'Hide menu' : 'Menu';
            sidebarBackdrop.hidden = !isOpen || !window.matchMedia('(max-width: 760px)').matches;
          }

          setSidebarOpen(!window.matchMedia('(max-width: 760px)').matches);
          menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            setSidebarOpen(!isOpen);
            if (!isOpen && window.matchMedia('(max-width: 760px)').matches) {
              dashboardSidebar.querySelector('nav a').focus();
            }
          });
          sidebarBackdrop.addEventListener('click', () => {
            setSidebarOpen(false);
            menuToggle.focus();
          });
          document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
              setSidebarOpen(false);
              menuToggle.focus();
            }
          });
          window.addEventListener('resize', () => {
            sidebarBackdrop.hidden = menuToggle.getAttribute('aria-expanded') !== 'true' || !window.matchMedia('(max-width: 760px)').matches;
          });
        </script>
      </body>
    </html>
  `);
});

app.post('/teacher/classes', requireRole('teacher'), (req, res) => {
  const name = String(req.body.name || '').trim();
  const section = String(req.body.section || '').trim();
  if (!name || name.length > 80 || section.length > 40) {
    return res.status(400).send('Enter a class name of up to 80 characters and a section of up to 40 characters.');
  }

  const course = db.prepare('SELECT id FROM courses ORDER BY id ASC LIMIT 1').get();
  if (!course) {
    return res.status(500).send('A course must be set up before creating a class.');
  }

  const classCode = generateClassCode();
  const classId = db.prepare(`
    INSERT INTO classes (name, section, class_code, teacher_id, course_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, section || null, classCode, req.user.id, course.id).lastInsertRowid;
  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, 'class_created', 'classes', classId, JSON.stringify({ classCode, name, section }));

  res.redirect('/teacher/dashboard?classCreated=1');
});

app.get('/teacher/curriculum', requireRole('teacher'), (req, res) => {
  const courses = db.prepare('SELECT * FROM courses ORDER BY id ASC').all();
  const teacherClasses = db.prepare('SELECT id, name, section FROM classes WHERE teacher_id = ? ORDER BY id ASC').all(req.user.id);
  const defaultCourse = courses[0];
  const units = defaultCourse ? db.prepare('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC').all(defaultCourse.id) : [];
  const defaultUnit = units[0];
  const modules = defaultUnit ? db.prepare('SELECT * FROM lessons WHERE unit_id = ? ORDER BY order_index ASC').all(defaultUnit.id) : [];
  const allModules = db.prepare(`
    SELECT l.id, l.title, l.slug, l.unit_id, l.published, u.code, u.title AS unit_title
    FROM lessons l
    JOIN units u ON u.id = l.unit_id
    WHERE u.course_id = ?
    ORDER BY u.sort_order ASC, l.order_index ASC
  `).all(defaultCourse ? defaultCourse.id : 0);

  const courseOptions = courses.map((course) => `<option value="${course.id}">${course.name}</option>`).join('');
  const unitOptions = units.map((unit) => `<option value="${unit.id}">${unit.code} • ${unit.title}</option>`).join('');
  const groupedModuleOptions = units.map((unit) => {
    const unitModules = allModules.filter((module) => module.unit_id === unit.id);
    return `
      <optgroup label="${unit.code} • ${unit.title}">
        ${unitModules.map((module) => `<option value="${module.id}">${module.slug} • ${module.title} ${module.published ? '(Published)' : '(Draft)'}</option>`).join('') || '<option value="">No modules in this unit</option>'}
      </optgroup>
    `;
  }).join('');
  const classOptions = teacherClasses.map((classRow) => `
    <option value="${classRow.id}">${escapeHtml(classRow.name)}${classRow.section ? ` · ${escapeHtml(classRow.section)}` : ''}</option>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Curriculum Manager | CyberAcademy</title>
        <style>
          :root { --bg:#edf3f8; --panel:#fff; --ink:#132638; --muted:#52677d; --line:#dfeaf4; --primary:#1f4e79; --primary-soft:#edf4fc; --warning:#8d5b23; --warning-soft:#fdf5e7; --success:#1d7a5f; --success-soft:#eafaf3; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:Arial,sans-serif; background:linear-gradient(180deg,#edf3f8,#f7fafc); color:var(--ink); }
          .shell { max-width:1200px; margin:0 auto; padding:24px; }
          .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:20px; }
          .panel { background:var(--panel); border:1px solid var(--line); border-radius:18px; box-shadow:0 16px 30px rgba(19,41,64,0.06); }
          .builder { padding:24px; }
          .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:16px; margin-top:20px; }
          label { display:grid; gap:8px; font-weight:700; color:var(--muted); }
          input, select, button { width:100%; padding:12px 14px; border-radius:10px; border:1px solid var(--line); font:inherit; }
          button { background:linear-gradient(135deg,var(--primary),#163d5d); color:#fff; border-color:var(--primary); font-weight:700; cursor:pointer; }
          .secondary { background:var(--primary-soft); color:var(--primary); border-color:var(--primary-soft); }
          .module-list { margin-top:24px; display:grid; gap:16px; }
          .module-row { display:flex; justify-content:space-between; gap:12px; align-items:center; padding:16px 18px; border:1px solid var(--line); border-radius:14px; background:#fafcff; }
          .badge { display:inline-flex; padding:6px 10px; border-radius:999px; background:var(--warning-soft); color:var(--warning); font-size:0.72rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; }
          .badge.published { background:var(--success-soft); color:var(--success); }
          .meta { color:var(--muted); font-size:0.9rem; }
          .mini-links { display:flex; gap:10px; align-items:center; }
          @media (max-width: 720px) { .grid { grid-template-columns:1fr; } }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="topbar">
            <div>
              <div class="meta"><a href="/teacher/dashboard">Teacher dashboard</a> / Curriculum manager</div>
              <h1 style="margin:8px 0 0;">Curriculum</h1>
            </div>
            <a class="secondary" href="/teacher/assignments" style="display:inline-flex; text-decoration:none; width:auto;">Go to assignments</a>
          </div>

          <div class="panel builder">
            <form method="POST" action="/teacher/curriculum/publish">
              <div class="grid">
                <label>
                  Course
                  <select name="courseId" aria-label="Course">
                    ${courseOptions || '<option value="">No course available</option>'}
                  </select>
                </label>
                <label>
                  Unit
                  <select name="unitId" aria-label="Unit">
                    ${unitOptions || '<option value="">No unit available</option>'}
                  </select>
                </label>
                <label>
                  Module
                  <select name="moduleId" aria-label="Module">
                    ${groupedModuleOptions || '<option value="">No module available</option>'}
                  </select>
                </label>
              </div>

              <div class="schedule-box" style="display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:16px; margin-top:20px; padding-top:18px; border-top:1px solid var(--line);">
                <label>
                  Assign to class
                  <select name="classId" aria-label="Class for assignment">
                    <option value="">Select a class</option>
                    ${classOptions}
                  </select>
                </label>
                <label>
                  Assignment title
                  <input type="text" name="assignmentTitle" placeholder="Unit reflection" />
                </label>
                <label>
                  Release date
                  <input type="datetime-local" name="releaseAt" />
                </label>
                <label>
                  Due date
                  <input type="datetime-local" name="dueAt" />
                </label>
              </div>

              <div class="grid" style="margin-top:18px;">
                <button type="submit">Publish selected module</button>
                <button type="submit" class="secondary">Schedule assignment</button>
                <button type="button" class="secondary" onclick="location.href='/teacher/curriculum'">Refresh</button>
                <button type="button" class="secondary" onclick="location.href='/teacher/permissions'">View progress</button>
              </div>
            </form>

            <div class="module-list">
              ${modules.map((module) => `
                <div class="module-row">
                  <div>
                    <strong>${module.title}</strong><br>
                    <span class="meta">${defaultUnit ? defaultUnit.title : 'Unit'} • ${module.published ? 'Published' : 'Draft'}</span>
                  </div>
                  <div class="mini-links">
                    <span class="badge ${module.published ? 'published' : ''}">${module.published ? 'Published' : 'Draft'}</span>
                    <a href="/teacher/lessons/${module.id}/edit" style="color:var(--primary); font-weight:700; text-decoration:none;">Edit</a>
                  </div>
                </div>
              `).join('') || '<p class="meta">No modules are available for the selected unit yet.</p>'}
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post('/teacher/curriculum/publish', requireRole('teacher'), (req, res) => {
  const moduleId = Number(req.body.moduleId || 0);
  const unitId = Number(req.body.unitId || 0);
  const assignmentTitle = String(req.body.assignmentTitle || '').trim();
  const releaseAt = String(req.body.releaseAt || '').trim();
  const dueAt = String(req.body.dueAt || '').trim();
  const classId = Number(req.body.classId || 0);

  if (!moduleId) {
    return res.status(400).send('Please select a module to publish.');
  }

  const lesson = db.prepare('SELECT published, title FROM lessons WHERE id = ?').get(moduleId);
  if (!lesson) {
    return res.status(404).send('Module not found.');
  }

  if (assignmentTitle || releaseAt || dueAt) {
    if (!classId) {
      return res.status(400).send('Select a class to schedule this assignment.');
    }
    const teacherClass = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
    if (!teacherClass) {
      return res.status(403).send('You can only schedule assignments for your own classes.');
    }
    const normalizedTitle = assignmentTitle || `${lesson.title} Assignment`;
    db.prepare(`
      INSERT INTO assignments (lesson_id, class_id, title, release_at, due_at, published, created_by)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(moduleId, classId, normalizedTitle, releaseAt || null, dueAt || null, req.user.id);
  }

  db.prepare('UPDATE lessons SET published = ? WHERE id = ?').run(lesson.published ? 0 : 1, moduleId);
  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, 'lesson_publish_toggle', 'lessons', moduleId, JSON.stringify({ unitId, published: !lesson.published, assignmentTitle, releaseAt, dueAt, title: lesson.title }));

  res.redirect('/teacher/curriculum');
});

app.get('/teacher/assignments', requireRole('teacher'), (req, res) => {
  const courses = db.prepare('SELECT * FROM courses ORDER BY id ASC').all();
  const teacherClasses = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY id ASC').all(req.user.id);
  const units = db.prepare('SELECT * FROM units ORDER BY sort_order ASC').all();
  const lessons = db.prepare(`
    SELECT l.id, l.title, l.slug, u.code, u.title AS unit_title, l.published
    FROM lessons l
    JOIN units u ON u.id = l.unit_id
    ORDER BY u.sort_order, l.order_index
  `).all();
  const assignments = db.prepare(`
    SELECT a.id, a.title, a.due_at, a.release_at, a.class_id, l.title AS lesson_title, u.title AS unit_title, c.name AS class_name, c.section AS class_section
    FROM assignments a
    LEFT JOIN lessons l ON l.id = a.lesson_id
    LEFT JOIN units u ON u.id = l.unit_id
    LEFT JOIN classes c ON c.id = a.class_id
    WHERE a.created_by = ?
    ORDER BY a.created_at DESC
  `).all(req.user.id);

  const lessonOptions = units.map((unit) => {
    const moduleOptions = lessons
      .filter((lesson) => lesson.unit_title === unit.title)
      .map((lesson) => `<option value="${lesson.id}">${lesson.slug} • ${lesson.title}</option>`)
      .join('');

    return `
      <optgroup label="${unit.code} • ${unit.title}">
        ${moduleOptions || '<option value="">No modules in this unit</option>'}
      </optgroup>
    `;
  }).join('');
  const classOptions = teacherClasses.length
    ? teacherClasses.map((cls) => `<option value="${cls.id}">${escapeHtml(cls.name)}${cls.section ? ` • ${escapeHtml(cls.section)}` : ''}</option>`).join('')
    : '<option value="" disabled selected>No classes created yet</option>';
  const assignmentRows = assignments.length ? assignments.map((assignment) => `
    <div class="module-row">
      <div>
        <strong>${escapeHtml(assignment.title)}</strong><br>
        <span class="meta">${escapeHtml(assignment.unit_title || 'Unit')} • ${escapeHtml(assignment.lesson_title || 'Lesson')}${assignment.class_name ? ` • ${escapeHtml(assignment.class_name)}${assignment.class_section ? ` (${escapeHtml(assignment.class_section)})` : ''}` : ''}</span>
      </div>
      <div>
        <span class="meta">Release: ${assignment.release_at || 'Not set'}<br>Due: ${assignment.due_at || 'Not set'}</span>
      </div>
    </div>
  `).join('') : '<p class="meta">No assignments scheduled yet.</p>';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Assignment Manager | CyberAcademy</title>
        <style>
          :root { --bg:#edf3f8; --panel:#fff; --ink:#132638; --muted:#52677d; --line:#dfeaf4; --primary:#1f4e79; --primary-soft:#edf4fc; --warning:#8d5b23; --warning-soft:#fdf5e7; --success:#1d7a5f; --success-soft:#eafaf3; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:Arial,sans-serif; background:linear-gradient(180deg,#edf3f8,#f7fafc); color:var(--ink); }
          .shell { max-width:1200px; margin:0 auto; padding:24px; }
          .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:20px; }
          .panel { background:var(--panel); border:1px solid var(--line); border-radius:18px; box-shadow:0 16px 30px rgba(19,41,64,0.06); }
          .builder { padding:24px; }
          .grid { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:16px; margin-top:20px; }
          label { display:grid; gap:8px; font-weight:700; color:var(--muted); }
          input, select, button { width:100%; padding:12px 14px; border-radius:10px; border:1px solid var(--line); font:inherit; }
          button { background:linear-gradient(135deg,var(--primary),#163d5d); color:#fff; border-color:var(--primary); font-weight:700; cursor:pointer; }
          .secondary { background:var(--primary-soft); color:var(--primary); border-color:var(--primary-soft); }
          .module-row { display:flex; justify-content:space-between; gap:12px; align-items:center; padding:16px 18px; border:1px solid var(--line); border-radius:14px; background:#fafcff; margin-top:14px; }
          .meta { color:var(--muted); font-size:0.9rem; }
          @media (max-width: 720px) { .grid { grid-template-columns:1fr; } }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="topbar">
            <div>
              <div class="meta"><a href="/teacher/dashboard">Teacher dashboard</a> / Assignment manager</div>
              <h1 style="margin:8px 0 0;">Assignments</h1>
            </div>
            <a class="secondary" href="/teacher/curriculum" style="display:inline-flex; text-decoration:none; width:auto;">Go to curriculum</a>
          </div>

          <div class="panel builder">
            <form method="POST" action="/teacher/assignments/schedule">
              <div class="grid">
                <label>
                  Course
                  <select name="courseId" aria-label="Course">
                    ${courses.map((course) => `<option value="${course.id}">${course.name}</option>`).join('')}
                  </select>
                </label>
                <label>
                  Unit
                  <select name="unitId" aria-label="Unit">
                    ${units.map((unit) => `<option value="${unit.id}">${unit.title}</option>`).join('')}
                  </select>
                </label>
                <label>
                  Module
                  <select name="lessonId" aria-label="Module">
                    ${lessonOptions || '<option value="">No module available</option>'}
                  </select>
                </label>
                <label>
                  Assign to class
                  <select name="classId" aria-label="Class" required>
                    ${classOptions}
                  </select>
                </label>
                <label>
                  Assignment title
                  <input type="text" name="assignmentTitle" placeholder="1.4 reflection" />
                </label>
              </div>

              <div class="grid" style="margin-top:18px;">
                <label>
                  Release date
                  <input type="datetime-local" name="releaseAt" />
                </label>
                <label>
                  Due date
                  <input type="datetime-local" name="dueAt" />
                </label>
                <div style="display:flex; align-items:flex-end;">
                  <button type="submit">Schedule assignment</button>
                </div>
                <div style="display:flex; align-items:flex-end;">
                  <button type="button" class="secondary" onclick="location.href='/teacher/assignments'">Refresh</button>
                </div>
              </div>
            </form>

            <div style="margin-top:30px;">
              <h3 style="margin-bottom: 12px;">Scheduled assignments</h3>
              ${assignmentRows}
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post('/teacher/assignments/schedule', requireRole('teacher'), (req, res) => {
  const lessonId = Number(req.body.lessonId || 0);
  const classId = Number(req.body.classId || 0);
  const title = String(req.body.assignmentTitle || '').trim();
  const releaseAt = String(req.body.releaseAt || '').trim();
  const dueAt = String(req.body.dueAt || '').trim();

  if (!lessonId || !classId) {
    return res.status(400).send('Please select both a module and a class for the assignment.');
  }

  const lesson = db.prepare('SELECT title FROM lessons WHERE id = ?').get(lessonId);
  if (!lesson) {
    return res.status(404).send('Module not found.');
  }
  const teacherClass = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
  if (!teacherClass) {
    return res.status(403).send('You can only schedule assignments for your own classes.');
  }

  const assignmentTitle = title || `${lesson.title} Assignment`;
  db.prepare(`
    INSERT INTO assignments (lesson_id, class_id, title, release_at, due_at, published, created_by)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `).run(lessonId, classId || null, assignmentTitle, releaseAt || null, dueAt || null, req.user.id);

  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, 'assignment_created', 'assignments', lessonId, JSON.stringify({ title: assignmentTitle, classId, releaseAt, dueAt }));

  res.redirect('/teacher/assignments');
});

app.get('/teacher/lessons/:lessonId/edit', requireRole('teacher'), (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.lessonId);
  if (!lesson) return res.status(404).send('Lesson not found.');

  res.send(`
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><title>Edit ${lesson.title}</title>
    <style>body{font-family:Arial,sans-serif;background:#f4f7fb;padding:24px} form{max-width:800px;background:#fff;padding:24px;border:1px solid #dfe5ec;border-radius:14px;} textarea,input{width:100%;padding:10px;border-radius:8px;border:1px solid #dfe5ec;margin-top:10px} button{margin-top:16px;background:#1f4e79;color:white;padding:10px 16px;border:0;border-radius:8px}</style></head>
    <body>
      <a href="/teacher/curriculum">Back to curriculum</a>
      <form method="POST" action="/teacher/lessons/${lesson.id}/save">
        <h1>${lesson.title}</h1>
        <label>Lesson title<input name="title" value="${lesson.title}"></label>
        <label>Summary<textarea name="summary" rows="4">${lesson.summary || ''}</textarea></label>
        <label>Content<textarea name="content" rows="18">${lesson.content || ''}</textarea></label>
        <button type="submit">Save lesson</button>
      </form>
    </body></html>
  `);
});

app.post('/teacher/lessons/:lessonId/save', requireRole('teacher'), (req, res) => {
  const lessonId = Number(req.params.lessonId);
  const title = String(req.body.title || '').trim();
  const summary = String(req.body.summary || '').trim();
  const content = String(req.body.content || '').trim();

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  db.prepare('INSERT INTO lesson_versions (lesson_id, content, version_note, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)').run(lessonId, content, 'teacher edited lesson');
  db.prepare('UPDATE lessons SET title = ?, summary = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, summary, content, lessonId);
  db.prepare('INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, 'lesson_updated', 'lessons', lessonId, JSON.stringify({ title }));

  res.redirect('/teacher/curriculum');
});

app.get('/teacher/permissions', requireRole('teacher'), (req, res) => {
  const lessons = db.prepare(`
    SELECT l.id, l.title, u.title AS unit_title, l.published
    FROM lessons l
    JOIN units u ON u.id = l.unit_id
    ORDER BY u.sort_order, l.order_index
  `).all();

  const rows = lessons.map((lesson) => `
    <li>
      <strong>${lesson.unit_title}</strong> — ${lesson.title}
      <span>${lesson.published ? 'Published' : 'Draft'}</span>
      <form method="POST" action="/teacher/permissions/${lesson.id}/toggle" style="display:inline;">
        <button type="submit">${lesson.published ? 'Unpublish' : 'Publish'}</button>
      </form>
    </li>
  `).join('');

  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Permissions</title><style>body{font-family:Arial,sans-serif;background:#f4f7fb;padding:24px} .card{background:#fff;border:1px solid #dfe5ec;border-radius:14px;padding:20px;max-width:900px}</style></head><body><div class="card"><a href="/teacher/dashboard">Back</a><h1>Lesson access controls</h1><ul>${rows}</ul></div></body></html>`);
});

app.post('/teacher/permissions/:lessonId/toggle', requireRole('teacher'), (req, res) => {
  const lessonId = Number(req.params.lessonId);
  const current = db.prepare('SELECT published FROM lessons WHERE id = ?').get(lessonId);
  if (!current) return res.status(404).send('Lesson not found.');
  db.prepare('UPDATE lessons SET published = ? WHERE id = ?').run(current.published ? 0 : 1, lessonId);
  res.redirect('/teacher/permissions');
});

app.use(express.static(rootDir, { index: 'index.html' }));

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1><a href="/">Return home</a>');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CyberAcademy LMS running at http://localhost:${PORT}`);
  });
}

module.exports = { app, db, pruneStaleCourseData };
