const API_URL = 'http://localhost:5000/api';

let allNotes = [];
let editingNoteId = null;
let deletingNoteId = null;

// ── AUTH GUARD ──
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

// ── HELPERS ──
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function setLoading(show) {
  document.getElementById('loadingState').classList.toggle('show', show);
  document.getElementById('notesGrid').style.display = show ? 'none' : 'grid';
}

// ── RENDER NOTES ──
function renderNotes(notes) {
  const grid = document.getElementById('notesGrid');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('notesCount');

  countEl.textContent = notes.length;

  if (notes.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');

  grid.innerHTML = notes.map((note, i) => `
    <div class="note-card" style="animation-delay: ${i * 0.05}s">
      <h3 class="note-card-title">${escapeHtml(note.title)}</h3>
      <p class="note-card-content">${escapeHtml(note.content)}</p>
      <div class="note-card-footer">
        <span class="note-date">${formatDate(note.createdAt)}</span>
        <div class="note-actions">
          <button class="btn-icon edit" title="Edit" onclick="openEditModal('${note._id}')">✏️</button>
          <button class="btn-icon delete" title="Delete" onclick="openDeleteModal('${note._id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── FETCH NOTES ──
async function fetchNotes() {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/notes`, { headers: getHeaders() });

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();
    allNotes = data.notes || [];
    renderNotes(allNotes);

  } catch (err) {
    showToast('Cannot connect to server.', 'error');
  } finally {
    setLoading(false);
  }
}

// ── SEARCH ──
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    renderNotes(allNotes);
    return;
  }
  const filtered = allNotes.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query)
  );
  renderNotes(filtered);
}

// ── MODALS ──
function openCreateModal() {
  editingNoteId = null;
  document.getElementById('modalTitle').textContent = 'New Note';
  document.getElementById('saveBtn').textContent = 'Save Note';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('modalError').classList.remove('show');
  document.getElementById('noteModal').classList.add('show');
  setTimeout(() => document.getElementById('noteTitle').focus(), 100);
}

function openEditModal(noteId) {
  const note = allNotes.find(n => n._id === noteId);
  if (!note) return;

  editingNoteId = noteId;
  document.getElementById('modalTitle').textContent = 'Edit Note';
  document.getElementById('saveBtn').textContent = 'Update Note';
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content;
  document.getElementById('modalError').classList.remove('show');
  document.getElementById('noteModal').classList.add('show');
  setTimeout(() => document.getElementById('noteTitle').focus(), 100);
}

function closeModal() {
  document.getElementById('noteModal').classList.remove('show');
  editingNoteId = null;
}

function openDeleteModal(noteId) {
  deletingNoteId = noteId;
  document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
  deletingNoteId = null;
}

// ── SAVE NOTE (CREATE OR UPDATE) ──
async function handleSaveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const errorEl = document.getElementById('modalError');

  errorEl.classList.remove('show');

  if (!title) {
    errorEl.textContent = 'Please enter a title.';
    errorEl.classList.add('show');
    return;
  }
  if (!content) {
    errorEl.textContent = 'Please enter some content.';
    errorEl.classList.add('show');
    return;
  }

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try {
    const isEdit = !!editingNoteId;
    const url = isEdit ? `${API_URL}/notes/${editingNoteId}` : `${API_URL}/notes`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || 'Something went wrong.';
      errorEl.classList.add('show');
      return;
    }

    closeModal();
    showToast(isEdit ? 'Note updated successfully!' : 'Note created successfully!');
    await fetchNotes();

  } catch (err) {
    errorEl.textContent = 'Cannot connect to server.';
    errorEl.classList.add('show');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = editingNoteId ? 'Update Note' : 'Save Note';
  }
}

// ── DELETE NOTE ──
async function handleDeleteNote() {
  if (!deletingNoteId) return;

  const btn = document.getElementById('confirmDeleteBtn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    const res = await fetch(`${API_URL}/notes/${deletingNoteId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!res.ok) {
      showToast('Failed to delete note.', 'error');
      return;
    }

    closeDeleteModal();
    showToast('Note deleted.');
    await fetchNotes();

  } catch (err) {
    showToast('Cannot connect to server.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
  }
}

// ── LOGOUT ──
function handleLogout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeDeleteModal();
  }
});

// ── INIT ──
window.addEventListener('DOMContentLoaded', () => {
  // Set user name in navbar
  const email = localStorage.getItem('userEmail') || 'User';
  const name = email.split('@')[0];
  const nameEl = document.getElementById('userName');
  if (nameEl) nameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);

  fetchNotes();
});