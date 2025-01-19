import { renderBallot } from "./renderBallot.js";
import { clearAllCategoryData } from "./localStorage.js";
import { setMode, getMode, updateUIForMode } from "./playerMode.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch data from your JSON
  const resp = await fetch("ballson-gg.json");
  const rawData = await resp.json();

  // Group raw data by category
  const categories = groupByCategory(rawData);

  // 2. Initial render
  renderBallot(categories);

  // 3. Mode switching buttons
  setupModeSwitching(categories);

  // 4. Clear Votes button
  setupClearVotes(categories);

  // 5. Force UI update in case a stored mode exists
  updateUIForMode();
  updateModeIndicator(); // Update the indicator on initial load
});

/**
 * Groups the raw JSON data by category for rendering.
 */
function groupByCategory(rawData) {
  const grouped = {};
  rawData.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = { title: item.category, nominations: [] };
    }
    grouped[item.category].nominations.push({
      work_code: item.work_code,
      pictureTitle: item.work_title || item.nominee_name || "Untitled",
    });
  });
  return Object.values(grouped);
}

/**
 * Sets up mode switching (Host, Guest, Watch).
 */
function setupModeSwitching(categories) {
  const modeSelectDiv = document.getElementById("mode-select");
  const modeIndicator = document.getElementById("current-mode-indicator");

  if (modeSelectDiv) {
    modeSelectDiv.addEventListener("click", (e) => {
      if (e.target.matches("button[data-mode]")) {
        const newMode = e.target.getAttribute("data-mode");
        setMode(newMode); // Update the mode globally
        renderBallot(categories); // Re-render based on the new mode
        updateUIForMode(); // Update UI elements for the mode
        updateModeIndicator(); // Update the mode indicator
      }
    });
  }

  // Initial update of the mode indicator
  if (modeIndicator) {
    modeIndicator.textContent = `Mode: ${getMode()}`;
  }
}

/**
 * Sets up the Clear Votes button functionality.
 */
function setupClearVotes(categories) {
  const resetButton = document.getElementById("clear-votes-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      clearAllCategoryData(); // Wipe localStorage
      renderBallot(categories); // Re-render with defaults
    });
  }
}

/**
 * Updates the current mode indicator UI element.
 */
function updateModeIndicator() {
  const modeIndicator = document.getElementById("current-mode-indicator");
  if (modeIndicator) {
    modeIndicator.textContent = `Mode: ${getMode()}`;
  }
}