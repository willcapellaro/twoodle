/**************************************************
 * dragAndDrop.js
 **************************************************/
import { saveDragOrder } from "./localStorage.js";

export function enableDragAndDrop(container) {
  let draggedElement = null;

  container.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("nomination")) {
      draggedElement = e.target;
      e.target.classList.add("dragging");
    }
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (draggedElement) {
      if (!afterElement) {
        container.appendChild(draggedElement);
      } else {
        container.insertBefore(draggedElement, afterElement);
      }
    }
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedElement) {
      draggedElement.classList.remove("dragging");
      draggedElement = null;
    }
    // Save new order
    saveDragOrder(container);
  });
}

function getDragAfterElement(container, y) {
  const draggableEls = [...container.querySelectorAll(".nomination:not(.dragging)")];
  return draggableEls.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}