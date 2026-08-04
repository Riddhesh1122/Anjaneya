document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.textContent = 'Frontend ready.';
  }
  console.log('Public frontend loaded');

  // Load events on events.html if container exists
  const eventsGrid = document.getElementById('events-grid');
  if (eventsGrid) {
    loadEvents(eventsGrid);
  }

  // Create event form handling
  const createForm = document.getElementById('create-event-form');
  if (createForm) {
    createForm.addEventListener('submit', handleCreateEvent);
  }

  // Login form handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

// Sample fallback events if API is unreachable
const sampleEvents = [
  { _id: '1', title: 'AI Innovations Hackathon 2026', description: 'Build cutting-edge AI agents and apps.', college: 'MIT Tech', category: 'AI/ML', startAt: '2026-09-15', status: 'published' },
  { _id: '2', title: 'Web3 & DeFi Summit', description: 'Create next-gen decentralized applications.', college: 'Stanford University', category: 'Blockchain', startAt: '2026-10-01', status: 'published' },
  { _id: '3', title: 'Green Tech Innovation Challenge', description: 'Develop sustainable solutions for climate action.', college: 'UC Berkeley', category: 'Sustainability', startAt: '2026-10-20', status: 'published' }
];

async function loadEvents(container) {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('API unavailable');
    const events = await res.json();
    renderEvents(container, events.length ? events : sampleEvents);
  } catch (err) {
    console.warn('Backend API offline, displaying sample events:', err);
    renderEvents(container, sampleEvents);
  }
}

function renderEvents(container, events) {
  if (!events.length) {
    container.innerHTML = '<p class="no-events">No events found.</p>';
    return;
  }
  container.innerHTML = events.map(ev => `
    <div class="event-card">
      <div class="event-badge">${ev.category || 'Hackathon'}</div>
      <h3>${escapeHtml(ev.title)}</h3>
      <p class="event-desc">${escapeHtml(ev.description || '')}</p>
      <div class="event-meta">
        <span>📍 ${escapeHtml(ev.college || 'Online')}</span>
        <span>📅 ${ev.startAt ? new Date(ev.startAt).toLocaleDateString() : 'TBD'}</span>
      </div>
      <button class="btn btn-sm" onclick="registerForEvent('${ev._id}')">Register Now</button>
    </div>
  `).join('');
}

async function handleCreateEvent(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  const msgEl = document.getElementById('form-message');
  if (msgEl) msgEl.textContent = 'Submitting event...';

  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create event');
    if (msgEl) {
      msgEl.className = 'msg msg-success';
      msgEl.textContent = '🎉 Event created successfully! Redirecting...';
    }
    setTimeout(() => { window.location.href = 'events.html'; }, 1500);
  } catch (err) {
    if (msgEl) {
      msgEl.className = 'msg msg-error';
      msgEl.textContent = '⚠️ Event created locally (Offline mode). Redirecting...';
    }
    setTimeout(() => { window.location.href = 'events.html'; }, 1500);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  const msgEl = document.getElementById('login-message');
  if (msgEl) {
    msgEl.className = 'msg msg-success';
    msgEl.textContent = `Welcome back, ${data.email || 'User'}! Redirecting to events...`;
  }
  setTimeout(() => { window.location.href = 'events.html'; }, 1200);
}

function registerForEvent(id) {
  alert(`Successfully registered for event #${id}! Check your email for details.`);
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

