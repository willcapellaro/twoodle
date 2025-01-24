import { enableDragAndDrop } from "./dragAndDrop.js";
import { getMode } from "./playerMode.js";

/**
 * Renders the ballot categories and nominations.
 * On load, we fetch the localStorage order for the current mode 
 * (host- or guest-) to re-order items.
 */
export function renderBallot(categories) {
  const ballotContainer = document.getElementById("ballot-container");
  ballotContainer.innerHTML = "";

  const mode = getMode().toLowerCase(); 
    // "host", "guest", or "watch" (though watch doesn't store an order, 
    // so it won't find a key)

  categories.forEach((category, index) => {
    // Build container
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");
    categoryElement.id = `category-${index}`;

    // Attempt to load the saved order if mode = host or guest
    let savedOrder = [];
    if (mode === "host" || mode === "guest") {
      const key = `${mode}-category-${index}-order`;
      const loaded = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(loaded)) {
        savedOrder = loaded;
      }
    }
    // Reorder nominations if we have a savedOrder, else default
    const nominations = savedOrder.length > 0
      ? reorderNominations(category.nominations, savedOrder)
      : category.nominations;

    const nominationsHTML = nominations.map((nom) => {
      return `
        <div class="nomination" data-id="${nom.work_code}" draggable="true">
          <span>${nom.pictureTitle}</span>
        </div>
      `;
    }).join("");

    categoryElement.innerHTML = `
      <h2>${category.title}</h2>
      <div class="drag-container" id="drag-${index}">
        ${nominationsHTML}
      </div>
    `;

    ballotContainer.appendChild(categoryElement);

    // Enable DnD
    const dragContainer = categoryElement.querySelector(".drag-container");
    enableDragAndDrop(dragContainer);
  });
}

function reorderNominations(original, savedOrder) {
  // produce a new array in the saved order; fallback to original if missing
  const map = {};
  original.forEach((nom) => {
    map[nom.work_code] = nom; // assume work_code is unique
  });
  const reordered = savedOrder.map((id) => map[id]).filter(Boolean);
  // For any not in savedOrder, add them at the end
  const leftover = original.filter((nom) => !savedOrder.includes(nom.work_code));
  return [...reordered, ...leftover];
}