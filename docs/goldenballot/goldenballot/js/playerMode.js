/**************************************************
 * playerMode.js
 * 
 * 1) Three modes: "Host", "Guest", "Watch"
 * 2) Persists mode in localStorage (so refresh won't lose it).
 * 3) Watch mode:
 *    - Disables drag
 *    - Shows “Winner” checkboxes
 *    - Auto-calculates and displays scores
 **************************************************/

export let currentMode = "Host";

// Load mode from localStorage at script load
const storedMode = localStorage.getItem("currentMode");
if (storedMode && ["Host", "Guest", "Watch"].includes(storedMode)) {
  currentMode = storedMode;
}

/* Fade helpers */
function fadeOut(element, callback) {
  element.style.transition = "opacity 0.3s ease";
  element.style.opacity = 0;
  setTimeout(() => {
    if (callback) callback();
  }, 300);
}
function fadeIn(element) {
  element.style.transition = "opacity 0.3s ease";
  element.style.opacity = 1;
}

/**
 * Switch mode and persist in localStorage
 */
export function setMode(newMode) {
  if (!["Host", "Guest", "Watch"].includes(newMode)) {
    console.warn("Invalid mode:", newMode);
    return;
  }
  localStorage.setItem("currentMode", newMode);

  const ballotContainer = document.getElementById("ballot-container");
  if (!ballotContainer) {
    currentMode = newMode;
    updateUIForMode();
    return;
  }

  fadeOut(ballotContainer, () => {
    currentMode = newMode;
    updateUIForMode();
    fadeIn(ballotContainer);
  });
}

export function getMode() {
  return currentMode;
}

/**
 * Update the UI based on the current mode
 */
export function updateUIForMode() {
  highlightModeButton(currentMode);

  const categories = document.querySelectorAll(".category");
  categories.forEach((cat) => {
    const dragContainer = cat.querySelector(".drag-container");
    if (!dragContainer) return;

    if (currentMode === "Watch") {
      cat.classList.add("watch-mode");
      dragContainer.querySelectorAll(".nomination").forEach((nom) => {
        nom.removeAttribute("draggable");
        nom.style.cursor = "default";
        injectWatchModeUI(nom);
      });
    } else {
      cat.classList.remove("watch-mode");
      dragContainer.querySelectorAll(".nomination").forEach((nom) => {
        nom.setAttribute("draggable", "true");
        nom.style.cursor = "grab";
        removeWatchModeUI(nom);
      });
    }
  });

  if (currentMode === "Watch") {
    renderScoreBoard();
  } else {
    clearScoreBoard();
  }
}

/*********************************************************
 * Watch Mode UI
 *********************************************************/
function injectWatchModeUI(nom) {
  // Add Winner checkbox and label if not present
  if (!nom.querySelector(".winner-box-container")) {
    const winnerBoxContainer = document.createElement("div");
    winnerBoxContainer.classList.add("winner-box-container");
    winnerBoxContainer.style.marginLeft = "auto";
    winnerBoxContainer.style.display = "flex";
    winnerBoxContainer.style.alignItems = "center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("final-winner-checkbox");
    checkbox.style.marginRight = "0.3em";
    checkbox.addEventListener("change", renderScoreBoard);

    const label = document.createElement("label");
    label.textContent = "Winner";

    winnerBoxContainer.appendChild(checkbox);
    winnerBoxContainer.appendChild(label);
    nom.appendChild(winnerBoxContainer);
  }

  injectPickInfo(nom);
}

function removeWatchModeUI(nom) {
  const winnerBoxContainer = nom.querySelector(".winner-box-container");
  if (winnerBoxContainer) winnerBoxContainer.remove();

  const pickInfo = nom.querySelector(".pick-info");
  if (pickInfo) pickInfo.remove();
}

/**
 * Inject Host/Guest pick information into each nomination
 */
function injectPickInfo(nom) {
  const dataId = nom.getAttribute("data-id");
  if (!dataId) return;

  const pickInfoSpan = nom.querySelector(".pick-info") || document.createElement("span");
  pickInfoSpan.classList.add("pick-info");
  pickInfoSpan.style.marginLeft = "1em";
  pickInfoSpan.style.fontSize = "0.8em";
  pickInfoSpan.style.color = "#666";

  const dragContainer = nom.closest(".drag-container");
  const catId = dragContainer?.id.split("-").pop();

  const hostArr = JSON.parse(localStorage.getItem(`host-category-${catId}-order`)) || [];
  const guestArr = JSON.parse(localStorage.getItem(`guest-category-${catId}-order`)) || [];

  let text = "";
  if (hostArr[0] === dataId) text += "(Host Winner) ";
  else if (hostArr[1] === dataId) text += "(Host Backup) ";
  if (guestArr[0] === dataId) text += "(Guest Winner) ";
  else if (guestArr[1] === dataId) text += "(Guest Backup) ";

  pickInfoSpan.textContent = text.trim();
  if (!nom.contains(pickInfoSpan)) {
    nom.appendChild(pickInfoSpan);
  }
}

/*********************************************************
 * Scoring
 *********************************************************/
function renderScoreBoard() {
  let hostScore = 0;
  let guestScore = 0;

  const categories = document.querySelectorAll(".category");
  categories.forEach((cat) => {
    const catId = cat.querySelector(".drag-container")?.id.split("-").pop();
    if (!catId) return;

    const hostArr = JSON.parse(localStorage.getItem(`host-category-${catId}-order`)) || [];
    const guestArr = JSON.parse(localStorage.getItem(`guest-category-${catId}-order`)) || [];

    const checkedNoms = cat.querySelectorAll(".nomination .final-winner-checkbox:checked");
    checkedNoms.forEach((cb) => {
      const nomDiv = cb.closest(".nomination");
      const dataId = nomDiv?.getAttribute("data-id");
      if (!dataId) return;

      if (hostArr[0] === dataId) hostScore += 1;
      else if (hostArr[1] === dataId) hostScore += 0.25;

      if (guestArr[0] === dataId) guestScore += 1;
      else if (guestArr[1] === dataId) guestScore += 0.25;
    });
  });

  const scoreboard = document.getElementById("scoreboard") || createScoreBoard();
  scoreboard.innerHTML = `
    <h3>Scores</h3>
    <p>Host: ${hostScore}</p>
    <p>Guest: ${guestScore}</p>
  `;
}

function createScoreBoard() {
  const scoreboard = document.createElement("div");
  scoreboard.id = "scoreboard";
  scoreboard.style.marginTop = "2em";
  scoreboard.style.padding = "1em";
  scoreboard.style.border = "2px solid #866a2d";
  scoreboard.style.borderRadius = "8px";

  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.appendChild(scoreboard);

  return scoreboard;
}

function clearScoreBoard() {
  const scoreboard = document.getElementById("scoreboard");
  if (scoreboard) scoreboard.remove();
}

/*********************************************************
 * Button highlighting
 *********************************************************/
function highlightModeButton(mode) {
  const modeButtons = document.querySelectorAll("[data-mode]");
  modeButtons.forEach((btn) => {
    const m = btn.getAttribute("data-mode");
    if (m === mode) btn.classList.add("active-mode");
    else btn.classList.remove("active-mode");
  });
}

/*********************************************************
 * Initialize on page load
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const ballotContainer = document.getElementById("ballot-container");
  if (ballotContainer) ballotContainer.style.opacity = 1; // Ensure fade-in works.

  updateUIForMode();
});