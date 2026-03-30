const API_URL = 'http://localhost:5000/api';

// ── HELPERS ──
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = `alert ${type} show`;
}

function hideAlerts() {
  document.querySelectorAll('.alert').forEach(el => el.classList.remove('show'));
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait...' : btn.dataset.label;
}

// ── SAVE ORIGINAL BUTTON LABELS ──
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.dataset.label = btn.textContent;
  });

  // Redirect if already logged in
  if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
  }

  // Enter key support
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const signupBtn = document.getElementById('signupBtn');
      const loginBtn = document.getElementById('loginBtn');
      if (signupBtn) handleSignup();
      if (loginBtn) handleLogin();
    }
  });
});

// ── SIGNUP ──
async function handleSignup() {
  hideAlerts();

  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  // Basic validation
  if (!name) return showAlert('errorAlert', 'Please enter your name.');
  if (!email) return showAlert('errorAlert', 'Please enter your email.');
  if (!password) return showAlert('errorAlert', 'Please enter a password.');
  if (password.length < 6) return showAlert('errorAlert', 'Password must be at least 6 characters.');

  setLoading('signupBtn', true);

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert('errorAlert', data.message || 'Signup failed. Try again.');
      return;
    }

    showAlert('successAlert', 'Account created! Redirecting to login...', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);

  } catch (err) {
    showAlert('errorAlert', 'Cannot connect to server. Make sure backend is running.');
  } finally {
    setLoading('signupBtn', false);
  }
}

// ── LOGIN ──
async function handleLogin() {
  hideAlerts();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  if (!email) return showAlert('errorAlert', 'Please enter your email.');
  if (!password) return showAlert('errorAlert', 'Please enter your password.');

  setLoading('loginBtn', true);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert('errorAlert', data.message || 'Login failed. Try again.');
      return;
    }

    // Store token and user info
    localStorage.setItem('token', data.token);

    // Decode token to get user name (basic decode, not verify)
    try {
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem('userId', payload.id);
    } catch (_) {}

    // Store email as display name fallback
    localStorage.setItem('userEmail', email);

    showAlert('successAlert', 'Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);

  } catch (err) {
    showAlert('errorAlert', 'Cannot connect to server. Make sure backend is running.');
  } finally {
    setLoading('loginBtn', false);
  }
}

// ── LOGOUT ──
function handleLogout() {
  localStorage.clear();
  window.location.href = 'login.html';
}