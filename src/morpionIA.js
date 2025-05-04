export function morpionIATurn(board, player,level){
    console.log("morpionIATurn", player, level);
    switch(Number(level)){
        case 1:
            // console.log("IA1");
            return morpionAI1(board);
        case 2:
            // console.log("IA2");
            return morpionAI2(board, player);
        case 3:
            // console.log("IA3");
            return morpionAI3(board, player);
        case 4:
            // console.log("IA4");
            return morpionAI4(board, player);
    }
    return -1;
}

function morpionAI2(board, player) {
    console.log("IA2");
    // Example logic for morpionAI2
    let emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return -1;
    return emptyCells[0]; // Select the first empty cell
}

function morpionAI3(board, player) {
    console.log("IA3");
    // Example logic for morpionAI3
    let emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return -1;
    return emptyCells[emptyCells.length - 1]; // Select the last empty cell
}

function morpionAI4(board, player) {
    console.log("IA4");
    // Example logic for morpionAI4
    let emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return -1;
    return emptyCells[Math.floor(emptyCells.length / 2)]; // Select the middle empty cell
}
function getEmptyCells(board) {
    let emptyCells = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === "") {
                emptyCells.push([row, col]);
            }
        }
    }
    return emptyCells;
}

function morpionAI1(board){
    console.log("IA1");
    let emptyCells = getEmptyCells(board);
    if(emptyCells.length == 0) return -1;
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let selected = emptyCells[randomIndex];
    console.log("selected", selected);
    return selected;
}