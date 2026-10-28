const STORAGE_KEY = 'cyberacademy-portal-v1';

const defaultState = {
  theme: 'light',
  currentUserId: null,
  selectedClassId: null,
  users: [
    {
      id: 'teacher-1',
      name: 'Ms. Carter',
      email: 'teacher@cyberacademy.edu',
      password: 'password123',
      role: 'teacher'
    },
    {
      id: 'student-1',
      name: 'Ava Johnson',
      email: 'student@cyberacademy.edu',
      password: 'password123',
      role: 'student'
    }
  ],
  classes: [
    {
      id: 'class-1',
      name: 'Introduction to Cybersecurity',
      section: 'A-101',
      room: 'Room 204',
      schedule: 'Mon/Wed 9:00 AM',
      joinCode: 'CSEC-101',
      teacherId: 'teacher-1',
      students: ['student-1']
    },
    {
      id: 'class-2',
      name: 'Network Security Lab',
      section: 'B-206',
      room: 'Lab 3',
      schedule: 'Tue/Thu 1:00 PM',
      joinCode: 'NET-204',
      teacherId: 'teacher-1',
      students: []
    }
  ]
};

let appState = loadState();

const elements = {
  body: document.body,
  themeToggle: document.getElementById('themeToggle'),
  loginButton: document.getElementById('loginButton'),
  logoutButton: document.getElementById('logoutButton'),
  authModal: document.getElementById('authModal'),
  closeAuthModal: document.getElementById('closeAuthModal'),
  guestState: document.getElementById('guestState'),
  dashboard: document.getElementById('dashboard'),
  userName: document.getElementById('userName'),
  userRole: document.getElementById('userRole'),
  classList: document.getElementById('classList'),
  classDetails: document.getElementById('classDetails'),
  classSectionTitle: document.getElementById('classSectionTitle'),
  rosterTitle: document.getElementById('rosterTitle'),
  teacherCreatePanel: document.getElementById('teacherCreatePanel'),
  studentJoinPanel: document.getElementById('studentJoinPanel'),
  loginForm: document.getElementById('loginForm'),
  signupForm: document.getElementById('signupForm'),
  createClassForm: document.getElementById('createClassForm'),
  joinClassForm: document.getElementById('joinClassForm')
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return stored ? { ...defaultState, ...stored } : structuredClone(defaultState);
  } catch (error) {
    console.warn('Unable to restore saved state. Using defaults.', error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getCurrentUser() {
  return appState.users.find((user) => user.id === appState.currentUserId) || null;
}

function setTheme(theme) {
  appState.theme = theme;
  document.body.classList.toggle('dark', theme === 'dark');
  const label = theme === 'dark' ? 'Light mode' : 'Dark mode';
  if (elements.themeToggle) {
    elements.themeToggle.textContent = label;
  }
  saveState();
}

function openAuthModal(mode = 'login') {
  elements.authModal.classList.remove('hidden');
  elements.authModal.setAttribute('aria-hidden', 'false');

  document.querySelectorAll('.auth-tab').forEach((tab) => {
    const isActive = tab.dataset.authTab === mode;
    tab.classList.toggle('active', isActive);
  });

  document.querySelectorAll('.auth-panel').forEach((panel) => {
    const isActive = panel.dataset.authPanel === mode;
    panel.classList.toggle('active', isActive);
    panel.classList.toggle('hidden', !isActive);
  });
}

function closeAuthModal() {
  elements.authModal.classList.add('hidden');
  elements.authModal.setAttribute('aria-hidden', 'true');
}

function getClassesForCurrentUser() {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  if (user.role === 'teacher') {
    return appState.classes.filter((item) => item.teacherId === user.id);
  }

  return appState.classes.filter((item) => item.students.includes(user.id));
}

function getClassById(classId) {
  return appState.classes.find((item) => item.id === classId) || null;
}

function renderUserInfo() {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  if (elements.userName) {
    elements.userName.textContent = user.name;
  }
  if (elements.userRole) {
    elements.userRole.textContent = user.role === 'teacher' ? 'Teacher account' : 'Student account';
  }
}

function updateDashboardVisibility() {
  const user = getCurrentUser();
  const isLoggedIn = Boolean(user);

  if (elements.guestState) {
    elements.guestState.classList.toggle('hidden', isLoggedIn);
  }
  if (elements.dashboard) {
    elements.dashboard.classList.toggle('hidden', !isLoggedIn);
  }
  if (elements.loginButton) {
    elements.loginButton.classList.toggle('hidden', isLoggedIn);
  }
  if (elements.logoutButton) {
    elements.logoutButton.classList.toggle('hidden', !isLoggedIn);
  }

  if (user) {
    if (elements.teacherCreatePanel) {
      elements.teacherCreatePanel.classList.toggle('hidden', user.role !== 'teacher');
    }
    if (elements.studentJoinPanel) {
      elements.studentJoinPanel.classList.toggle('hidden', user.role !== 'student');
    }
  }
}

function renderClassList() {
  const user = getCurrentUser();
  const classes = getClassesForCurrentUser();

  if (!user || classes.length === 0) {
    elements.classList.innerHTML = '<div class="empty-state">No courses are available yet.</div>';
    return;
  }

  const selectedClassId = appState.selectedClassId || classes[0].id;
  if (!appState.selectedClassId) {
    appState.selectedClassId = selectedClassId;
  }

  elements.classSectionTitle.textContent = user.role === 'teacher' ? 'Classes I teach' : 'My classes';

  elements.classList.innerHTML = classes
    .map((item) => {
      const isActive = item.id === selectedClassId;
      return `
        <div class="class-card ${isActive ? 'active' : ''}">
          <div class="class-card-header">
            <h4>${item.name}</h4>
            <span class="badge">${item.section}</span>
          </div>
          <div class="class-meta">
            <span>${item.room}</span>
            <span>${item.schedule}</span>
          </div>
          <div class="class-card-actions">
            <button type="button" class="class-action primary" data-class-action="select-class" data-class-id="${item.id}">View roster</button>
            ${user.role === 'teacher' ? `<button type="button" class="class-action danger" data-class-action="delete-class" data-class-id="${item.id}">Delete</button>` : `<button type="button" class="class-action danger" data-class-action="leave-class" data-class-id="${item.id}">Leave</button>`}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderClassDetails() {
  const user = getCurrentUser();
  const classes = getClassesForCurrentUser();
  const classId = appState.selectedClassId || classes[0]?.id;
  const currentClass = getClassById(classId);

  if (!user || !currentClass) {
    elements.classDetails.innerHTML = '<div class="empty-state">Select a class to view the roster.</div>';
    elements.rosterTitle.textContent = 'Class details';
    return;
  }

  const teacher = appState.users.find((item) => item.id === currentClass.teacherId);
  const roster = currentClass.students
    .map((studentId) => appState.users.find((userItem) => userItem.id === studentId))
    .filter(Boolean);

  elements.rosterTitle.textContent = `${currentClass.name} roster`;

  const rosterMarkup = roster.length
    ? roster
        .map(
          (student) => `
            <div class="roster-item">
              <div>
                <strong>${student.name}</strong>
                <span>${student.email}</span>
              </div>
              ${user.role === 'teacher' ? `<button type="button" class="class-action danger" data-class-action="kick-student" data-student-id="${student.id}" data-class-id="${currentClass.id}">Kick</button>` : ''}
            </div>
          `
        )
        .join('')
    : '<div class="empty-state">This class has no students yet.</div>';

  elements.classDetails.innerHTML = `
    <div class="class-details-card">
      <h4>${currentClass.name}</h4>
      <p><strong>Instructor:</strong> ${teacher ? teacher.name : 'Unknown teacher'}</p>
      <p><strong>Section:</strong> ${currentClass.section}</p>
      <p><strong>Room:</strong> ${currentClass.room}</p>
      <p><strong>Schedule:</strong> ${currentClass.schedule}</p>
      <p><strong>Join code:</strong> ${currentClass.joinCode}</p>
    </div>
    <div class="roster-list">${rosterMarkup}</div>
  `;
}

function renderDashboard() {
  updateDashboardVisibility();
  renderUserInfo();

  const user = getCurrentUser();
  if (!user) {
    return;
  }

  renderClassList();
  renderClassDetails();
}

function isPortalPage() {
  const pathname = window.location.pathname.split('/').pop() || '';
  return pathname.toLowerCase() === 'portal.html';
}

function redirectToPortal() {
  if (!isPortalPage()) {
    window.location.href = 'portal.html';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const chosenRole = String(formData.get('role') || 'student');
  const user = appState.users.find(
    (item) => item.email.toLowerCase() === email && item.password === password && item.role === chosenRole
  );

  if (!user) {
    alert('Invalid login details for that role. Try the demo teacher or student account.');
    return;
  }

  appState.currentUserId = user.id;
  appState.selectedClassId = null;
  saveState();
  closeAuthModal();

  if (!isPortalPage()) {
    redirectToPortal();
    return;
  }

  renderDashboard();
}

function handleSignupSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '').trim();
  const role = String(formData.get('role') || 'student');

  if (!name || !email || password.length < 6) {
    alert('Please provide a full name, valid email, and a password with at least 6 characters.');
    return;
  }

  const alreadyExists = appState.users.some((user) => user.email.toLowerCase() === email);
  if (alreadyExists) {
    alert('An account with that email already exists. Please log in instead.');
    return;
  }

  const newUser = {
    id: `${role}-${Date.now()}`,
    name,
    email,
    password,
    role
  };

  appState.users.push(newUser);
  appState.currentUserId = newUser.id;
  appState.selectedClassId = null;
  saveState();
  closeAuthModal();
  event.currentTarget.reset();

  if (!isPortalPage()) {
    redirectToPortal();
    return;
  }

  renderDashboard();
}

function createClass(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const newClass = {
    id: `class-${Date.now()}`,
    name: String(formData.get('className') || '').trim(),
    section: String(formData.get('section') || '').trim(),
    room: String(formData.get('room') || '').trim(),
    schedule: String(formData.get('schedule') || '').trim(),
    joinCode: `CLASS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    teacherId: user.id,
    students: []
  };

  if (!newClass.name || !newClass.section || !newClass.room || !newClass.schedule) {
    alert('Please complete all class fields.');
    return;
  }

  appState.classes.push(newClass);
  appState.selectedClassId = newClass.id;
  saveState();
  event.currentTarget.reset();
  renderDashboard();
}

function joinClass(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== 'student') {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const joinCode = String(formData.get('joinCode') || '').trim().toUpperCase();
  const targetClass = appState.classes.find((item) => item.joinCode.toUpperCase() === joinCode);

  if (!targetClass) {
    alert('That class code does not exist. Please check the code and try again.');
    return;
  }

  if (targetClass.students.includes(user.id)) {
    alert('You have already joined this class.');
    return;
  }

  targetClass.students.push(user.id);
  appState.selectedClassId = targetClass.id;
  saveState();
  event.currentTarget.reset();
  renderDashboard();
}

function handleClassAction(event) {
  const button = event.target.closest('[data-class-action]');
  if (!button) {
    return;
  }

  const action = button.dataset.classAction;
  const classId = button.dataset.classId;
  const studentId = button.dataset.studentId;
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const targetClass = getClassById(classId);
  if (!targetClass) {
    return;
  }

  if (action === 'select-class') {
    appState.selectedClassId = classId;
    renderDashboard();
    return;
  }

  if (action === 'delete-class') {
    if (user.role !== 'teacher' || targetClass.teacherId !== user.id) {
      return;
    }

    appState.classes = appState.classes.filter((item) => item.id !== classId);
    if (appState.selectedClassId === classId) {
      appState.selectedClassId = appState.classes[0]?.id || null;
    }
    saveState();
    renderDashboard();
    return;
  }

  if (action === 'leave-class') {
    if (user.role !== 'student') {
      return;
    }

    targetClass.students = targetClass.students.filter((student) => student !== user.id);
    if (appState.selectedClassId === classId) {
      appState.selectedClassId = appState.classes.find((item) => item.students.includes(user.id))?.id || null;
    }
    saveState();
    renderDashboard();
    return;
  }

  if (action === 'kick-student') {
    if (user.role !== 'teacher' || targetClass.teacherId !== user.id) {
      return;
    }

    targetClass.students = targetClass.students.filter((student) => student !== studentId);
    saveState();
    renderDashboard();
  }
}

function handleLogout() {
  appState.currentUserId = null;
  appState.selectedClassId = null;
  saveState();

  if (isPortalPage()) {
    window.location.href = 'index.html';
    return;
  }

  renderDashboard();
}

function initAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => openAuthModal(tab.dataset.authTab));
  });
}

