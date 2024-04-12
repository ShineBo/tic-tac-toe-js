import React, { useEffect } from 'react';
import './App.css';
import Board from './Board';
import Square from './Square';
import { useState } from 'react';

const defaultSquare = () => (new Array(9)).fill(null);

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

function App() {

  const [ squares, setSquares ] = useState(defaultSquare());
  const [ winner, setWinnter ] = useState(null)
  const [ draw, setDraw ] = useState(null)

  useEffect(() => {

    if (winner || draw) {
      return;
    }

    const isComputerTurn = squares.filter(square => square != null).length % 2 === 1;

    const linesThatAre = (a,b,c) => { 
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map(index => squares[index])
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      })
    };

    const emptyIndex = squares
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null)

    const playerWon = linesThatAre('x','x','x').length > 0;

    const computerWon = linesThatAre('o','o','o').length > 0;

    if(playerWon) {
      setWinnter('x')
    }

    if(computerWon) {
      setWinnter('o')
    }

    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);      
    }
    if (isComputerTurn) {

      const winingLines = linesThatAre('o', 'o', null);

      if(winingLines.length > 0) {
        const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
        putComputerAt(winIndex);
        return
      }

      const linesToBlock = linesThatAre('x', 'x', null);

      if(linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex)
        return;
      }

      const linesToContinue = linesThatAre('o', null, null);

      if(linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }


      const randomIndex = emptyIndex[ Math.ceil(Math.random()*emptyIndex.length)]

      putComputerAt(randomIndex)
    }
  }, [squares, winner, draw])


  function handleSquareClick(index) {

    if (winner !== null) {
      return;
    }

    const isplayerTurn = squares.filter(square => square != null).length % 2 === 0;
    if (isplayerTurn) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);      
    }

    if(squares.filter(square => square != null).length === 9){
      setDraw('Draw')
      console.log("Draw")
    }    
  }
  return (
    <main>
      <Board>
        {squares.map((square, index) => 
          <Square
          x={square === 'x'?1:0}
          o={square === 'o'?1:0}
          onClick={() => handleSquareClick(index)} />
        )}
      </Board>
      {!!winner && winner === 'x' && (
        <div className='result green'>
          You Won!
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className='result red'>
          You Lost!
        </div>
      )}
      {draw === 'Draw' && (
        <div className='result yellow'>
          Draw!
        </div>
      )}
    </main>
  );
}

export default App;

