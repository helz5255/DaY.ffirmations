const dayLabelEl = document.getElementById("day-label");
const quoteTextEl = document.getElementById("quote-text");
const quoteTagEl = document.getElementById("quote-tag");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const todayBtn = document.getElementById("today-btn");
const favBtn = document.getElementById("fav-btn");
const favStatusEl = document.getElementById("fav-status");
const favListEl = document.getElementById("fav-list");
const themeToggle = document.getElementById("theme-toggle");

const STORAGE_KEY_FAVS = "day_ffirmations_favorites";
const STORAGE_KEY_LAST_DAY = "day_ffirmations_last_day";

let currentIndex = 0;
let favorites = loadFavorites();

function getTodayIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const diff = today - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  return (dayOfYear - 1) % QUOTES.length;
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS)) || [];
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
    favStatusEl.textContent = "Removed";
  } else {
    favorites.push(quote.id);
    favStatusEl.textContent = "Saved";
  }

  saveFavorites();
  renderFavoriteButton();
  renderFavoritesList();

  setTimeout(() => favStatusEl.textContent = "", 1500);
}

function renderFavoriteButton() {
  const quote = QUOTES[currentIndex];
  favBtn.textContent = isFavorite(quote.id) ? "♥" : "♡";
}

function renderFavoritesList() {
  favListEl.innerHTML = "";
  if (!favorites.length) {
    favListEl.innerHTML = "<span style='color:#888;font-size:12px;'>No favorites yet</span>";
    return;
  }

  favorites.forEach(id => {
    const q = QUOTES.find(q => q.id === id);
    if (!q) return;
    const pill = document.createElement("button");
    pill.className = "fav-pill";
    pill.textContent = q.text.slice(0, 40) + "...";
    pill.onclick = () => {
      currentIndex = QUOTES.findIndex(item => item.id === id);
      renderQuote();
    };
    favListEl.appendChild(pill);
  });
}

function renderQuote() {
  const quote = QUOTES[currentIndex];
  dayLabelEl.textContent = `Day ${currentIndex + 1}`;
  quoteTextEl.textContent = quote.text;
  quoteTagEl.textContent = quote.tag ? `#${quote.tag}` : "";
  renderFavoriteButton();
  localStorage.setItem(STORAGE_KEY_LAST_DAY, currentIndex);
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

prevBtn.onclick = goPrev;
nextBtn.onclick = goNext;
todayBtn.onclick = goToday;
favBtn.onclick = toggleFavorite;

/* DARK MODE */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("day_ffirmations_theme", isDark ? "dark" : "light");
});

(function loadTheme() {
  const saved = localStorage.getItem("day_ffirmations_theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
  }
})();

/* SWIPE */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) < 50) return;
  if (diff > 0) goPrev();
  else goNext();
}

/* INIT */
(function init() {
  const savedIndex = localStorage.getItem(STORAGE_KEY_LAST_DAY);
  currentIndex = savedIndex ? parseInt(savedIndex) : getTodayIndex();
  renderQuote();
  renderFavoritesList();
})();
