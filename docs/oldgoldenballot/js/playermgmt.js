/**
 * Minimal player management for two hardcoded players: "Host" and "Guest".
 * - Stores `currentPlayer` in localStorage.
 * - No UI dropdown or .player-data toggling.
 */

const players = ["Host", "Guest"];
export let currentPlayer = "Host"; // Default to Host

// Save current player to localStorage (optional)
function saveCurrentPlayer() {
    localStorage.setItem("currentPlayer", currentPlayer);
}

// Load current player from localStorage (optional)
function loadCurrentPlayer() {
    const savedPlayer = localStorage.getItem("currentPlayer");
    if (savedPlayer && players.includes(savedPlayer)) {
        currentPlayer = savedPlayer;
    }
}

/**
 * Switch current player (e.g., call `setCurrentPlayer("Guest")`).
 */
export function setCurrentPlayer(player) {
    if (players.includes(player)) {
        currentPlayer = player;
        saveCurrentPlayer();
    } else {
        console.warn(`Player "${player}" does not exist. Ignoring request.`);
    }
}

/**
 * Get the current player.
 */
export function getCurrentPlayer() {
    return currentPlayer;
}

// On page load, set `currentPlayer` from localStorage if it exists
document.addEventListener("DOMContentLoaded", () => {
    loadCurrentPlayer();
});