function bindEvents() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => {
      setTheme(appState.theme === 'dark' ? 'light' : 'dark');
    });
  }

  if (elements.loginButton) {
    elements.loginButton.addEventListener('click', () => openAuthModal('login'));
  }

  document.querySelectorAll('[data-open-auth]').forEach((button) => {
    button.addEventListener('click', () => openAuthModal(button.dataset.openAuth || 'login'));
  });

  if (elements.closeAuthModal) {
    elements.closeAuthModal.addEventListener('click', closeAuthModal);
  }

  if (elements.authModal) {
    elements.authModal.addEventListener('click', (event) => {
      if (event.target === elements.authModal) {
        closeAuthModal();
      }
    });
  }

  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', handleLoginSubmit);
  }
  if (elements.signupForm) {
    elements.signupForm.addEventListener('submit', handleSignupSubmit);
  }
  if (elements.createClassForm) {
    elements.createClassForm.addEventListener('submit', createClass);
  }
  if (elements.joinClassForm) {
    elements.joinClassForm.addEventListener('submit', joinClass);
  }

  document.addEventListener('click', handleClassAction);

  if (elements.logoutButton) {
    elements.logoutButton.addEventListener('click', handleLogout);
  }
}

const initAccordions = () => {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const button = item.querySelector('.accordion-toggle');
    const panel = item.querySelector('.accordion-panel');

    if (!button || !panel) {
      return;
    }

    const updateState = (shouldOpen) => {
      item.classList.toggle('open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
      panel.hidden = false;
      panel.style.maxHeight = shouldOpen ? `${panel.scrollHeight + 50}px` : '0px';
      panel.style.opacity = shouldOpen ? '1' : '0';
    };

    updateState(item.classList.contains('open'));

    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('open');
      updateState(shouldOpen);
    });
  });
};

const quizCards = document.querySelectorAll('.quiz-card');
quizCards.forEach((card) => {
  const correctValue = card.dataset.correct;
  const buttons = card.querySelectorAll('.option-button');
  const answerBox = card.querySelector('.answer-box');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.answer;

      buttons.forEach((btn) => {
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

      buttons.forEach((btn) => {
        btn.disabled = true;
      });
    });
  });
});

const completionToggles = document.querySelectorAll('.completion-toggle');
completionToggles.forEach((toggle) => {
  toggle.addEventListener('change', () => {
    const item = toggle.closest('.checklist-item');
    if (!item) {
      return;
    }

    if (toggle.checked) {
      item.style.opacity = '0.7';
      item.style.textDecoration = 'line-through';
    } else {
      item.style.opacity = '1';
      item.style.textDecoration = 'none';
    }
  });
});

function initialize() {
  setTheme(appState.theme || 'light');

  if (appState.currentUserId && !isPortalPage()) {
    redirectToPortal();
    return;
  }

  initAuthTabs();
  bindEvents();
  initAccordions();
  renderDashboard();
}

initialize();
