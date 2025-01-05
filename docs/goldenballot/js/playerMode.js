/**************************************************
 * playerMode.js
 * 
 * 1) Three modes: "Host", "Guest", "Watch"
 * 2) Persists mode in localStorage (so refresh won't lose it).
 * 3) Watch mode: 
 *    - Disables drag
 *    - Shows “Winner” checkboxes
 *    - Auto-calculates scoreboard
 **************************************************/

export let currentMode = "Host";

/* === Load mode from localStorage on script load === */
const storedMode = localStorage.getItem("currentMode");
if (storedMode && ["Host", "Guest", "Watch"].includes(storedMode)) {
  currentMode = storedMode;
}

// Simple fade helpers
function fadeOut(element, callback) {
  element.classList.add("fade-out");
  element.classList.remove("fade-in");
  setTimeout(() => {
    if (callback) callback();
  }, 300);
}
function fadeIn(element) {
  element.classList.remove("fade-out");
  element.classList.add("fade-in");
}

/**
 * Switch mode and persist in localStorage
 */
export function setMode(newMode) {
  if (!["Host", "Guest", "Watch"].includes(newMode)) return;
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
 * Called after changing modes or once DOM is loaded
 */
export function updateUIForMode() {
  highlightModeButton(currentMode);

  const categories = document.querySelectorAll(".category");
  categories.forEach((cat) => {
    const dragContainer = cat.querySelector(".drag-container");
    if (!dragContainer) return;

    if (currentMode === "Watch") {
      cat.classList.add("watch-mode");
      // Remove draggable
      dragContainer.querySelectorAll(".nomination").forEach((nom) => {
        nom.removeAttribute("draggable");
        nom.style.cursor = "default";
      });
      injectWatchModeUI(dragContainer);
    } else {
      // Host or Guest
      cat.classList.remove("watch-mode");
      dragContainer.querySelectorAll(".nomination").forEach((nom) => {
        nom.setAttribute("draggable", "true");
        nom.style.cursor = "grab";
      });
      removeWatchModeUI(dragContainer);
    }
  });

  // After re-injecting, recalc scoreboard if we’re in Watch mode
  if (currentMode === "Watch") {
    renderScoreBoard();
  } else {
    clearScoreBoard();
  }
}

/*********************************************************
 * Watch Mode UI
 *********************************************************/
function injectWatchModeUI(dragContainer) {
  dragContainer.querySelectorAll(".nomination").forEach((nom) => {
    if (!nom.querySelector(".winner-box-container")) {
      const rightContainer = document.createElement("div");
      rightContainer.classList.add("winner-box-container");
      rightContainer.style.marginLeft = "auto";
      rightContainer.style.display = "flex";
      rightContainer.style.alignItems = "center";

      const winnerBox = document.createElement("input");
      winnerBox.type = "checkbox";
      winnerBox.classList.add("final-winner-checkbox");
      winnerBox.style.marginRight = "0.3em";
      winnerBox.addEventListener("change", () => {
        renderScoreBoard();
      });

      const winnerLabel = document.createElement("label");
      winnerLabel.textContent = "Winner";

      rightContainer.appendChild(winnerBox);
      rightContainer.appendChild(winnerLabel);
      nom.appendChild(rightContainer);
    }
    injectPickInfo(nom);
  });
}

function removeWatchModeUI(dragContainer) {
  dragContainer.querySelectorAll(".nomination").forEach((nom) => {
    const rightContainer = nom.querySelector(".winner-box-container");
    if (rightContainer) rightContainer.remove();

    const pickInfo = nom.querySelector(".pick-info");
    if (pickInfo) pickInfo.remove();
  });
}

/**
 * Shows (Host Winner), (Host Backup), (Guest Winner), etc.
 */
function injectPickInfo(nom) {
  const dataId = nom.getAttribute("data-id");
  if (!dataId) return;

  // Remove old .pick-info first
  const oldInfo = nom.querySelector(".pick-info");
  if (oldInfo) oldInfo.remove();

  const pickInfoSpan = document.createElement("span");
  pickInfoSpan.classList.add("pick-info");
  pickInfoSpan.style.marginLeft = "1em";
  pickInfoSpan.style.fontSize = "0.8em";
  pickInfoSpan.style.color = "#666";

  const catId = nom.closest(".drag-container").id.split("-").pop();
  const hostKey = `host-category-${catId}-order`;
  const guestKey = `guest-category-${catId}-order`;

  const hostArr = JSON.parse(localStorage.getItem(hostKey)) || [];
  const guestArr = JSON.parse(localStorage.getItem(guestKey)) || [];

  let text = "";
  if (hostArr[0] === dataId) text += "(Host Winner) ";
  else if (hostArr[1] === dataId) text += "(Host Backup) ";

  if (guestArr[0] === dataId) text += "(Guest Winner) ";
  else if (guestArr[1] === dataId) text += "(Guest Backup) ";

  pickInfoSpan.textContent = text.trim();

  const wbc = nom.querySelector(".winner-box-container");
  if (wbc) {
    nom.insertBefore(pickInfoSpan, wbc);
  } else {
    nom.appendChild(pickInfoSpan);
  }
}

/*********************************************************
 * Scoring
 *********************************************************/
function renderScoreBoard() {
  // Check all categories, see which items have "winner" checked
  let hostScore = 0;
  let guestScore = 0;

  const allCategories = document.querySelectorAll(".category");
  allCategories.forEach((cat) => {
    const catId = cat.querySelector(".drag-container")?.id.split("-").pop();
    if (!catId) return;

    const hostArr = JSON.parse(localStorage.getItem(`host-category-${catId}-order`)) || [];
    const guestArr = JSON.parse(localStorage.getItem(`guest-category-${catId}-order`)) || [];

    const checkedNoms = cat.querySelectorAll(".nomination .final-winner-checkbox:checked");
    checkedNoms.forEach((cb) => {
      const nomDiv = cb.closest(".nomination");
      if (!nomDiv) return;

      const dataId = nomDiv.getAttribute("data-id");
      if (!dataId) return;

      // If Host or Guest picked dataId in [0] => 1 point, [1] => 0.25
      //  - multiple checks can exist, that’s OK
      // Host check
      const hIndex = hostArr.indexOf(dataId);
      if (hIndex === 0) hostScore += 1;
      else if (hIndex === 1) hostScore += 0.25;

      // Guest check
      const gIndex = guestArr.indexOf(dataId);
      if (gIndex === 0) guestScore += 1;
      else if (gIndex === 1) guestScore += 0.25;
    });
  });

  // Show scoreboard in sidebar or wherever
  let scoreboard = document.getElementById("scoreboard");
  if (!scoreboard) {
    scoreboard = document.createElement("div");
    scoreboard.id = "scoreboard";
    scoreboard.style.marginTop = "2em";
    scoreboard.style.padding = "1em";
    scoreboard.style.border = "2px solid #866a2d";
    scoreboard.style.borderRadius = "8px";
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.appendChild(scoreboard);
  }
  scoreboard.innerHTML = `
    <h3>Scores</h3>
    <p>Host: ${hostScore}</p>
    <p>Guest: ${guestScore}</p>
  `;
}

function clearScoreBoard() {
  const sb = document.getElementById("scoreboard");
  if (sb) sb.remove();
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
  // Add fade-in class
  const bc = document.getElementById("ballot-container");
  if (bc) bc.classList.add("fade-in");

  // Force UI to show the correct mode on load
  updateUIForMode();
});