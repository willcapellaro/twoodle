import { renderBallot } from "./renderBallot.js";
import { clearAllCategoryData } from "./localStorage.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch data from JSON
  const resp = await fetch("ballson-gg.json");
  const rawData = await resp.json();

  // Group raw data by category
  const categories = groupByCategory(rawData);

  // Render the ballot
  renderBallot(categories);

  // Set up Clear Votes button
  setupClearVotes(categories);
});

/**
 * Groups the raw JSON data by category.
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
 * Sets up the Clear Votes button.
 */
function setupClearVotes(categories) {
  const resetButton = document.getElementById("clear-votes-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      clearAllCategoryData();
      renderBallot(categories);
    });
  }
}