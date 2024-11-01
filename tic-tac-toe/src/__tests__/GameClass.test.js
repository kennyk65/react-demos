// GameClass.test.js
import GameClass from '../GameClass';

describe('GameClass', () => {
  let game;

  beforeEach(() => {
    game = new GameClass();
  });

  test('should start with an empty board', () => {
    expect(game.getCurrentSquares()).toEqual(Array(9).fill(null));
  });

  test('should alternate turns between X and O', () => {
    game.handlePlay(0); // X plays
    expect(game.getCurrentSquares()[0]).toBe('X');
    expect(game.isXNext()).toBe(false);
    game.handlePlay(1); // O plays
    expect(game.getCurrentSquares()[1]).toBe('O');
    expect(game.isXNext()).toBe(true);
  });

  test('should detect a win', () => {
    game.handlePlay(0); // X
    game.handlePlay(3); // O
    game.handlePlay(1); // X
    game.handlePlay(4); // O
    game.handlePlay(2); // X, winning move
    expect(game.calculateWinner(game.getCurrentSquares())).toBe('X');
  });

  test('should detect a stalemate', () => {
    game.history = [
      ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O']
    ];
    expect(game.isStalemate(game.getCurrentSquares())).toBe(true);

    game.history = [
      ['X', 'O', 'X', 'X', 'X', 'O', 'X', 'X', 'X']
    ];
    expect(game.isStalemate(game.getCurrentSquares())).toBe(false);

  });
});
