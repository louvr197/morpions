import "./style.css";
import { hasWonOn } from "./morpionLogic.js";
import { morpionIATurn } from "./morpionIA.js";


// Fonction pour créer un élément avec des attributs et du contenu
function createElement(tag, attributes = {}, content = "") {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  if (content) element.innerText = content;
  return element;
}

// Fonction pour créer un label et un input
function createLabeledInput(labelText, inputAttributes) {
  const container = document.createElement("div");
  const label = createElement("label", { for: inputAttributes.id }, labelText);
  const input = createElement("input", inputAttributes);
  container.appendChild(label);
  container.appendChild(input);
  return container;
}

function showMessage(message) {
  messageContainer.innerText = message;
  messageContainer.style.display = "block";

  // Ajoute un gestionnaire de clic pour masquer le message
  messageContainer.addEventListener("click", () => {
    messageContainer.style.display = "none";
    setupBoard(boardSize.value, boardSize.value);
  }, { once: true }); // Le gestionnaire est exécuté une seule fois
}

// Initialisation du conteneur de messages
function setupMessageContainer() {
  const container = createElement("div", {
    id: "messageContainer",

  });
  app.appendChild(container);
  return container;
}

// Fonction pour configurer les paramètres
function setupSettings() {
  const settingsContainer = createElement("div", { class: "settings" });

  // Size of the board
  const bSize = createLabeledInput("Size of the board: ", {
    id: "boardSize",
    name: "boardSize",
    type: "number",
    min: 3,
    max: 5,
    value: 3,
    class: "boardSize",
  });
  settingsContainer.appendChild(bSize);

  // Player 1 AI Level
  const player1Input = createLabeledInput("Player 1 AI Level: ", {
    id: "player1IA",
    name: "player1IA",
    type: "number",
    min: 0,
    max: 4,
    value: 0,
    class: "player1IA",
  });
  settingsContainer.appendChild(player1Input);

  // Player 2 AI Level
  const player2Input = createLabeledInput("Player 2 AI Level: ", {
    id: "player2IA",
    name: "player2IA",
    type: "number",
    min: 0,
    max: 4,
    value: 0,
    class: "player2IA",
  });
  settingsContainer.appendChild(player2Input);

  // Keep last 3 moves
  const eraseLastInput = createLabeledInput("Keep last 3 Moves: ", {
    id: "eraseLast",
    name: "eraseLast",
    type: "checkbox",
  });
  settingsContainer.appendChild(eraseLastInput);

  // Reset button
  const resetButton = createElement(
    "button",
    { id: "reset" },
    "Reset"
  );
  resetButton.addEventListener("click", () => setupBoard(boardSize.value,boardSize.value));
  settingsContainer.appendChild(resetButton);

  // Start AI button
  const startAiButton = createElement(
    "button",
    { id: "startAi" },
    "Start AI"
  );
  startAiButton.addEventListener("click", () => {
    if (Number(player1IA.value) > 0) {
      let cell = morpionIATurn(boardState, turn % nbPlayer, player1IA.value);
      let row = cell[0];
      let col = cell[1];
      setTimeout(() => {
        document.querySelector("#cell" + (3 * row + col)).click();
      }, 1000);
    }
  });
  settingsContainer.appendChild(startAiButton);

  app.appendChild(settingsContainer);
}

// Initialisation
let app = document.querySelector("#app");
app.innerHTML = `
  
    <h1>Morpions</h1>
    <div class="board">
      
    </div>
  
`;

let messageContainer = setupMessageContainer();
setupSettings();

let board = document.querySelector(".board");

board.style.display = "grid";
board.style.width = "80vh";
board.style.height = "80vh";
board.style.gap = "3%";
let boardState = [];
let turn = 0;
let nbPlayer = 2;
let history = [];

