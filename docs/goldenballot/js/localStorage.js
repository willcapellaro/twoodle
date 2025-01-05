/**********************************************
 * localStorage.js
 *
 * Approach B: We do NOT rename container IDs.
 * Instead, we read getMode() to figure out
 * "host-", "guest-", or skip if "watch".
 **********************************************/
import { getMode } from "./playerMode.js";

export function clearAllCategoryData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Remove any "category-" or "host-category-" or "guest-category-"
    if (key && key.includes("category-")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
    console.log(`Removed localStorage key: ${key}`);
  });
}

/**
 * Saves order => "host-category-0-order" or "guest-category-0-order"
 * If mode = watch, skip saving.
 */
export function saveDragOrder(container) {
  if (!container.id.includes("-")) {
    console.warn("saveDragOrder: invalid container.id", container.id);
    return;
  }
  const mode = getMode().toLowerCase();
  if (mode === "watch") {
    console.log("saveDragOrder: skipping because mode is 'watch'");
    return;
  }

  // e.g. container.id = "category-0"
  const parts = container.id.split("-");
  const categoryIndex = parts[parts.length - 1];

  // Gather the data-id attributes
  const newOrder = [];
  const nominations = container.querySelectorAll(".nomination");
  nominations.forEach((nom) => {
    const dataId = nom.getAttribute("data-id");
    if (!dataId) {
      console.warn("Nomination missing data-id:", nom);
    } else {
      newOrder.push(dataId);
    }
  });

  // Build final key
  const key = `${mode}-category-${categoryIndex}-order`;
  localStorage.setItem(key, JSON.stringify(newOrder));
  console.log(`Saved order to '${key}':`, newOrder);
}