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
      } else {
        empty = true;
      }
    }
  }
  if (!empty) return 0;
  // console.log("no winner");
  return -1;
}
function checkDirection(board, row, col, size, player, direction) {
  let score = 0;
  let bestSpot = [row, col];
  let cPlayer = board[row][col];
  let count = 0;

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
        } else {
          count = 0;
          break;
        }
      } else {
        bestSpot = [r, c];
      }
    } else {
      count = 0;
      break;
    }
  }

  return { count, bestSpot, cPlayer };
}

export function findBestMove(board, size = 3, player) {
  let score = 0;
  let bestMove = [];
  let bestSpot = [0, 0];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const directions = ["h", "v", "dd", "da"];
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

  return [bestMove, bestSpot];
}




// export function findBestMove(board, size = 3, player) {
//   let score = 0;
//   let bestMove = [];
//   let bestSpot = [0, 0];
//   for (let row = 0; row < board.length; row++) {
//     for (let col = 0; col < board[row].length; col++) {
//       let cPlayer = board[row][col];

//       // verifier horizontale
//       if (board[row].length >= col + size) {
//         let horizontale = 0;
//         let spot = [row, col];
//         for (let i = 0; i < size; i++) {
//           if (board[row][col + i] !== "") {
//             if (cPlayer === "") {
//               cPlayer = board[row][col + i];
//               horizontale++;
//             } else if (cPlayer === board[row][col + i]) {
//               horizontale++;
//             } else {
//               horizontale = 0;
//             }
//           } else {
//             spot = [row, col + i];
//           }
//         }
//         if (
//           horizontale > score ||
//           (horizontale === score && player === cPlayer)
//         ) {
//           bestMove = [row, col, "h", cPlayer];
//           bestSpot = spot;
//         }
//       }

//       // verifier verticale
//       if (board.length >= row + size) {
//         let verticale = 0;
//         let spot = [row, col];
//         cPlayer = board[row][col];
//         for (let i = 0; i < size; i++) {
//           if (board[row + i][col] !== "") {
//             if (cPlayer === "") {
//               cPlayer = board[row + i][col];
//               verticale++;
//             } else if (cPlayer === board[row + i][col]) {
//               verticale++;
//             } else {
//               verticale = 0;
//             }
//           } else {
//             spot = [row + i, col];
//           }
//         }
//         if (verticale > score || (verticale === score && player === cPlayer)) {
//           bestMove = [row, col, "v", cPlayer];
//           bestSpot = spot;
//         }
//       }

//       // verifier diagonale descendante
//       if (board.length >= row + size && board[row].length >= col + size) {
//         let diagonale = 0;
//         let spot = [row, col];
//         cPlayer = board[row][col];
//         for (let i = 0; i < size; i++) {
//           if (board[row + i][col + i] !== "") {
//             if (cPlayer === "") {
//               cPlayer = board[row + i][col + i];
//               diagonale++;
//             } else if (cPlayer === board[row + i][col + i]) {
//               diagonale++;
//             } else {
//               diagonale = 0;
//             }
//           } else {
//             spot = [row + i, col + i];
//           }
//         }
//         if (diagonale > score || (diagonale === score && player === cPlayer)) {
//           bestMove = [row, col, "dd", cPlayer];
//           bestSpot = spot;
//         }
//       }

//       // verifier diagonale ascendante
//       if (board[row].length >= col + size && row - (size - 1) >= 0) {
//         let diagonale = 0;
//         let spot = [row, col];
//         cPlayer = board[row][col];
//         for (let i = 0; i < size; i++) {
//           if (board[row - i][col + i] !== "") {
//             if (cPlayer === "") {
//               cPlayer = board[row - i][col + i];
//               diagonale++;
//             } else if (cPlayer === board[row - i][col + i]) {
//               diagonale++;
//             } else {
//               diagonale = 0;
//             }
//           } else {
//             spot = [row - i, col + i];
//           }
//         }
//         if (diagonale > score || (diagonale === score && player === cPlayer)) {
//           bestMove = [row, col, "da", cPlayer];
//           bestSpot = spot;
//         }
//       }
//     }
//   }
//   return [bestMove, bestSpot];
// }
// // }
// // if (!empty) return 0;
// // // console.log("no winner");
// // return -1;
// // }