function setupBoard(nbRow = 3, nbCol = 3) {
  console.log("setupBoard", nbRow, nbCol);
  resetBoardState(nbRow, nbCol);
  initializeBoardGrid(nbRow, nbCol);

  for (let row = 0; row < nbRow; row++) {
    boardState[row] = [];
    for (let col = 0; col < nbCol; col++) {
      boardState[row][col] = "";
      let newCell = createCell(row, col, nbCol);
      board.appendChild(newCell);
    }
  }
}

// Réinitialise l'état du plateau
function resetBoardState(nbRow, nbCol) {
  turn = 0;
  updateTurncounter();
  boardState = [];
  history = [];
  board.innerHTML = "";
}

// Configure la grille CSS pour le plateau
function initializeBoardGrid(nbRow, nbCol) {
  board.style.gridTemplate = `repeat(${nbRow}, 1fr) / repeat(${nbCol}, 1fr)`;
}

// Crée une cellule du plateau
function createCell(row, col, nbCol) {
  let newCell = document.createElement("div");
  newCell.classList.add("cell");
  newCell.id = "cell" + (nbCol * row + col);

  newCell.setAttribute("row", row);
  newCell.setAttribute("col", col);

  newCell.addEventListener("click", () => handleCellClick(newCell, row, col, nbCol));
  return newCell;
}

// Gère le clic sur une cellule
function handleCellClick(newCell, row, col, nbCol) {
  if (!newCell.hasAttribute("selectedBy")) {
    history.push([row, col]);

    if (eraseLast.checked) {
      handleEraseLast(nbCol);
    }

    newCell.setAttribute("selectedBy", turn % nbPlayer);
    boardState[row][col] = turn % nbPlayer;

    let result = hasWonOn(boardState, boardState.length);
    if (result == 0) {
      showMessage("Match nul");
    } else if (result == -1) {
      nextTurn(nbCol);
    } else {
      console.log("result", result);
      showMessage(
        "Player " +
          (boardState[result[0]][result[1]] + 1) +
          " has won on " +
          result[0] +
          result[1] +
          result[2]
      );
    }
  }
}

// Gère la suppression des anciens mouvements
function handleEraseLast(nbCol) {
  if (history.length > 6) {
    let lastMove = history.shift();
    let lastCell = document.querySelector(
      "#cell" + (nbCol * lastMove[0] + lastMove[1])
    );
    lastCell.removeAttribute("selectedBy");
    lastCell.removeAttribute("ghostCell");
    boardState[lastMove[0]][lastMove[1]] = "";

    let eraseNext = history[0];
    let ghostCell = document.querySelector(
      "#cell" + (nbCol * eraseNext[0] + eraseNext[1])
    );
    ghostCell.setAttribute("ghostCell", true);
  }
}

function nextTurn(size) {
  turn++;
  updateTurncounter();
  if (
    turn % nbPlayer == 0 &&
    !isNaN(player1IA.value) &&
    Number(player1IA.value) > 0
  ) {
    let cell = morpionIATurn(boardState, turn % nbPlayer, player1IA.value);
    let row = cell[0];
    let col = cell[1];
    setTimeout(() => {
      document.querySelector("#cell" + (size * row + col)).click();
    }, 1000);
  }
  if (
    turn % nbPlayer == 1 &&
    !isNaN(player2IA.value) &&
    Number(player2IA.value) > 0
  ) {
    let cell = morpionIATurn(
      boardState,
      turn % nbPlayer,
      Number(player2IA.value)
    );
    let row = cell[0];
    let col = cell[1];
    setTimeout(() => {
      document.querySelector("#cell" + (size * row + col)).click();
    }, 1000);
  }
}

let whoseturn = document.createElement("div");
function updateTurncounter() {
  whoseturn.setAttribute("turn", turn % nbPlayer);
  whoseturn.innerText = "player " + (1 + (turn % nbPlayer));
  whoseturn.classList.add("turnCounter");
}

app.appendChild(whoseturn);

setupBoard(boardSize.value, boardSize.value);
