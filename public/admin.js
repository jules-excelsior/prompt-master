'use strict';

const loginScreen = document.getElementById('login-screen');
const dashboard   = document.getElementById('dashboard');
const pwInput     = document.getElementById('pw-input');
const loginError  = document.getElementById('login-error');
const docsLoader  = document.getElementById('docs-loader');
const docsBody    = document.getElementById('docs-body');

let currentTab = 'workflow';

/* ── Auth ────────────────────────────────────────────────── */
function checkAuth() {
  if (sessionStorage.getItem('pm_admin') === 'true') {
    showDashboard();
  }
}

document.getElementById('toggle-pw').onclick = () => {
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
};

document.getElementById('btn-login').onclick = login;
pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });

async function login() {
  const password = pwInput.value.trim();
  if (!password) return;

  loginError.classList.add('hidden');

  try {
    const res = await fetch('/api/verify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('pm_admin', 'true');
      showDashboard();
    } else {
      loginError.classList.remove('hidden');
      pwInput.value = '';
      pwInput.focus();
    }
  } catch {
    loginError.textContent = 'Connection error. Is the server running?';
    loginError.classList.remove('hidden');
  }
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');

  document.getElementById('stat-date').textContent = '2026-05-30';

  setupTabs();
  loadTab('workflow');
}

document.getElementById('btn-logout').onclick = () => {
  sessionStorage.removeItem('pm_admin');
  location.reload();
};

/* ── Tabs ────────────────────────────────────────────────── */
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    };
  });
}

async function loadTab(type) {
  currentTab = type;
  docsLoader.classList.remove('hidden');
  docsBody.classList.add('hidden');
  docsBody.innerHTML = '';

  try {
    const res  = await fetch(`/api/content/${type}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    docsBody.innerHTML = window.marked ? marked.parse(data.content) : `<pre>${data.content}</pre>`;
    docsLoader.classList.add('hidden');
    docsBody.classList.remove('hidden');
  } catch (err) {
    docsLoader.classList.add('hidden');
    docsBody.innerHTML = `<p style="color:#ef4444">Failed to load content: ${err.message}</p>`;
    docsBody.classList.remove('hidden');
  }
}

/* ── Boot ────────────────────────────────────────────────── */
checkAuth();
