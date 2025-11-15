import * as Tone from "tone";

let synth: Tone.PolySynth;

interface Square {
    color: string;
    note: string;
    isSelected: boolean;
}

// tone expects a music note in this format: "C4"

const playNote = async (note: string) => {
    await Tone.start();
    if (!synth) synth = new Tone.PolySynth().toDestination();
    synth.triggerAttackRelease(note, 0.3);
}

let note_seq: Tone.Sequence;

// const playSequence = async () => {
//     await Tone.start();

//     let sequence_arr = [
//         "C3",
//         "B5",
//         "A4",
//         "F4",
//         "G5"
//     ];

//     if (!synth) {
//         synth = new Tone.PolySynth().toDestination();
//     }

//     note_seq = new Tone.Sequence((time, note) => {
//         synth.triggerAttackRelease(note, "4n", time);
//     }, sequence_arr, "4n");

//     note_seq.start(0);

//     Tone.getTransport().start();
// }

let chord_seq: Tone.Sequence;

const playSequence = async (squares: Square[][], tempo: number, drumsEnabled: boolean) => {
    await Tone.start();

    let chords = squares.map((col) => {
        let temp = col.map((square) => {
            return square.isSelected ? square.note : null;
        })
            .filter((val) => val !== null);
        return temp;
    });

    console.log(chords);

    if (!synth) {
        synth = new Tone.PolySynth().toDestination();
    }

    const beats = chords.map((_, i) => i);

    chord_seq = new Tone.Sequence((time, index) => {
        const chord = chords[index];
        if (chord && chord.length > 0) {
            synth.triggerAttackRelease(chord, "8n", time);
        }
    }, beats, "8n");

    chord_seq.start(0);

    if (drumsEnabled) {
        playDrums();
    }

    Tone.getTransport().bpm.value = tempo;

    Tone.getTransport().start();
}

let kick: Tone.MembraneSynth;
let snare: Tone.NoiseSynth;
let drum_seq: Tone.Sequence;

const playDrums = () => {
  // if there's an existing drum sequence, stop & dispose it first
  if (drum_seq) {
    drum_seq.stop();
    drum_seq.dispose();
    drum_seq = undefined as unknown as Tone.Sequence;
  }

  kick = new Tone.MembraneSynth().toDestination();
  snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
    }).toDestination();
    
    // Sequence using Tone.Sequence
  drum_seq = new Tone.Sequence((time, step) => {
    if (step.kick) kick.triggerAttackRelease("C1", "8n", time);
    if (step.snare) snare.triggerAttackRelease("8n", time);
  }, [
        { kick: true, snare: false },
        { kick: false, snare: true },
        { kick: true, snare: false },
        { kick: false, snare: true },
    ], "4n");

  //Starts the drum sequence on a slight delay
  drum_seq.start(0);
}

const stopPlaying = async () => {
    if (chord_seq) {
        chord_seq.stop(Tone.now() + 0.01);
        chord_seq.dispose();
    }

    if (drum_seq) {
        drum_seq.stop(Tone.now() + 0.01);
        drum_seq.dispose();
    }

    if (kick) {
        kick.dispose();
    }

    if (snare) {
        snare.dispose();
    }

    Tone.getTransport().stop();
}

export { playSequence, stopPlaying, playNote };