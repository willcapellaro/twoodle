import { saveDragOrder } from "./localStorage.js";
import { saveDragOrderWithMode } from "./playerMode.js";

/**
 * Enables DnD on a single container.
 */
export function enableDragAndDrop(container) {
  let draggedElement = null;

  container.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("nomination")) {
      draggedElement = e.target;
      e.target.classList.add("dragging");
    }
  });

  container.addEventListener("dragend", () => {
    if (draggedElement) {
      draggedElement.classList.remove("dragging");
      draggedElement = null;
    }
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (draggedElement) {
      if (afterElement == null) {
        container.appendChild(draggedElement);
      } else {
        container.insertBefore(draggedElement, afterElement);
      }
    }
  });

  container.addEventListener("drop", () => {
    // Save the new order on drop
    saveDragOrder(container);
  });
}

/**
 * Reorders the container's children based on saved localStorage data.
 */
export function loadDragOrder(container) {
  // Expect container.id to look like "category-0", "category-1", etc.
  const categoryId = container.id.split("-")[1];
  const savedOrder = JSON.parse(localStorage.getItem(`category-${categoryId}-order`)) || [];

  savedOrder.forEach((nominationId) => {
    // Find the matching .nomination by data-id
    const nominationElement = container.querySelector(`[data-id="${nominationId}"]`);
    if (nominationElement) {
      container.appendChild(nominationElement);
    }
  });
}

container.addEventListener("drop", (e) => {
    e.preventDefault();
    saveDragOrderWithMode(container);
  });

/**
 * Helper function to figure out where to drop the dragged element.
 */
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".nomination:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}