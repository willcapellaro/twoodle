document.addEventListener("DOMContentLoaded", async () => {
    const ballotContainer = document.getElementById("ballot-container");
    const sidebarLinks = document.getElementById("sidebar-links");
    const clearVotesButton = document.getElementById("clear-votes-button");

    // Default content for testing
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

    // Generate default content
    defaultCategories.forEach((category, index) => {
        const savedOrder = JSON.parse(localStorage.getItem(`category-${index}-order`));
        const nominations = savedOrder || category.nominations.sort((a, b) => a.localeCompare(b));
        renderCategory(ballotContainer, sidebarLinks, { ...category, nominations }, index);
    });

    // Attempt to load ballot.md dynamically
    try {
        const response = await fetch("ballot.md");
        if (!response.ok) throw new Error("Failed to load ballot.md");
        const ballotText = await response.text();
        const categories = parseMarkdown(ballotText);

        // Clear the default content and render the fetched content
        ballotContainer.innerHTML = "";
        sidebarLinks.innerHTML = "";
        categories.forEach((category, index) => {
            const savedOrder = JSON.parse(localStorage.getItem(`category-${index}-order`));
            const nominations = savedOrder || category.nominations.sort((a, b) => a.localeCompare(b));
            renderCategory(ballotContainer, sidebarLinks, { ...category, nominations }, index);
        });
    } catch (error) {
        console.error("Error loading ballot.md:", error.message);
        // Default content remains if fetching fails
    }

    enableDragAndDrop();
    enableChips();

    // Clear votes button functionality
    clearVotesButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all your votes? This cannot be undone.")) {
            clearAllVotes(defaultCategories);
        }
    });
});

// Clear all local storage related to votes
function clearAllVotes(categories) {
    categories.forEach((_, index) => {
        localStorage.removeItem(`category-${index}-order`);
        localStorage.removeItem(`category-${index}-chips`);
    });

    // Reload the page to reset UI
    location.reload();
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
                    const name = typeof nomination === "string" ? nomination : nomination.name;
                    const backdropUrl =
                        nomination.backdrop && typeof nomination !== "string"
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
// Enable drag-and-drop using SortableJS
function enableDragAndDrop() {
    const dragContainers = document.querySelectorAll(".drag-container");

    dragContainers.forEach((container) => {
        new Sortable(container, {
            animation: 150,
            ghostClass: "sortable-ghost",
            store: {
                set: (sortable) => {
                    const order = sortable.toArray();
                    localStorage.setItem(`${sortable.el.id}-order`, JSON.stringify(order));
                },
                get: (sortable) => {
                    const order = localStorage.getItem(`${sortable.el.id}-order`);
                    return order ? JSON.parse(order) : [];
                },
            },
        });
    });
}

// Enable toggle functionality for chips
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

            // If "love-it" or "hate-it" is toggled, disable the other
            if (chipType === "love-it" || chipType === "hate-it") {
                const siblingType = chipType === "love-it" ? "hate-it" : "love-it";
                const siblingChip = chip.closest(".chip-container").querySelector(`.${siblingType}`);
                siblingChip.classList.remove("active");
            }

            // Save chip state to local storage
            saveChipState(categoryId, nomination, chipType, chip.classList.contains("active"));

            // Clear sibling chip state
            if (chipType === "love-it" || chipType === "hate-it") {
                const siblingType = chipType === "love-it" ? "hate-it" : "love-it";
                saveChipState(categoryId, nomination, siblingType, false);
            }
        });
    });
}

// Save chip state to local storage
function saveChipState(categoryId, nomination, chipType, isActive) {
    const key = `category-${categoryId}-chips`;
    const savedChips = JSON.parse(localStorage.getItem(key)) || {};
    if (!savedChips[nomination]) {
        savedChips[nomination] = {};
    }
    savedChips[nomination][chipType] = isActive;
    localStorage.setItem(key, JSON.stringify(savedChips));
}

// Get chip state from local storage
function getChipState(categoryId, nomination, chipType) {
    const key = `category-${categoryId}-chips`;
    const savedChips = JSON.parse(localStorage.getItem(key)) || {};
    return savedChips[nomination]?.[chipType] ? "active" : "";
}

// Markdown parser for ballot.md
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