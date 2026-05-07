// SalsaFind — Main application logic

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

const state = {
  city: 'Philadelphia, PA',
  date: '',
  filter: 'all',
  allEvents: [],
  apiKey: localStorage.getItem('salsafind_eb_key') || ''
};

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setupDateInput();
  restoreSettings();
  setupEventListeners();
  loadEvents();
});

function setupDateInput() {
  const input = document.getElementById('dateInput');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  input.min = formatDateInput(tomorrow);
  input.max = formatDateInput(maxDate);
  input.value = formatDateInput(tomorrow);
  state.date = input.value;
}

function formatDateInput(d) {
  return d.toISOString().slice(0, 10);
}

function restoreSettings() {
  const key = localStorage.getItem('salsafind_eb_key') || '';
  state.apiKey = key;
  const keyInput = document.getElementById('eventbriteKey');
  if (keyInput && key) keyInput.value = key;
}

// ─── Event listeners ─────────────────────────────────────────────────────────

function setupEventListeners() {
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    const date = document.getElementById('dateInput').value;
    if (!city || !date) return;
    state.city = city;
    state.date = date;
    updateHash();
    loadEvents();
    scrollToResults();
  });

  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderEvents();
    });
  });

  document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
  document.getElementById('settingsModalClose').addEventListener('click', () => closeModal('settingsModal'));
  document.getElementById('eventModalClose').addEventListener('click', () => closeModal('eventDetailModal'));
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
  document.getElementById('connectApiBtn')?.addEventListener('click', () => openModal('settingsModal'));

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('eventDetailModal');
      closeModal('settingsModal');
    }
  });

  // Hash navigation
  window.addEventListener('hashchange', handleHash);
  handleHash();
}

// ─── URL hash routing ─────────────────────────────────────────────────────────

function updateHash() {
  const citySlug = state.city.replace(/\s*,\s*/g, '-').replace(/\s+/g, '-');
  window.location.hash = `${citySlug}/${state.date}`;
}

function handleHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const parts = hash.split('/');
  if (parts.length === 2) {
    const city = parts[0].replace(/-/g, ' ').replace(/\b(\w+)\b\s(\w{2})$/, '$1, $2').trim();
    const date = parts[1];
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      state.city = city;
      state.date = date;
      document.getElementById('cityInput').value = city;
      document.getElementById('dateInput').value = date;
    }
  }
}

// ─── Load & render events ─────────────────────────────────────────────────────

async function loadEvents() {
  showLoading(true);
  updateResultsMeta();

  let events = null;

  // Try Eventbrite API first
  if (state.apiKey) {
    events = await searchEventbrite(state.city, state.date, state.apiKey);
  }

  // Fall back to local default data
  if (!events) {
    const defaults = getDefaultEventsForCity(state.city);
    if (defaults) {
      events = filterEventsByDate(defaults, state.date);
      document.getElementById('dataNote').style.display = state.apiKey ? 'none' : 'block';
    } else {
      events = [];
      document.getElementById('dataNote').style.display = state.apiKey ? 'none' : 'block';
    }
  } else {
    document.getElementById('dataNote').style.display = 'none';
  }

  state.allEvents = sortByRelevance(events);
  showLoading(false);
  renderEvents();
  renderSocialLinks();
}

function renderEvents() {
  const list = document.getElementById('eventsList');
  const empty = document.getElementById('emptyState');
  const filtered = filterEventsByType(state.allEvents, state.filter);

  document.getElementById('resultsCountText').textContent =
    filtered.length === 1 ? '1 event found' : `${filtered.length} events found`;

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach(event => {
    list.appendChild(buildEventCard(event));
  });
}

// ─── Card builder ─────────────────────────────────────────────────────────────

function buildEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';
  card.dataset.eventId = event.id;

  const typeLabel = { social: 'Social', class: 'Class', event: 'Event' }[event.type] || 'Event';
  const dateLabel = formatEventDateLabel(event);

  card.innerHTML = `
    <div class="card-images" data-current="0">
      <div class="images-track">
        <img class="card-img" src="${event.images[0]}" alt="${escHtml(event.title)} photo 1" loading="lazy">
        <img class="card-img" src="${event.images[1]}" alt="${escHtml(event.title)} photo 2" loading="lazy">
      </div>
      <div class="image-nav">
        <button class="img-prev" aria-label="Previous image">‹</button>
        <div class="image-dots">
          <span class="dot active"></span>
          <span class="dot"></span>
        </div>
        <button class="img-next" aria-label="Next image">›</button>
      </div>
      <span class="type-badge type-${event.type}">${typeLabel}</span>
      <span class="source-badge">${escHtml(event.source || '')}</span>
    </div>

    <div class="card-body">
      <h2 class="card-title">${escHtml(event.title)}</h2>

      <div class="detail-rows">
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${escHtml(dateLabel)}</span>
        </div>
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div class="venue-stack">
            <span class="venue-name">${escHtml(event.venue)}</span>
            <span class="venue-addr">${escHtml(event.address)}</span>
          </div>
        </div>
        ${event.cost ? `
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>${escHtml(event.cost)}</span>
        </div>` : ''}
        ${event.phone ? `
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.47 2 2 0 0 1 3.55 1.29h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.28 6.28l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 16.92z"/></svg>
          <a class="detail-link" href="tel:${event.phone.replace(/\D/g,'')}">${escHtml(event.phone)}</a>
        </div>` : ''}
      </div>

      <div class="card-actions">
        <a class="action-btn btn-directions"
           href="https://maps.google.com/?q=${encodeURIComponent(event.address)}"
           target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Directions
        </a>
        <button class="action-btn btn-details" data-id="${event.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Details
        </button>
      </div>
    </div>
  `;

  // Image slider
  setupCardSlider(card, event);

  // Details modal
  card.querySelector('.btn-details').addEventListener('click', () => openEventModal(event));

  return card;
}

