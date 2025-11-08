import { useEffect, useState } from 'react'
import './App.css'
import { playNote } from './utils/utils'
interface Square {
  color: string;
  note: string;
  isSelected: boolean;
}

function App() {
  const [count, setCount] = useState(0)
  const [squares, setSquares] = useState<Square[][]>([]);
  const [drumsEnabled, setDrumsEnabled] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  function generateColumn(length: number): Square[] {
    let col = [];
    const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink"];
    const notes = ["C", "D", "E", "F", "G", "A", "B"];

    for (let i = 0; i < length; i++) {
      let reverseI = length - 1 - i; // reverses i to ensure top = high pitch, bottom = low pitch

      let colorsIndex = reverseI % colors.length;
      let noteIndex = reverseI % notes.length;
      let octave = 4 + Math.floor(reverseI / notes.length);

      col.push({
        color: colors[colorsIndex],
        note: notes[noteIndex] + octave,
        isSelected: false
      });
    }
    return col;
  }

  function init() {
    const numW = 32,
      numH = 14;

    const newSquares: Square[][] = [];
    for (let i = 0; i < numW; i++) {
      newSquares.push(generateColumn(numH));
    }

    setSquares(newSquares);
  }

  function toggleSquare(colIndex: number, rowIndex: number) {
    const newSquares = squares.map((col, cIdx) =>
      col.map((square, rIdx) => {
        if (cIdx === colIndex && rIdx === rowIndex) {
          if (!square.isSelected) {
            playNote(square.note);
          }
          return { ...square, isSelected: !square.isSelected };
        }
        return square;
      })
    );
    setSquares(newSquares);
  }

  function handleMouseDown(colIndex: number, rowIndex: number) {
    setIsMouseDown(true);
    const currentSquare = squares[colIndex][rowIndex];
    // set the drag mode based off the first 'interacted with' square
    setDragMode(currentSquare.isSelected ? 'deselect' : 'select');
    toggleSquare(colIndex, rowIndex);
  }

  function handleMouseEnter(colIndex: number, rowIndex: number) {
    if (!isMouseDown || dragMode === null) return;

    const currentSquare = squares[colIndex][rowIndex];

    // only toggle if square state doesn't match the current drag mode
    if (dragMode === 'select' && !currentSquare.isSelected) {
      toggleSquare(colIndex, rowIndex);
    } else if (dragMode === 'deselect' && currentSquare.isSelected) {
      toggleSquare(colIndex, rowIndex);
    }
  }

  function handleMouseUp() {
    setIsMouseDown(false);
    setDragMode(null);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, []);

  return (
    <>
      <div>
        <div id="top">
          <button id='restart' onClick={init}>Restart</button>
        </div>
        <div id='canvas'>
          {squares.map((column, colIndex) => (
            <div key={colIndex} className="column">
              {column.map((square: Square, rowIndex: number) => (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`square ${square.isSelected ? 'active' : ''}`}
                  data-note={square.note}
                  data-color={square.color}
                  style={{
                    backgroundColor: square.isSelected ? square.color.toLowerCase() : 'transparent'
                  }}
                  onMouseDown={() => handleMouseDown(colIndex, rowIndex)}
                  onMouseEnter={() => handleMouseEnter(colIndex, rowIndex)}
                >
                </div>
              ))}
            </div>
          ))}
        </div>
        <div id="bottom">
          this will hold controls
        </div>
      </div>
    </>
  )
}

export default App
