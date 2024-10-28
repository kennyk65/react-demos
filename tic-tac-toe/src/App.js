import { useState } from 'react'
import GameClass from './GameClass'

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
    aria-label={'btn'+index}
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