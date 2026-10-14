const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const initAccordions = () => {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const button = item.querySelector('.accordion-toggle');
    const panel = item.querySelector('.accordion-panel');

    if (!button || !panel) {
      return;
    }

    panel.removeAttribute('hidden');

    const updateState = (shouldOpen) => {
      item.classList.toggle('open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
      panel.hidden = false;

      const symbol = button.querySelector('span');
      if (symbol) {
        symbol.textContent = shouldOpen ? '−' : '+';
      }
    };

    updateState(item.classList.contains('open'));

    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('open');
      updateState(shouldOpen);
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

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
