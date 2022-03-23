// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = new Array(8);
  for (let i=0;i<8;i++){
    grid[i]= []
    for (let j = 0; j < 8; j++) {
      grid[i].push(undefined);
    }
  }
 
  grid[3][4] = new Piece("black")
  grid[4][3] = new Piece("black")

  grid[3][3] = new Piece("white")
  grid[4][4] = new Piece("white")
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];
  if (x < 0 || x > 7) return false;
  if (y < 0 || y > 7) return false;
  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error('Not valid pos!');
  }
  let x = pos[0];
  let y = pos[1];
  return this.grid[x][y];

};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.getPiece(pos) === undefined) return false;
  return this.getPiece(pos).color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== undefined;

};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  let arr = [];
  if (!this.isValidPos(pos)) return arr;
  let move1 = pos[0] + dir[0];
  let move2 = pos[1] + dir[1];

  while (this.isValidPos([move1, move2])){
    // if we hit an undefined piece, return empty array
    // if we hit our own piece first, return empty array
    if (!this.isOccupied([move1,move2])) return [];
    if (this.isMine([move1,move2],color)) return arr;
    arr.push([move1,move2]);
    move1+=dir[0];
    move2+=dir[1];
  }
  
  return [];
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) return false;
  for (let i=0;i<Board.DIRS.length;i++) {
    // debugger
    if ((this._positionsToFlip(pos, color, Board.DIRS[i]).length >= 1)) return true;
}
return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let x = pos[0];
  let y = pos[1];

  let answer_arr = [];

  if (this.validMove(pos, color)) {
    // debugger
    this.grid[x][y] = new Piece (color);

    for (let i=0;i < Board.DIRS.length;i++) {
      answer_arr = answer_arr.concat(this._positionsToFlip(pos, color, Board.DIRS[i]));
    }
  }
  else {
    throw new Error ("Invalid move!")
  }
  // debugger

  for (let i=0; i<answer_arr.length; i++){
    let x = answer_arr[i][0];
    let y = answer_arr[i][0];
    this.grid[x][y].color = color;    
  }

};


/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let answer = [];
  for (let i=0; i<this.grid.length; i++){
    for (let j=0; j<this.grid[0].length; j++){
      if (this.validMove([i,j],color)){
        answer.push([i,j]);
      }
    }
  }
  return answer;

};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
   return this.validMoves(color).length > 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("black") && !this.hasMove("black"))
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let i = 0; i < 8; i++) {
    let rowString = " " + i + " |";

    for (let j = 0; j < 8; j++) {
      let pos = [i, j];
      rowString +=
        (this.getPiece(pos) ? this.getPiece(pos).toString() : ".");
    }

    console.log(rowString);
  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE