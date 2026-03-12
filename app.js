// app.js

const dayLabelEl = document.getElementById("day-label");
const quoteTextEl = document.getElementById("quote-text");
const quoteTagEl = document.getElementById("quote-tag");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const todayBtn = document.getElementById("today-btn");
const favBtn = document.getElementById("fav-btn");
const favStatusEl = document.getElementById("fav-status");
const favListEl = document.getElementById("fav-list");

const STORAGE_KEY_FAVS = "day_ffirmations_favorites";
const STORAGE_KEY_LAST_DAY = "day_ffirmations_last_day";

let currentIndex = 0;
let favorites = loadFavorites();

function getTodayIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const diff = today - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  // kui tsitaate on vähem kui 365, tsüklime
  return (dayOfYear - 1) % QUOTES.length;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
}

function isFavorite(id) {
  return favorites.includes(id);
}

function toggleFavorite() {
  const quote = QUOTES[currentIndex];
  if (!quote) return;
  if (isFavorite(quote.id)) {
    favorites = favorites.filter(f => f !== quote.id);
    favStatusEl.textContent = "Removed from favorites";
  } else {
    favorites.push(quote.id);
    favStatusEl.textContent = "Saved to favorites";
  }
  saveFavorites();
  renderFavoriteButton();
  renderFavoritesList();
  setTimeout(() => (favStatusEl.textContent = ""), 1500);
}

function renderFavoriteButton() {
  const quote = QUOTES[currentIndex];
  if (!quote) return;
  favBtn.textContent = isFavorite(quote.id) ? "♥" : "♡";
}

function renderFavoritesList() {
  favListEl.innerHTML = "";
  if (!favorites.length) {
    const span = document.createElement("span");
    span.textContent = "No favorites yet.";
    span.style.fontSize = "12px";
    span.style.color = "#8a8278";
    favListEl.appendChild(span);
    return;
  }
  favorites.forEach(id => {
    const q = QUOTES.find(q => q.id === id);
    if (!q) return;
    const pill = document.createElement("button");
    pill.className = "fav-pill";
    pill.textContent = q.text.length > 40 ? q.text.slice(0, 40) + "…" : q.text;
    pill.onclick = () => {
      currentIndex = QUOTES.findIndex(item => item.id === id);
      renderQuote();
    };
    favListEl.appendChild(pill);
  });
}

function renderQuote() {
  const quote = QUOTES[currentIndex];
  if (!quote) return;
  const dayNumber = currentIndex + 1;
  dayLabelEl.textContent = `Day ${dayNumber}`;
  quoteTextEl.textContent = quote.text;
  quoteTagEl.textContent = quote.tag ? `#${quote.tag}` : "";
  renderFavoriteButton();
  localStorage.setItem(STORAGE_KEY_LAST_DAY, String(currentIndex));
}

function goNext() {
  currentIndex = (currentIndex + 1) % QUOTES.length;
  renderQuote();
}

function goPrev() {
  currentIndex = (currentIndex - 1 + QUOTES.length) % QUOTES.length;
  renderQuote();
}

function goToday() {
  currentIndex = getTodayIndex();
  renderQuote();
}

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);
todayBtn.addEventListener("click", goToday);
favBtn.addEventListener("click", toggleFavorite);

// init
(function init() {
  const savedIndex = localStorage.getItem(STORAGE_KEY_LAST_DAY);
  if (savedIndex !== null) {
    const idx = parseInt(savedIndex, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < QUOTES.length) {
      currentIndex = idx;
    } else {
      currentIndex = getTodayIndex();
    }
  } else {
    currentIndex = getTodayIndex();
  }
  renderQuote();
  renderFavoritesList();
})();
