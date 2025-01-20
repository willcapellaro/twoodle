export let players = ["Host"];
export let currentPlayer = "Host";

// Save players to localStorage
export function savePlayers() {
    localStorage.setItem("players", JSON.stringify(players));
}

// Load players and restore current player
export function loadPlayers() {
    const savedPlayers = JSON.parse(localStorage.getItem("players"));
    players = savedPlayers && savedPlayers.length > 0 ? savedPlayers : ["Host"];

    const savedCurrentPlayer = localStorage.getItem("currentPlayer");
    currentPlayer = savedCurrentPlayer && players.includes(savedCurrentPlayer) ? savedCurrentPlayer : "Host";

    updatePlayerDropdown();
}

// Update the player dropdown
function updatePlayerDropdown() {
    const dropdown = document.getElementById("current-player");
    dropdown.innerHTML = players
        .map(player => `<option value="${player}" ${player === currentPlayer ? "selected" : ""}>${player}</option>`)
        .join("") +
        `<option disabled>---</option>
        <option value="addPlayer">+ Add Player</option>`;
}

// Handle dropdown changes
export function setupDropdown() {
    document.getElementById("current-player").addEventListener("change", (e) => {
        const selectedOption = e.target.value;

        if (selectedOption === "addPlayer") {
            openAddPlayerModal();
            e.target.value = currentPlayer; // Reset dropdown
        } else {
            currentPlayer = selectedOption;
            localStorage.setItem("currentPlayer", currentPlayer);
        }
    });
}

// Open the Add Player Modal
function openAddPlayerModal() {
    const modal = document.getElementById("add-player-modal");
    modal.style.display = "flex";

    // Handle Add Player Form
    document.getElementById("add-player-form").onsubmit = (e) => {
        e.preventDefault();
        const newPlayerName = document.getElementById("new-player-name").value.trim();

        if (newPlayerName && !players.includes(newPlayerName)) {
            players.push(newPlayerName);
            savePlayers();
            updatePlayerDropdown();

            // Switch to the newly added player
            currentPlayer = newPlayerName;
            localStorage.setItem("currentPlayer", currentPlayer);
        }

        modal.style.display = "none"; // Close the modal
    };

    // Handle Cancel Button
    document.getElementById("add-player-cancel").onclick = () => {
        modal.style.display = "none";
    };
}

// Show only the data for the selected player
function updatePlayerDisplay() {
    document.querySelectorAll(".player-data").forEach((div) => {
        div.classList.remove("active");
    });

    const currentPlayerDiv = document.querySelector(`.player-data.player-${currentPlayer}`);
    if (currentPlayerDiv) {
        currentPlayerDiv.classList.add("active");
    }
}

// Call updatePlayerDisplay whenever the current player changes
document.querySelector("#current-player").addEventListener("change", (e) => {
    const selectedOption = e.target.value;

    if (!["addPlayer", "renamePlayer", "deletePlayer", "deleteAllPlayers"].includes(selectedOption)) {
        currentPlayer = selectedOption;
        localStorage.setItem("currentPlayer", currentPlayer); // Save current player
        updatePlayerDisplay();
    }
});