function checkDirection(board, row, col, size, player, direction) {
  let score = 0;
  let bestSpot = [row, col];
  let cPlayer = board[row][col];
  let count = 0;
  if (direction === "h" && size+row >= board.length) {
    // console.log("Horizontal out of bounds");
    return {"count":-1,bestSpot,cPlayer} ; // Horizontal
  }
  if (direction === "v" && size+col >= board[row].length){
    // console.log("Vertical out of bounds");
    return {"count":-1,bestSpot,cPlayer} ; // Vertical
  }
  if (direction === "dd" && size+row >= board.length){
    // console.log("Descending diagonal out of bounds");
    return {"count":-1,bestSpot,cPlayer} ; // Descending diagonal
    } 
  if (direction === "dd" && size+col >= board[row].length){
    // console.log("Descending diagonal out of bounds");
    return {"count":-1,bestSpot,cPlayer} ; // Descending diagonal
    }

  for (let i = 0; i < size; i++) {
    let r = row,
      c = col;

    // Adjust row and column based on direction
    if (direction === "h") c += i; // Horizontal
    if (direction === "v") r += i; // Vertical
    if (direction === "dd") {
      r += i;
      c += i;
    } // Descending diagonal
    if (direction === "da") {
      r -= i;
      c += i;
    } // Ascending diagonal

    // Check bounds and cell content
    if (r >= 0 && r < board.length && c >= 0 && c < board[r].length) {
      if (board[r][c] !== "") {
        if (cPlayer === "") {
          cPlayer = board[r][c];
          count++;
        } else if (cPlayer === board[r][c]) {
          count++;
        } else if (cPlayer !== board[r][c]) {
          console.log("Different player", cPlayer, board[r][c]);
          count = 0;
          break;
        }
      } else {
        bestSpot = [r, c];
      }
    } else {
      console.log("Out of bounds 2");
      count = 0;
      break;
    }
  }

  return { count, bestSpot, cPlayer };
}

export function hasWonOn(board, size = 3) {
  let empty = false;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] !== "") {
        const directions = ["h", "v", "dd", "da"];
        for (const direction of directions) {
          const { count } = checkDirection(
            board,
            row,
            col,
            size,
            board[row][col],
            direction
          );
          if (count === size) {
            return [row, col, direction]; // Winner found
          }
        }
      } else {
        empty = true; // Mark that there are still empty cells
      }
    }
  }

  return empty ? -1 : 0; // Return -1 if no winner but the board is not full, 0 if it's a tie
}

export function findBestMove(board, player, size = 3) {
  let score = 0;
  let bestMove = [];
  let bestSpot = [0, 0];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const directions = ["h", "v", "dd", "da"].sort(() => Math.random() - 0.5);
      for (const direction of directions) {
        const {
          count,
          bestSpot: spot,
          cPlayer,
        } = checkDirection(board, row, col, size, player, direction);


        if (count > score || (count === score && player === cPlayer)) {
          score = count;
          bestMove = [row, col, direction, cPlayer];
          bestSpot = spot;
        }
      }
    }
  }
  if (score === 0 || board[Math.floor(size/2)][ Math.floor(size/2)]=== "") {
    // If no score, select the center cell if it's empty
    // console.log("Center cell is empty, selecting it as the best move.");
    bestSpot = [Math.floor(size/2), Math.floor(size/2)];
  }
// console.log("Best move:", bestMove, "Best spot:", bestSpot);
  return {"bestMove":bestMove, "bestSpot":bestSpot, "score":score}; // Return the best move and its score
}
