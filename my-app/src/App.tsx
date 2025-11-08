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

  function generateColumn(length: number): Square[] {
    let col = [];
    const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink"];
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    for (let i = 0; i < length; i++) {
      let colorsIndex = i % (colors.length);
      let octave = 4 + Math.floor(i / (notes.length - 1));
      col.push({
        color: colors[colorsIndex],
        note: notes[colorsIndex] + octave,
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
          return { ...square, active: !square.isSelected };
        }
        return square;
      })
    );
    setSquares(newSquares);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        <div id="top">
          this will hold restart
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
                  onClick={() => toggleSquare(colIndex, rowIndex)}
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
