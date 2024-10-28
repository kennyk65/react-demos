// Game.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from '../App';


test('should render the initial game state', async () => {
  render(<Game />);
  expect(await screen.findByText('Next player: X')).toBeInTheDocument();
});


test('should handle player moves correctly', () => {
  const { container } = render(<Game />);
  
  // Simulate X and O moves
  const square0 = screen.getByRole('button', { name: 'btn0' });
  fireEvent.click(square0);
  expect(square0).toHaveTextContent('X');
  expect(screen.getByText('Next player: O')).toBeInTheDocument();
  expect(screen.getByText('Go to move 1')).toBeInTheDocument();

  const square1 = screen.getByRole('button', { name: 'btn1' });
  fireEvent.click(square1);
  expect(square1).toHaveTextContent('O');
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(screen.getByText('Go to move 2')).toBeInTheDocument();

});

test('should update game history on move', () => {
  render(<Game />);

  const square0 = clickSquare(0); // X
  const square1 = clickSquare(1); // O
  const square2 = clickSquare(2); // X

  expect(square0).toHaveTextContent('X');
  expect(square1).toHaveTextContent('O');
  expect(square2).toHaveTextContent('X');

  const moveButton = screen.getByText('Go to move 1');
  expect(moveButton).toBeInTheDocument();
  fireEvent.click(moveButton);
  expect(screen.getByText('Next player: O')).toBeInTheDocument();

  expect(square0).toHaveTextContent('X');
  expect(square1).toHaveTextContent('');
  expect(square2).toHaveTextContent('');

});


function clickSquare(i) {
  const square = screen.getByRole('button', { name: `btn${i}` });
  fireEvent.click(square);
  return square;
}