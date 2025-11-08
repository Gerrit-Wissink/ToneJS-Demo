import * as Tone from "tone";
interface Square {
  color: string;
  note: string;
  isSelected: boolean;
}
let synth: Tone.PolySynth;
let chord_seq: Tone.Sequence;
let kick: Tone.MembraneSynth;
let snare: Tone.NoiseSynth;



// Expects the squares array
// Containing some arrays with selected values and some arrays that are empty
const playSequence = async (squares: Square[][], tempo: number, drumsEnabled: boolean) => {
    await Tone.start();

    let chords = squares.map((prev) => {
        let temp = prev.map((col) => {
            return col.isSelected ? col.note : '';
        })
        return temp;
    });

    console.log(chords);

    stopPlaying();

    synth = new Tone.PolySynth().toDestination();
    console.log(chords);
    chord_seq = new Tone.Sequence((time, chord) => {
      synth.triggerAttackRelease(chord, "8n", time);
    }, chords, "8n");

    chord_seq.start(0); // start at beginning of transport timeline
    if(drumsEnabled){
      playDrums();
    }
    Tone.Transport.bpm.value = tempo;
    console.log(Tone.Transport.bpm.value = tempo);

    Tone.Transport.start();
}

const playNote = async (note: string) => {
  await Tone.start();
  if (!synth) synth = new Tone.PolySynth().toDestination();
  synth.triggerAttackRelease(note, 0.3);
};


async function stopPlaying(){
    if (chord_seq) {
      console.log("Destroying the chord seqence");
      chord_seq.stop();
      chord_seq.dispose();
    }
    if (synth) {
      console.log("Destroying the synth");
      synth.dispose();
    }
    if (kick) {
      console.log("Destroying the kick");
      kick.dispose();
    }
    if (snare) {
      console.log("Destroying the snare");
      snare.dispose();
    }

    Tone.Transport.stop();
}


const playDrums = () => {
    kick = new Tone.MembraneSynth().toDestination();
    snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
    }).toDestination();
    
    // Sequence using Tone.Sequence
    const drumSequence = new Tone.Sequence((time, step) => {
        if (step.kick) kick.triggerAttackRelease("C1", "8n", time);
        if (step.snare) snare.triggerAttackRelease("8n", time);
    }, [
        { kick: true, snare: false },
        { kick: false, snare: true },
        { kick: true, snare: false },
        { kick: false, snare: true },
    ], "4n");

    drumSequence.start(0);
}

export { playSequence, stopPlaying, playNote };