function formatEventDateLabel(event) {
  if (event.isRecurring) return event.displayTime;
  if (event.specificDates?.length > 1) return event.displayTime;
  return event.displayTime;
}

// ─── Image slider ─────────────────────────────────────────────────────────────

function setupCardSlider(card, event) {
  const container = card.querySelector('.card-images');
  const track = card.querySelector('.images-track');
  const dots = card.querySelectorAll('.dot');
  let current = 0;

  function go(idx) {
    current = idx;
    track.style.transform = `translateX(-${idx * 50}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  card.querySelector('.img-next').addEventListener('click', e => {
    e.stopPropagation();
    go(current === 0 ? 1 : 0);
  });
  card.querySelector('.img-prev').addEventListener('click', e => {
    e.stopPropagation();
    go(current === 0 ? 1 : 0);
  });

  // Touch swipe
  let touchStartX = 0;
  container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : 0);
  }, { passive: true });
}

// ─── Event detail modal ───────────────────────────────────────────────────────

function openEventModal(event) {
  const modal = document.getElementById('eventDetailModal');
  const content = document.getElementById('eventModalContent');
  const typeLabel = { social: 'Social', class: 'Class', event: 'Event' }[event.type] || 'Event';

  content.innerHTML = `
    <div class="modal-images">
      <img src="${event.images[0]}" alt="${escHtml(event.title)}" class="modal-img">
      <img src="${event.images[1]}" alt="${escHtml(event.title)} 2" class="modal-img">
    </div>
    <div class="modal-info">
      <span class="type-badge type-${event.type}">${typeLabel}</span>
      <h2 id="modalTitle">${escHtml(event.title)}</h2>
      <p class="modal-description">${escHtml(event.description)}</p>

      <div class="detail-rows">
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${escHtml(event.displayTime)}</span>
        </div>
        <div class="detail-row">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div class="venue-stack">
            <span class="venue-name">${escHtml(event.venue)}</span>
            <span class="venue-addr">${escHtml(event.address)}</span>
          </div>
        </div>
        ${event.cost ? `<div class="detail-row"><svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><span>${escHtml(event.cost)}</span></div>` : ''}
        ${event.phone ? `<div class="detail-row"><svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.47 2 2 0 0 1 3.55 1.29h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.28 6.28l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 16.92z"/></svg><a class="detail-link" href="tel:${event.phone.replace(/\D/g,'')}">${escHtml(event.phone)}</a></div>` : ''}
        ${event.level ? `<div class="detail-row"><svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span>Level: ${escHtml(event.level)}</span></div>` : ''}
        ${event.dresscode ? `<div class="detail-row"><svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg><span>Dress code: ${escHtml(event.dresscode)}</span></div>` : ''}
      </div>

      <div class="modal-actions">
        <a class="action-btn btn-directions"
           href="https://maps.google.com/?q=${encodeURIComponent(event.address)}"
           target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Get Directions
        </a>
        ${event.website && event.website !== '#' ? `
        <a class="action-btn btn-website" href="${event.website}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          View Event
        </a>` : ''}
      </div>
    </div>
  `;

  openModal('eventDetailModal');
}

// ─── Social search links ──────────────────────────────────────────────────────

function renderSocialLinks() {
  const container = document.getElementById('socialLinksGrid');
  const links = getSocialSearchLinks(state.city, state.date);

  container.innerHTML = links.map(link => `
    <a class="social-link" href="${link.url}" target="_blank" rel="noopener" style="--link-color:${link.color}">
      ${getSocialIcon(link.icon)}
      <span>${escHtml(link.name)}</span>
    </a>
  `).join('');
}

function getSocialIcon(name) {
  const icons = {
    eventbrite: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 16.5h-9v-1.5h9v1.5zm0-3h-9V12h9v1.5zm0-3h-9V9h9v1.5z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    meetup: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.24 12.52a4.34 4.34 0 0 0-4.13-5.27 4.27 4.27 0 0 0-1.36.22 5.5 5.5 0 0 0-9.94 3.28 5.48 5.48 0 0 0 .07.87A4.34 4.34 0 0 0 5.25 20h13.18a4.34 4.34 0 0 0 .81-7.48z"/></svg>`,
    google: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
  };
  return icons[name] || '';
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function showLoading(yes) {
  document.getElementById('loadingState').style.display = yes ? 'flex' : 'none';
  document.getElementById('eventsList').style.display = yes ? 'none' : 'block';
}

function updateResultsMeta() {
  document.getElementById('resultsLocationText').textContent = state.city;
  const d = new Date(state.date + 'T00:00:00');
  const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  document.getElementById('resultsDateText').textContent = label;
}

function scrollToResults() {
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('visible'), 10);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { modal.hidden = true; }, 300);
}

function saveSettings() {
  const key = document.getElementById('eventbriteKey').value.trim();
  state.apiKey = key;
  if (key) localStorage.setItem('salsafind_eb_key', key);
  else localStorage.removeItem('salsafind_eb_key');
  closeModal('settingsModal');
  loadEvents();
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
