// Load JSON data and render ballot
async function fetchBallotData() {
    try {
        const response = await fetch("ballot.json");
        if (!response.ok) throw new Error("Failed to load ballot.json");
        const ballotData = await response.json();
        return ballotData.categories;
    } catch (error) {
        console.error("Error loading ballot.json:", error.message);
        return [];
    }
}

// Render individual categories dynamically
function renderCategory(ballotContainer, category, index) {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");
    categoryElement.id = `category-${index}`;

    // Generate category content
    const nominationsHTML = category.nominations
        .map((nomination) => {
            const backdropUrl = nomination.backdropImage || "imgs/testimg.jpg";

            return `
                <div class="nomination" data-id="${nomination.name}" draggable="true">
                    <div class="backdrop-container">
                        <img src="${backdropUrl}" alt="${nomination.name}" class="backdrop-image">
                    </div>
                    <span>${nomination.pictureTitle}</span>
                    <div class="chip-container">
                        <div class="toggle-chip seen-it">
                            <i class="fas fa-eye"></i> Seen it
                        </div>
                        <div class="toggle-chip love-it">
                            <i class="fas fa-heart"></i> Love it!
                        </div>
                        <div class="toggle-chip hate-it">
                            <i class="fas fa-thumbs-down"></i> Hate it
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");

    categoryElement.innerHTML = `
        <h2>${category.title}</h2>
        <div class="drag-container" id="drag-${index}">
            ${nominationsHTML}
        </div>
    `;

    ballotContainer.appendChild(categoryElement);
}

// Clear all votes and reset the page
function clearAllVotes(categories) {
    categories.forEach((_, index) => {
        localStorage.removeItem(`category-${index}-order`);
        localStorage.removeItem(`category-${index}-chips`);
    });

    renderBallot(categories);
}

// Render the ballot
function renderBallot(categories) {
    const ballotContainer = document.getElementById("ballot-container");
    ballotContainer.innerHTML = ""; // Clear existing content

    categories.forEach((category, index) => {
        renderCategory(ballotContainer, category, index);
    });

    enableDragAndDrop();
    enableChips();
}

// Initialize drag-and-drop functionality
function enableDragAndDrop() {
    const dragContainers = document.querySelectorAll(".drag-container");

    dragContainers.forEach((container) => {
        let draggedElement = null;

        // Start dragging
        container.addEventListener("dragstart", (e) => {
            if (e.target.classList.contains("nomination")) {
                draggedElement = e.target;
                e.target.classList.add("dragging");
            }
        });

        // End dragging
        container.addEventListener("dragend", () => {
            if (draggedElement) {
                draggedElement.classList.remove("dragging");
                draggedElement = null;
            }
        });

        // Handle dragging over the container
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

        // Save the new order on drop
        container.addEventListener("drop", () => {
            saveDragOrder(container);
        });
    });
}

// Helper function to find the closest element after the dragged one
function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll(".nomination:not(.dragging)"),
    ];

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

// Save the new order of nominations to local storage
function saveDragOrder(container) {
    const categoryId = container.id.split("-")[1];
    const newOrder = [...container.querySelectorAll(".nomination")].map(
        (nomination) => nomination.getAttribute("data-id")
    );
    localStorage.setItem(`category-${categoryId}-order`, JSON.stringify(newOrder));
}

// Initialize chip functionality
function enableChips() {
    document.querySelectorAll(".toggle-chip").forEach((chip) => {
        chip.addEventListener("click", (e) => {
            const chip = e.target.closest(".toggle-chip");
            chip.classList.toggle("active");
        });
    });
}

// Main logic on page load
document.addEventListener("DOMContentLoaded", async () => {
    const clearVotesButton = document.getElementById("clear-votes-button");
    const categories = await fetchBallotData();

    renderBallot(categories);

    clearVotesButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all your votes? This cannot be undone.")) {
            clearAllVotes(categories);
        }
    });
});