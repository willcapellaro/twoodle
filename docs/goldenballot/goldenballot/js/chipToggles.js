import { saveChipState, getChipState } from "./localStorage.js";

export function enableChips() {
    console.log("Enabling chips...");

    document.querySelectorAll(".nomination").forEach((nomination) => {
        nomination.querySelectorAll(".toggle-chip").forEach((chip) => {
            chip.addEventListener("click", () => {
                const isLoveIt = chip.classList.contains("love-it");
                const isHateIt = chip.classList.contains("hate-it");

                // Toggle the clicked chip
                chip.classList.toggle("active");

                // Handle mutual exclusivity
                if (isLoveIt && chip.classList.contains("active")) {
                    deactivateChip(nomination, "hate-it");
                }
                if (isHateIt && chip.classList.contains("active")) {
                    deactivateChip(nomination, "love-it");
                }
            });
        });
    });

    function deactivateChip(nomination, chipClass) {
        const chip = nomination.querySelector(`.${chipClass}`);
        if (chip) {
            chip.classList.remove("active");
        }
    }
}

function deactivateChip(nomination, chipClass, categoryId, nominationId) {
    const chip = nomination.querySelector(`.${chipClass}`);
    if (chip) {
        chip.classList.remove("active");
        saveChipState(categoryId, nominationId, chipClass, false);
        console.log(`Deactivated chip: ${chipClass}`);
    }
}