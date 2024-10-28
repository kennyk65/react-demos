//  The GameClass representing the data, object state, 
//  and game logic needed to operate a tic-tac-toe game:
class GameClass {
    constructor() {
      this.history = [Array(9).fill(null)];
      this.currentMove = 0;
    }
  
    isXNext() {
      return this.currentMove % 2 === 0;
    }
  
    getCurrentSquares() {
      return this.history[this.currentMove];
    }
    
    // Add a method to handle a play. 
    // This method will be called with the index of the square that was clicked:
    handlePlay(i) {
      const squares = this.getCurrentSquares();
  
      // Return early if square is already filled or we already have a winner:
      if(squares[i] || this.calculateWinner(squares)) { return; } 
  
      //  Make a shallow copy of the squares array
      //  Set the clicked square to X or O, depending on who is next:
      const nextSquares = squares.slice();
      nextSquares[i] = this.isXNext() ? 'X' : 'O';   
  
      //  Update the history with the new squares array:
      const nextHistory = [...this.history.slice(0, this.currentMove + 1), nextSquares];
  
      this.history = nextHistory;
      this.currentMove = nextHistory.length - 1;
    }
    
    jumpTo(nextMove) {
      console.log("Jumping from currentMove ", this.currentMove, " to ", nextMove);
      this.currentMove = nextMove;
    }
  
    getStatusString() {
      const squares = this.getCurrentSquares();
      const winner = this.calculateWinner(squares);
      if (winner) { return "Winner: " + winner; }
      if (this.isStalemate(squares)) { return "Stalemate"; }
      return "Next player: " + ( this.isXNext() ? "X" : "O");
    }
  
    calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    }
  
    isStalemate(squares) {
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          return false;
        }
      }
      return true
    }
  
};

export default GameClass;