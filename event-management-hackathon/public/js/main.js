document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.textContent = 'Frontend ready.';
  }

  const loginForm = document.querySelector('.auth-form');
  const fields = document.querySelectorAll('.field input');

  if (loginForm) {
    loginForm.classList.add('ready');
  }

  fields.forEach((field, index) => {
    field.style.transitionDelay = `${index * 90}ms`;
    field.addEventListener('focus', () => {
      field.parentElement.classList.add('is-focused');
    });
    field.addEventListener('blur', () => {
      if (!field.value) {
        field.parentElement.classList.remove('is-focused');
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = loginForm.querySelector('.auth-btn');
      if (button) {
        button.textContent = 'Logging in...';
        button.classList.add('is-loading');
        setTimeout(() => {
          button.textContent = 'Welcome back!';
          button.classList.remove('is-loading');
        }, 1200);
      }
    });
  }

  console.log('Public frontend loaded');
});
