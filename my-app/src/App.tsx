import { useEffect, useState } from 'react'
import './App.css'
import { playNote, playSequence } from './utils/utils'
interface Square {
  color: string;
  note: string;
  isSelected: boolean;
}

function App() {
  const [squares, setSquares] = useState<Square[][]>([]);
  const [drumsEnabled, setDrumsEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

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

  function handlePlayButton() {
    setPlaying(!playing);
    // playSequence(squares, 120, drumsEnabled);
  }

  function handleDrumsButton() {
    setDrumsEnabled(!drumsEnabled);
  }

  function handleBpmChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBpm(parseInt(event.target.value));
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const cancel = () => {
      setIsMouseDown(false);
      setDragMode(null);
    }

    window.addEventListener('mouseup', cancel);
    window.addEventListener('blur', cancel);
    window.addEventListener('dragend', cancel);

    return () => {
      window.removeEventListener('mouseup', cancel);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('dragend', cancel);
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
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onMouseDown={(e) => { e.preventDefault(); handleMouseDown(colIndex, rowIndex); }}
                  onMouseEnter={() => handleMouseEnter(colIndex, rowIndex)}
                >
                </div>
              ))}
            </div>
          ))}
        </div>
        <div id="bottom">
          <button onClick={handlePlayButton}>{playing ? "Pause" : "Play"}</button>
          <button onClick={handleDrumsButton}>{drumsEnabled ? "Disable Background Drums" : "Enable Background Drums"}</button>
          <div>
            <label htmlFor='bpmSlider'>BPM: {bpm}</label>
            <input id='bpmSlider'
              type='range'
              min={40}
              max={240}
              step={1}
              value={bpm}
              onChange={handleBpmChange}>
            </input>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
