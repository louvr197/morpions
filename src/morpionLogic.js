function updateBoard(row, col) {}

export function hasWonOn(board, size = 3) {
  let empty = false;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] !== "") {
        // console.log("row", row, "col", col, "size", size);
        //verifier horizontale
        if (board[row].length >= col + size) {
          // console.log("horizontale", row, col, size);
          let horizontale = true;
          for (let i = 0; i < size && horizontale; i++) {
            if (board[row][col] !== board[row][col + i]) {
              horizontale = false;
            }
          }
          if (horizontale) return [row, col, "h"];
        }
        //verifier verticale

        if (board.length >= row + size) {
          // console.log("verticale", row, col, size);
          let verticale = true;
          for (let i = 0; i < size && verticale; i++) {
            // console.log(row+i,size);
            if (board[row][col] !== board[row + i][col]) {
              verticale = false;
            }
          }
          if (verticale) return [row, col, "v"];
        }
        //verifier diagonale descendante
        if (board.length >= row + size && board[row].length >= col + size) {
          let diagonale = true;
          // console.log("diagonale descendante", row, col, size);
          for (let i = 0; i < size && diagonale; i++) {
            if (board[row][col] !== board[row + i][col + i]) {
              diagonale = false;
            }
          }
          if (diagonale) return [row, col, "dd"];
        }
        //verifier diagonale ascendante
        if (board[row].length >= col + size && row - (size - 1) >= 0) {
          // console.log("diagonale ascendante", row, col, size);
          let diagonale = true;
          for (let i = 0; i < size && diagonale; i++) {
            if (board[row][col] !== board[row - i][col + i]) {
              diagonale = false;
            }
          }
          if (diagonale) return [row, col, "da"];
        }
      }
      else {
        empty = true;
      }
    }
  }
  if (!empty) return 0;
  // console.log("no winner");
  return -1;
}
