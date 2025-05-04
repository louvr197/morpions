import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";
import { hasWonOn } from "./morpionLogic.js";
import { morpionIATurn } from "./morpionIA.js";

let app = document.querySelector("#app");
app.innerHTML = `
  
    <h1>Morpions</h1>
    <div class="board">
      
    </div>
  
`;

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
  turn = 0;
  updateTurncounter();
  // nbPlayer = playerOption.value;
  boardState = [];
  history = [];
  board.innerHTML = "";
  board.style.gridTemplate = `repeat(${nbRow},1fr)/repeat(${nbCol},1fr)`;

  for (let row = 0; row < nbRow; row++) {
    boardState[row] = [];
    for (let col = 0; col < nbCol; col++) {
      {
        boardState[row][col] = "";
        let newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.id = "cell" + (nbCol * row + col);

        newCell.setAttribute("row", row);
        newCell.setAttribute("col", col);
        newCell.addEventListener("click", () => {
          console.log(boardState);
          if (!newCell.hasAttribute("selectedBy")) {
            history.push([row, col]);
            if (eraseLast.checked) {
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
            newCell.setAttribute("selectedBy", turn % nbPlayer);
            boardState[row][col] = turn % nbPlayer;
            let result = hasWonOn(boardState, boardState.length);
            console.log(result);
            if (result == 0) {
              showMessage("Match nul");
            } else if (result == -1) {
              nextTurn();
            } else {
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
          // console.log(hasWonOn(boardState));
        });

        board.appendChild(newCell);
      }
    }
  }
}

function nextTurn() {
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
      document.querySelector("#cell" + (3 * row + col)).click();
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
      document.querySelector("#cell" + (3 * row + col)).click();
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
// board.before(whoseturn);

// let playerOption = document.createElement("input");
// playerOption.value = nbPlayer;
// playerOption.setAttribute("type", "number");
// playerOption.setAttribute("min", 0);
// playerOption.setAttribute("max", 4);
// app.appendChild(playerOption);

let settingsContainer = document.createElement("div");
settingsContainer.classList.add("settings");

// Add label for player1IA
let player1IALabel = document.createElement("label");
player1IALabel.setAttribute("for", "player1IA");
player1IALabel.classList.add("player1IA");
player1IALabel.innerText = " Player 1 AI Level: ";
settingsContainer.appendChild(player1IALabel);

let player1IA = document.createElement("input");
player1IA.classList.add("player1IA");
player1IA.setAttribute("id", "player1IA");
player1IA.setAttribute("name", "player1IA");
player1IA.value = 0;
player1IA.setAttribute("type", "number");
player1IA.setAttribute("min", 0);
player1IA.setAttribute("max", 4);
settingsContainer.appendChild(player1IA);

// Add label for player2IA
let player2IALabel = document.createElement("label");
player2IALabel.setAttribute("for", "player2IA");
player2IALabel.classList.add("player2IA");
player2IALabel.innerText = " Player 2 AI Level: ";
settingsContainer.appendChild(player2IALabel);

let player2IA = document.createElement("input");
player2IA.classList.add("player2IA");
player2IA.setAttribute("id", "player2IA");
player2IA.setAttribute("name", "player2IA");
player2IA.value = 0;
player2IA.setAttribute("type", "number");
player2IA.setAttribute("min", 0);
player2IA.setAttribute("max", 4);
settingsContainer.appendChild(player2IA);

let eraseLastLabel = document.createElement("label");
eraseLastLabel.setAttribute("for", "eraseLast");
eraseLastLabel.innerText = " Keep last 3 Moves: ";
settingsContainer.appendChild(eraseLastLabel);

let eraseLast = document.createElement("input");
eraseLast.setAttribute("id", "eraseLast");
eraseLast.setAttribute("name", "eraseLast");
eraseLast.setAttribute("type", "checkbox");
settingsContainer.appendChild(eraseLast);

app.appendChild(settingsContainer);

let reset = document.createElement("button");
reset.setAttribute("id", "reset");
reset.innerText = "reset";
reset.addEventListener("click", () => setupBoard());
settingsContainer.appendChild(reset);

let startAi = document.createElement("button");
startAi.setAttribute("id", "startAi");
startAi.innerText = "Start AI";
startAi.addEventListener("click", () => {
  if (Number(player1IA.value) > 0) {
    let cell = morpionIATurn(boardState, turn % nbPlayer, player1IA.value);
    let row = cell[0];
    let col = cell[1];
    setTimeout(() => {
      document.querySelector("#cell" + (3 * row + col)).click();
    }, 1000);
  }
});
settingsContainer.appendChild(startAi);

let messageContainer = document.createElement("div");
messageContainer.setAttribute("id", "messageContainer");
messageContainer.style.position = "fixed";
messageContainer.style.bottom = "1em";
messageContainer.style.left = "50%";
messageContainer.style.transform = "translateX(-50%)";
messageContainer.style.padding = "1em";
messageContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
messageContainer.style.color = "white";
messageContainer.style.borderRadius = "8px";
messageContainer.style.display = "none"; // Hidden by default
app.appendChild(messageContainer);

function showMessage(message, duration = 8000) {
  messageContainer.innerText = message;
  messageContainer.style.display = "block";

  setTimeout(() => {
    messageContainer.style.display = "none";
  }, duration);
}

setupBoard();
