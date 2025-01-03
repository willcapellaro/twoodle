// Helper to parse the Markdown ballot
function parseMarkdown(mdText) {
    const lines = mdText.split("\n");
    const categories = [];
    let currentCategory = null;

    lines.forEach((line) => {
        if (line.startsWith("##")) {
            if (currentCategory) categories.push(currentCategory);
            currentCategory = { title: line.replace("##", "").trim(), nominations: [] };
        } else if (line.startsWith("- Nominee:")) {
            const parts = line.split(" | Backdrop: ");
            const name = parts[0].replace("- Nominee: ", "").trim();
            const backdrop = parts[1]?.trim();
            currentCategory.nominations.push({ name, backdrop });
        }
    });
    if (currentCategory) categories.push(currentCategory);

    return categories;
}

// Helper to render the ballot
function renderBallot(categories, ballotContainer, sidebarLinks) {
    ballotContainer.innerHTML = ""; // Clear existing content
    sidebarLinks.innerHTML = ""; // Clear sidebar links

    categories.forEach((category, index) => {
        renderCategory(ballotContainer, sidebarLinks, category, index);
    });
}

// Render individual categories dynamically
function renderCategory(ballotContainer, sidebarLinks, category, index) {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");
    categoryElement.id = `category-${index}`;

    // Add to sidebar navigation
    sidebarLinks.innerHTML += `<li><a href="#category-${index}">${category.title}</a></li>`;

    // Get saved nomination order from local storage
    const savedOrder = JSON.parse(localStorage.getItem(`category-${index}-order`)) || category.nominations;

    // Generate category content
    categoryElement.innerHTML = `
        <h2>${category.title}</h2>
        <div class="drag-container" id="drag-${index}">
            ${savedOrder
                .map((nomination) => {
                    const name = nomination.name || nomination; // Handle string-only nominations
                    const backdropUrl = nomination.backdrop
                        ? `https://image.tmdb.org/t/p/w780${nomination.backdrop}`
                        : "imgs/testimg.jpg"; // Use test image for now

                    return `
                        <div class="nomination" data-id="${name}">
                            <div class="backdrop-container">
                                <img src="${backdropUrl}" alt="${name}" class="backdrop-image">
                            </div>
                            <span>${name}</span>
                            <div class="chip-container">
                                <div class="toggle-chip seen-it ${getChipState(index, name, 'seen-it')}">
                                    <i class="fas fa-eye"></i> Seen it
                                </div>
                                <div class="toggle-chip love-it ${getChipState(index, name, 'love-it')}">
                                    <i class="fas fa-heart"></i> Love it!
                                </div>
                                <div class="toggle-chip hate-it ${getChipState(index, name, 'hate-it')}">
                                    <i class="fas fa-thumbs-down"></i> Hate it
                                </div>
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;

    ballotContainer.appendChild(categoryElement);
}

// Clear all votes and restore the default state
function clearAllVotes(categories) {
    // Remove all local storage related to votes
    categories.forEach((_, index) => {
        localStorage.removeItem(`category-${index}-order`);
        localStorage.removeItem(`category-${index}-chips`);
    });

    // Restore default content
    const ballotContainer = document.getElementById("ballot-container");
    const sidebarLinks = document.getElementById("sidebar-links");

    renderBallot(categories, ballotContainer, sidebarLinks);

    enableDragAndDrop();
    enableChips();
}

// Initialize drag-and-drop functionality
function enableDragAndDrop() {
    // Drag-and-drop logic goes here
}

// Initialize chip functionality
function enableChips() {
    document.querySelectorAll(".toggle-chip").forEach((chip) => {
        chip.addEventListener("click", (e) => {
            const chip = e.target.closest(".toggle-chip");
            const nomination = chip.closest(".nomination").getAttribute("data-id");
            const categoryId = chip.closest(".drag-container").id.split("-")[1];
            const chipType = chip.classList.contains("seen-it")
                ? "seen-it"
                : chip.classList.contains("love-it")
                ? "love-it"
                : "hate-it";

            // Toggle active state for this chip
            chip.classList.toggle("active");

            // Save chip state to local storage
            saveChipState(categoryId, nomination, chipType, chip.classList.contains("active"));
        });
    });
}

// Save chip state to local storage
function saveChipState(categoryId, nomination, chipType, isActive) {
    const chipStates = JSON.parse(localStorage.getItem(`category-${categoryId}-chips`)) || {};
    chipStates[nomination] = chipStates[nomination] || {};
    chipStates[nomination][chipType] = isActive;
    localStorage.setItem(`category-${categoryId}-chips`, JSON.stringify(chipStates));
}

// Get chip state from local storage
function getChipState(categoryId, nomination, chipType) {
    const chipStates = JSON.parse(localStorage.getItem(`category-${categoryId}-chips`)) || {};
    return chipStates[nomination]?.[chipType] ? "active" : "";
}

// Main logic on page load
document.addEventListener("DOMContentLoaded", async () => {
    const ballotContainer = document.getElementById("ballot-container");
    const sidebarLinks = document.getElementById("sidebar-links");
    const clearVotesButton = document.getElementById("clear-votes-button");

    // Default categories for fallback and reset
    const defaultCategories = [
        {
            title: "Best Picture",
            nominations: ["The Golden Journey", "Midnight Sky", "Shimmering Sands"],
        },
        {
            title: "Best Actor",
            nominations: [
                "John Doe (The Golden Journey)",
                "Mark Smith (Midnight Sky)",
                "Alex Johnson (Shimmering Sands)",
            ],
        },
    ];

    // Try to load ballot.md dynamically
    try {
        const response = await fetch("ballot.md");
        if (!response.ok) throw new Error("Failed to load ballot.md");
        const ballotText = await response.text();
        const categories = parseMarkdown(ballotText);

        renderBallot(categories, ballotContainer, sidebarLinks);
    } catch (error) {
        console.error("Error loading ballot.md:", error.message);

        // Fallback to default categories
        renderBallot(defaultCategories, ballotContainer, sidebarLinks);
    }

    enableDragAndDrop();
    enableChips();

    // Handle Clear Votes button
    clearVotesButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all your votes? This cannot be undone.")) {
            clearAllVotes(defaultCategories);
        }
    });
});