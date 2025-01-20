import { enableDragAndDrop } from "./dragAndDrop.js";
import { getMode } from "./playerMode.js";

/**
 * Renders the ballot categories and nominations.
 */
export function renderBallot(categories) {
  const ballotContainer = document.getElementById("ballot-container");
  ballotContainer.innerHTML = ""; // Clear existing content

  const mode = getMode().toLowerCase(); // "host", "guest", or "watch"

  categories.forEach((category, index) => {
    // Create a container for this category
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");
    categoryElement.id = `category-${index}`;

    // Load the saved order for Host or Guest; fallback to default order
    let savedOrder = [];
    if (mode === "host" || mode === "guest") {
      const key = `${mode}-category-${index}-order`;
      const storedOrder = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(storedOrder)) {
        savedOrder = storedOrder;
      }
    }

    // Reorder nominations based on the saved order or use the default
    const nominations = savedOrder.length
      ? reorderNominations(category.nominations, savedOrder)
      : category.nominations;

    // Generate HTML for nominations
    const nominationsHTML = nominations
      .map((nom) => {
        return `
          <div class="nomination" data-id="${nom.work_code}" draggable="true">
            <span>${nom.pictureTitle}</span>
          </div>
        `;
      })
      .join("");

    // Fill category HTML and append to the container
    categoryElement.innerHTML = `
      <h2>${category.title}</h2>
      <div class="drag-container" id="drag-${index}">
        ${nominationsHTML}
      </div>
    `;
    ballotContainer.appendChild(categoryElement);

    // Enable drag-and-drop if mode is Host or Guest
    if (mode !== "watch") {
      const dragContainer = categoryElement.querySelector(".drag-container");
      enableDragAndDrop(dragContainer);
    }
  });
}

/**
 * Reorders nominations based on a saved order.
 * Any items not in the saved order are added to the end.
 */
function reorderNominations(original, savedOrder) {
  const map = {};
  original.forEach((nom) => {
    map[nom.work_code] = nom; // Assume work_code is unique
  });

  // Build the reordered array and append any leftover items
  const reordered = savedOrder.map((id) => map[id]).filter(Boolean);
  const leftovers = original.filter((nom) => !savedOrder.includes(nom.work_code));
  return [...reordered, ...leftovers];
}