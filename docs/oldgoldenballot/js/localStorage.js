/**
 * Saves the drag order for a specific category container.
 */
export function saveDragOrder(container, index) {
  const nominations = Array.from(container.querySelectorAll(".nomination"));
  const newOrder = nominations.map((nom) => nom.getAttribute("data-id"));
  localStorage.setItem(`category-${index}-order`, JSON.stringify(newOrder));
}

/**
 * Loads the saved drag order for a specific category.
 */
export function loadDragOrder(index) {
  const key = `category-${index}-order`;
  const order = JSON.parse(localStorage.getItem(key));
  return Array.isArray(order) ? order : [];
}