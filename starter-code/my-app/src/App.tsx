import { useEffect, useState } from 'react'
import './App.css'
// import { playNote, playSequence, stopPlaying } from './utils/player';
interface Square {
    color: string;
    note: string;
    isSelected: boolean;
}

function App() {
    const [squares, setSquares] = useState<Square[][]>([]);
    const [drumsEnabled, setDrumsEnabled] = useState(false);
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

    function init() { }

    function toggleSquare(colIndex: number, rowIndex: number) { }

    function handleMouseDown(colIndex: number, rowIndex: number) { }

    function handleMouseEnter(colIndex: number, rowIndex: number) { }

    function handlePlayButton() { }

    function handleDrumsButton() { }

    function handleBpmChange(event: React.ChangeEvent<HTMLInputElement>) { }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => { }, []);

    return (
        // <div>
        //     <div id="top">
        //         <button id='restart' onClick={init}>Restart</button>
        //     </div>
        //     <div id='canvas'>
        //         {squares.map((column, colIndex) => (
        //             <div key={colIndex} className='column'>
        //                 {column.map((square: Square, rowIndex: number) => (
        //                     <div
        //                         key={`${colIndex}-${rowIndex}`}
        //                         className={`square ${square.isSelected ? 'active' : ''}`}
        //                         data-note={square.note}
        //                         data-color={square.color}
        //                         style={{
        //                             backgroundColor: square.isSelected ? square.color.toLowerCase() : 'transparent'
        //                         }}
        //                         draggable={false}
        //                         onDragStart={(e) => e.preventDefault()}
        //                         onMouseDown={(e) => { e.preventDefault(); handleMouseDown(colIndex, rowIndex); }}
        //                         onMouseEnter={() => handleMouseEnter(colIndex, rowIndex)}
        //                     >
        //                     </div>
        //                 ))}
        //             </div>
        //         ))}
        //     </div>
        //     <div id='bottom'>
        //         <button onClick={handlePlayButton}>{playing ? "Pause" : "Play"}</button>
        //         <button onClick={handleDrumsButton}>{drumsEnabled ? "Disable Background Drums" : "Enable Background Drums"}</button>
        //         <div>
        //             <label htmlFor='bpmSlider'>BPM: {bpm}</label>
        //             <input id='bpmSlider'
        //                 type='range'
        //                 min={40}
        //                 max={240}
        //                 step={1}
        //                 value={bpm}
        //                 onChange={handleBpmChange}>
        //             </input>
        //         </div>
        //     </div>
        // </div>
        <div>
            <button>Play Note</button>
            <button>Play Sequence</button>
            <button>Stop Sequence</button>
        </div>
    )
}

export default App