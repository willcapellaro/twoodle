/**********************************************
 * localStorage.js
 * 
 * Approach B: The saveDragOrder() function checks 
 * getMode() from playerMode.js to decide if we:
 *  - skip saving for "Watch",
 *  - prefix keys with "host-" or "guest-" for Host/Guest.
 **********************************************/

import { getMode } from "./playerMode.js";

/**
 * Clears all localStorage keys that start with "category-"
 * (Optional, if you want to remove "host-category-" or "guest-category-" 
 * you can expand this logic.)
 */
export function clearAllCategoryData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
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
 * Saves the drag order for a category container.
 * Expects container.id like "category-0".
 * This function:
 *   1. Reads current mode ("host", "guest", or "watch").
 *   2. Skips saving if mode === "watch".
 *   3. Builds localStorage key like "host-category-0-order".
 */
export function saveDragOrder(container) {
  // Make sure container.id is something like "category-0"
  if (!container.id.includes("-")) {
    console.warn("saveDragOrder: invalid container.id", container.id);
    return;
  }

  // Check which mode we're in
  const mode = getMode().toLowerCase(); // "host", "guest", or "watch"
  if (mode === "watch") {
    // Don't save anything in Watch mode
    console.log("saveDragOrder: skipping because mode is 'watch'.");
    return;
  }

  // Example: "category-0" => split => ["category","0"]
  // We want the last part: "0"
  const parts = container.id.split("-");
  const categoryIndex = parts[parts.length - 1]; 

  // Gather the data-id attributes into an array
  const nominations = container.querySelectorAll(".nomination");
  const newOrder = [];
  nominations.forEach((nom) => {
    const dataId = nom.getAttribute("data-id");
    if (!dataId) {
      console.warn("Nomination missing data-id:", nom);
    } else {
      newOrder.push(dataId);
    }
  });

  // Build final key: e.g. "host-category-0-order"
  const key = `${mode}-category-${categoryIndex}-order`;
  localStorage.setItem(key, JSON.stringify(newOrder));
  console.log(`Saved order to '${key}':`, newOrder);
}

/**
 * (Optional) Examples of other existing helpers
 * If you want to store "chips" per category, you can adapt them 
 * to also include a "host-" or "guest-" prefix, etc.
 */
export function clearAllVotes(categories) {
  categories.forEach((_, index) => {
    localStorage.removeItem(`category-${index}-order`);
    localStorage.removeItem(`category-${index}-chips`);
    console.log(`Cleared votes for category-${index}`);
  });
}

// If you have other chip or state functions, keep them here...