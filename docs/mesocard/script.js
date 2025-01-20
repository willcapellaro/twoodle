const grid = document.getElementById("game-grid");
const decksContainer = document.getElementById("decks");
let cardsData = [];
let flippedCard = null;

// Assign colors to each civilization
const civColors = {
  Aztec: "red", // Coral Red
  Olmec: "red", // Mint Green
  Maya: "red",  // Sky Blue
};

// Create a notification area
const notification = document.createElement("div");
notification.id = "notification";
document.body.appendChild(notification);

function showNotification(message, type = "info") {
  notification.textContent = message;
  notification.className = type; // Apply the type as a class for styling
  setTimeout(() => {
    notification.textContent = "";
    notification.className = "";
  }, 2000);
}

// Load cards from JSON
fetch("cards.json")
  .then((response) => response.json())
  .then((data) => {
    cardsData = data.cards;
    createDecks();
    createGrid();
    showNotification("Game initialized! Flip a card to begin.", "success");
  });

// Create civilization decks
function createDecks() {
  Object.keys(civColors).forEach((civ) => {
    const deck = document.createElement("div");
    deck.classList.add("deck");
    deck.dataset.civ = civ;
    deck.textContent = civ;
    deck.addEventListener("dragover", allowDrop);
    deck.addEventListener("drop", dropCard);
    decksContainer.appendChild(deck);
  });
}

// Create the card grid
function createGrid() {
  const shuffledCards = [...cardsData, ...cardsData]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({ ...card, id: index }));

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.civ = card.civilization;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${card.word}</div>
        <div class="card-back">
          <svg xmlns="" viewBox="0 0 24 24" class="card-pattern">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#000" stroke-width="2"></circle>
          </svg>
        </div>
      </div>
    `;

    cardElement.addEventListener("click", () => flipCard(cardElement));
    grid.appendChild(cardElement);
  });
}

// Handle card flip
function flipCard(card) {
  if (flippedCard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCard = card;
  showNotification(`Flipped card: ${card.querySelector(".card-front").textContent}`, "info");

  card.setAttribute("draggable", true);
  card.addEventListener("dragstart", drag);
}

// Drag and drop logic
function drag(event) {
  event.dataTransfer.setData("text", event.target.dataset.civ);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropCard(event) {
  const civ = event.dataTransfer.getData("text");
  const correctCiv = event.target.dataset.civ;

  if (civ === correctCiv) {
    event.target.appendChild(flippedCard);
    flippedCard.classList.remove("flipped");
    flippedCard.setAttribute("draggable", false);

    // Change the color of the card's SVG pattern
    const svg = flippedCard.querySelector(".card-pattern");
    svg.setAttribute("stroke", civColors[civ]);
    showNotification(`Correct! Card added to the ${correctCiv} deck.`, "success");
  } else {
    flippedCard.classList.remove("flipped");
    flippedCard.style.order = Math.floor(Math.random() * 100); // Randomize placement
    showNotification("Incorrect! The card was returned to the grid.", "error");
  }
  flippedCard = null;
}