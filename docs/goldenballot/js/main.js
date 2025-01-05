import { renderBallot } from "./renderBallot.js";
import { clearAllCategoryData } from "./localStorage.js";
import { setMode, currentMode, updateUIForMode } from "./playerMode.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch data from your JSON
  const resp = await fetch("ballson-gg.json");
  const rawData = await resp.json();

  // rawData might need grouping by category:
  const categories = groupByCategory(rawData);

  // 2. Render
  renderBallot(categories);

  // 3. Mode switching buttons
  const modeSelectDiv = document.getElementById("mode-select");
  if (modeSelectDiv) {
    modeSelectDiv.addEventListener("click", (e) => {
      if (e.target.matches("button[data-mode]")) {
        const newMode = e.target.getAttribute("data-mode");
        setMode(newMode);
      }
    });
  }
  
  // 4. Clear Votes
  const resetButton = document.getElementById("clear-votes-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      clearAllCategoryData();
      window.location.reload();
    });
  }

  // 5. Force UI update in case we had a stored mode:
  updateUIForMode(); 
});

function groupByCategory(rawData) {
  const grouped = {};
  rawData.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = { title: item.category, nominations: [] };
    }
    grouped[item.category].nominations.push({
      work_code: item.work_code,
      pictureTitle: item.work_title || item.nominee_name || "Untitled"
    });
  });
  return Object.values(grouped);
}