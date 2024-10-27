import { useState } from 'react'

// The Tic-Tac-Toe game component hosts the game board and game history components.
// It also manages the game state.  See the GameClass class below for the game logic.
export default function Game() {
  const [games, setGameData] = useState([new GameClass()]);
  const game = games[games.length-1];

  function handlePlay(i) {
    game.handlePlay(i);
    setGameData([...games, game]);  // Save state, re-render.
  } ;

  function jumpTo(move) {
    game.jumpTo(move);
    setGameData([...games, game]);  // Save state, re-render.
  }; 

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{game.getStatusString()}</div>
        <Board game={game} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <GameHistory game={game} onJump={jumpTo} />
      </div>
    </div>
  );
}

//  The main game board is a 3x3 grid of squares.  
//  The actual squares are represented by a 9-element array.
//  The board also displays the current game status.
export function Board({ game, onPlay }) {

  const squares = game.getCurrentSquares();
  return (
  <>
    <div className="board-row">
    <Square squares={squares} index={0} onSquareClick={onPlay} />
    <Square squares={squares} index={1} onSquareClick={onPlay} />
    <Square squares={squares} index={2} onSquareClick={onPlay} />
    </div>
    <div className="board-row">
    <Square squares={squares} index={3} onSquareClick={onPlay} />
    <Square squares={squares} index={4} onSquareClick={onPlay} />
    <Square squares={squares} index={5} onSquareClick={onPlay} />
    </div>
    <div className="board-row">
    <Square squares={squares} index={6} onSquareClick={onPlay} />
    <Square squares={squares} index={7} onSquareClick={onPlay} />
    <Square squares={squares} index={8} onSquareClick={onPlay} />
    </div>

  </>
)
}

// Each individual game square gets its value from its relative index in the squares array.
// The handleClick function is called with the index of the square that was clicked.
function Square({squares, index, onSquareClick}) {
  return <button 
    className="square" 
    onClick={ () => onSquareClick(index) }>
      {squares[index]}
    </button>
}


//  GameHistory is an ordered list of buttons 
//  which allow the user to jump to a previous move.
export function GameHistory({game, onJump}) {
  return (
    <>
      <ol>
        {game.history.map((squares, move) => {
          const description = move > 0 ? 'Go to move ' + move : 'Go to game start';
          return (
          <li key={move}>
            <button onClick={() => onJump(move)}>{description}</button>
          </li>
          );
      })}
      </ol>
    </>
  );
}


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
